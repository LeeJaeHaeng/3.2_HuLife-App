import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllCommunitiesAPI, getAllPostsAPI, requestJoinCommunityAPI } from '../api/communityService';
import { logActivity, ActivityTypes } from '../api/activityService';
import hobbyImages from '../assets/hobbyImages';
import { API_URL } from '../api/apiClient';

// Image URLs are now resolved using API_URL from apiClient

export default function CommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' or 'posts'
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [communitiesData, postsData] = await Promise.all([
        getAllCommunitiesAPI(),
        getAllPostsAPI()
      ]);

      setCommunities(communitiesData);
      setPosts(postsData);
      console.log('[커뮤니티] 데이터 로드 성공:', {
        communities: communitiesData.length,
        posts: postsData.length
      });
    } catch (error) {
      console.error('[커뮤니티] 데이터 로드 실패:', error);
      Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 🔔 전역 이벤트 리스너: 게시글 좋아요 상태 변경 감지
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('POST_LIKE_CHANGED', (data) => {
      console.log('[커뮤니티] 🔔 게시글 좋아요 변경 이벤트 수신:', data);
      // 게시글 목록에서 해당 게시글의 좋아요 수 업데이트
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === data.postId
            ? { ...post, likes: data.likes }
            : post
        )
      );
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Filter communities
  const filteredCommunities = communities.filter(community => {
    const matchesSearch = searchQuery
      ? community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesLocation = locationFilter !== 'all'
      ? community.location.startsWith(locationFilter) || community.location.includes(locationFilter)
      : true;

    return matchesSearch && matchesLocation;
  });

  // Filter posts by category
  const filteredPosts = posts.filter(post => {
    return categoryFilter === 'all' || post.category === categoryFilter;
  });

  // Log search activity with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return;

    const timeoutId = setTimeout(() => {
      logActivity(ActivityTypes.SEARCH, null, {
        searchQuery: searchQuery.trim(),
        context: activeTab === 'groups' ? 'communities' : 'posts',
        resultsCount: activeTab === 'groups' ? filteredCommunities.length : filteredPosts.length
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab, filteredCommunities.length, filteredPosts.length]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Handle join community
  const handleJoinCommunity = async (communityId, memberCount, maxMembers) => {
    if (memberCount >= maxMembers) {
      Alert.alert('알림', '모임 정원이 마감되었습니다.');
      return;
    }

    Alert.alert(
      '가입 신청',
      '이 모임에 가입 신청하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '신청',
          onPress: async () => {
            try {
              await requestJoinCommunityAPI(communityId);
              Alert.alert('성공', '가입 신청이 완료되었습니다!');
              loadData(); // Refresh data
            } catch (error) {
              Alert.alert('오류', error.message);
            }
          }
        }
      ]
    );
  };

  // Render community card (컴팩트 버전)
  const renderCommunityCard = (community) => {
    // 취미 이름으로 hobbyImages에서 이미지 가져오기
    const getImageSource = () => {
      console.log('[커뮤니티 이미지] hobbyName:', community.hobbyName, 'imageUrl:', community.imageUrl);

      // 1. hobbyName이 있으면 hobbyImages에서 직접 찾기 (가장 확실한 방법)
      if (community.hobbyName && hobbyImages[community.hobbyName]) {
        console.log('[커뮤니티 이미지] ✅ hobbyName으로 이미지 찾음:', community.hobbyName);
        return hobbyImages[community.hobbyName];
      }

      // 2. 서버 업로드 이미지인지 확인 (/uploads/, /public/ 등)
      if (community.imageUrl?.includes('uploads') || community.imageUrl?.includes('public')) {
        const absoluteUrl = community.imageUrl.startsWith('/')
          ? `${API_URL}${community.imageUrl}`
          : `${API_URL}/${community.imageUrl}`;
        console.log('[커뮤니티 이미지] ✅ 서버 업로드 이미지 사용:', absoluteUrl);
        return { uri: absoluteUrl };
      }

      // 3. HTTP URL인 경우
      if (community.imageUrl?.startsWith('http')) {
        console.log('[커뮤니티 이미지] HTTP URL 사용');
        return { uri: community.imageUrl };
      }

      // 4. 기본 이미지
      console.log('[커뮤니티 이미지] ❌ 이미지를 찾을 수 없음, 기본 이미지 사용');
      return require('../assets/hobbies/hulife_logo.png');
    };

    return (
      <TouchableOpacity
        key={community.id}
        style={styles.card}
        onPress={() => router.push(`/community/${community.id}`)}
      >
        <View style={styles.cardRow}>
          <Image
            source={getImageSource()}
            style={styles.cardImage}
          />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{community.name}</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="people" size={12} color="#FF7A5C" />
              <Text style={styles.memberBadgeText}>
                {community.memberCount}/{community.maxMembers}
              </Text>
            </View>
          </View>

          <Text style={styles.cardDescription} numberOfLines={2}>
            {community.description}
          </Text>

          <View style={styles.cardInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.infoText} numberOfLines={1}>{community.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.infoText} numberOfLines={1}>{community.schedule}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  // Render post card
  const renderPostCard = (post) => (
    <TouchableOpacity
      key={post.id}
      style={styles.postCard}
      onPress={() => router.push(`/community/posts/${post.id}`)}
    >
      <View style={styles.postHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {post.content}
      </Text>

      <View style={styles.postFooter}>
        <View style={styles.postAuthor}>
          <View style={styles.postAuthorAvatar}>
            {post.userImage ? (
              <Image
                source={{ uri: post.userImage }}
                style={styles.postAuthorAvatarImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.postAuthorAvatarText}>
                {post.userName?.[0] || 'U'}
              </Text>
            )}
          </View>
          <View style={styles.postAuthorInfo}>
            <Text style={styles.authorName} numberOfLines={1}>{post.userName}</Text>
            <Text style={styles.postDate}>
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </View>
        </View>

        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={16} color="#666" />
            <Text style={styles.statText}>{post.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color="#666" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.statText}>{post.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A5C" />
          <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <TouchableOpacity
          onPress={() => {
            if (activeTab === 'groups') {
              router.push('/community/create');
            } else {
              router.push('/community/posts/create');
            }
          }}
          style={styles.createButton}
        >
          <Ionicons name="add-circle" size={28} color="#FF7A5C" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            모임 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            게시판
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'groups' ? (
          <>
            {/* Search and Filter */}
            <View style={styles.filterContainer}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="모임 이름 또는 설명으로 검색"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationFilters}>
                {['all', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map(location => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.filterChip,
                      locationFilter === location && styles.activeFilterChip
                    ]}
                    onPress={() => setLocationFilter(location)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      locationFilter === location && styles.activeFilterChipText
                    ]}>
                      {location === 'all' ? '전체' : location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Communities Grid */}
            {filteredCommunities.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>검색 결과가 없습니다.</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {filteredCommunities.map(renderCommunityCard)}
              </View>
            )}
          </>
        ) : (
          <>
            {/* Category Filter for Posts */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationFilters}>
                {['all', '자유게시판', '질문/답변', '정보공유'].map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      categoryFilter === category && styles.activeFilterChip
                    ]}
                    onPress={() => setCategoryFilter(category)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      categoryFilter === category && styles.activeFilterChipText
                    ]}>
                      {category === 'all' ? '전체' : category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Post List */}
            {filteredPosts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  {posts.length === 0 ? '아직 작성된 게시글이 없습니다.' : '검색 결과가 없습니다.'}
                </Text>
                {posts.length === 0 && (
                  <Text style={styles.emptyStateSubtext}>
                    첫 번째 게시글을 작성해보세요!
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.postList}>
                {filteredPosts.map(renderPostCard)}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 18,  // 16→18
    fontSize: 18,  // 16→18 for readability
    color: '#4B5563',  // Darker color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,  // 12→14 for better spacing
    borderBottomWidth: 2,  // 1→2 for better visibility
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 6,  // 4→6 for larger touch area
    minWidth: 36,  // Added minimum touch target
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,  // 20→24 for readability
    fontWeight: 'bold',
  },
  createButton: {
    padding: 6,  // 4→6 for larger touch area
    minWidth: 36,  // Added minimum touch target
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 2,  // 1→2 for better visibility
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 18,  // 16→18 for better spacing
    minHeight: 56,  // Added minimum touch target
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,  // 2→3 for better visibility
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF7A5C',
  },
  tabText: {
    fontSize: 18,  // 16→18 for readability
    color: '#4B5563',  // Darker color
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF7A5C',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    padding: 18,  // 16→18 for better spacing
    borderBottomWidth: 2,  // 1→2 for better visibility
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 14,  // 12→14
    marginBottom: 14,  // 12→14
    minHeight: 56,  // Added minimum touch target
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,  // 12→14
    paddingHorizontal: 10,  // 8→10
    fontSize: 18,  // 16→18 for readability
  },
  locationFilters: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 18,  // 16→18
    paddingVertical: 10,  // 8→10
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,  // 8→10
    minHeight: 42,  // Added minimum touch target
  },
  activeFilterChip: {
    backgroundColor: '#FF7A5C',
  },
  filterChipText: {
    fontSize: 16,  // 14→16 for readability
    color: '#4B5563',  // Darker color
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  grid: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,  // 12→16 for better spacing
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 110,  // 100→110 for better visibility
    height: 110,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    flex: 1,
    padding: 14,  // 12→14 for better spacing
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,  // 6→8
  },
  cardTitle: {
    fontSize: 18,  // 16→18 for readability
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,  // 8→10
    lineHeight: 24,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FF',
    paddingHorizontal: 10,  // 8→10
    paddingVertical: 5,  // 4→5
    borderRadius: 12,
    gap: 5,  // 4→5
  },
  memberBadgeText: {
    color: '#FF7A5C',
    fontSize: 13,  // 11→13 for readability
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 15,  // 13→15 for readability
    color: '#4B5563',  // Darker color
    marginBottom: 10,  // 8→10
    lineHeight: 21,  // 18→21
  },
  cardInfo: {
    gap: 6,  // 4→6
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,  // 12→14 for readability
    color: '#4B5563',  // Darker color
    marginLeft: 7,  // 6→7
    flex: 1,
  },
  postList: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,  // 16→18 for better spacing
    marginBottom: 16,  // 12→16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    marginBottom: 14,  // 12→14
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,  // 12→14
    paddingVertical: 6,  // 4→6
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,  // 12→14 for readability
    color: '#4B5563',  // Darker color
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 20,  // 18→20 for readability
    fontWeight: 'bold',
    marginBottom: 10,  // 8→10
    lineHeight: 28,
  },
  postContent: {
    fontSize: 16,  // 14→16 for readability
    color: '#4B5563',  // Darker color
    marginBottom: 18,  // 16→18
    lineHeight: 24,  // 20→24
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,  // 8→10
    flex: 1,  // 공간을 차지하되 축소 가능
    minWidth: 0,  // text overflow를 위해 필요
  },
  postAuthorAvatar: {
    width: 36,  // 32→36 for better visibility
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  postAuthorAvatarImage: {
    width: 36,  // 32→36
    height: 36,
  },
  postAuthorAvatarText: {
    color: '#fff',
    fontSize: 16,  // 14→16 for readability
    fontWeight: 'bold',
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,  // 14→16 for readability
    color: '#333',
    fontWeight: '600',
  },
  postDate: {
    fontSize: 14,  // 12→14 for readability
    color: '#999',
    marginTop: 2,
  },
  postStats: {
    flexDirection: 'row',
    gap: 14,  // 12→14
    flexShrink: 0,  // 항상 보이도록 축소 방지
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,  // 4→5
  },
  statText: {
    fontSize: 14,  // 12→14 for readability
    color: '#4B5563',  // Darker color
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,  // 16→18 for readability
    color: '#999',
    marginTop: 18,  // 16→18
    lineHeight: 24,
  },
  emptyStateSubtext: {
    fontSize: 16,  // 14→16 for readability
    color: '#ccc',
    marginTop: 10,  // 8→10
    lineHeight: 22,
  },
});
