import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCommunityByIdAPI, requestJoinCommunityAPI } from '../../api/communityService';
import { getCurrentUser } from '../../api/authService';
import { logActivity, ActivityTypes } from '../../api/activityService';
import hobbyImages from '../../assets/hobbyImages';

export default function CommunityDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('intro'); // 'intro', 'members'
  const [isMember, setIsMember] = useState(false);
  const [isLeader, setIsLeader] = useState(false);

  // Activity tracking: duration measurement
  const startTimeRef = useRef(null);

  // Load community data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [communityData, userData] = await Promise.all([
        getCommunityByIdAPI(id),
        getCurrentUser()
      ]);

      setCommunity(communityData);
      setCurrentUser(userData);

      // Check if current user is a member
      let memberCheck = false;
      if (communityData.members && userData) {
        memberCheck = communityData.members.some(
          m => m.user?.id === userData.id || m.userId === userData.id
        );
        setIsMember(memberCheck);
        setIsLeader(communityData.leaderId === userData.id);
      }

      console.log('[커뮤니티 상세] 데이터 로드 성공:', {
        community: communityData.name,
        isMember: memberCheck,
        isLeader: communityData.leaderId === userData.id
      });
    } catch (error) {
      console.error('[커뮤니티 상세] 데이터 로드 실패:', error);
      Alert.alert('오류', error.message || '커뮤니티 정보를 불러올 수 없습니다.');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadData();

    // Start tracking view duration
    startTimeRef.current = Date.now();

    // Cleanup: log activity with duration when leaving the screen
    return () => {
      if (startTimeRef.current && id) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000); // seconds
        logActivity(ActivityTypes.VIEW_COMMUNITY, id, { duration });
      }
    };
  }, [loadData, id]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Handle join request
  const handleJoinRequest = () => {
    if (!community) return;

    if (community.memberCount >= community.maxMembers) {
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
              await requestJoinCommunityAPI(community.id);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A5C" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!community) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>커뮤니티를 찾을 수 없습니다.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>모임 상세</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={
              community.hobbyName && hobbyImages[community.hobbyName]
                ? hobbyImages[community.hobbyName]
                : community.imageUrl?.startsWith('http')
                ? { uri: community.imageUrl }
                : require('../../assets/icon.png')
            }
            style={styles.heroImage}
            defaultSource={require('../../assets/icon.png')}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {community.memberCount}/{community.maxMembers}명
              </Text>
            </View>
            <Text style={styles.heroTitle}>{community.name}</Text>
            <Text style={styles.heroDescription}>{community.description}</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'intro' && styles.activeTab]}
              onPress={() => setActiveTab('intro')}
            >
              <Text style={[styles.tabText, activeTab === 'intro' && styles.activeTabText]}>
                모임 소개
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'members' && styles.activeTab]}
              onPress={() => setActiveTab('members')}
            >
              <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
                멤버 ({community.members?.length || 0})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'intro' ? (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>모임 소개</Text>
                <Text style={styles.cardText}>{community.description}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>모임 정보</Text>

                <View style={styles.infoItem}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="location" size={20} color="#FF7A5C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>장소</Text>
                    <Text style={styles.infoValue}>{community.location}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="calendar" size={20} color="#FF7A5C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>일정</Text>
                    <Text style={styles.infoValue}>{community.schedule}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="people" size={20} color="#FF7A5C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>정원</Text>
                    <Text style={styles.infoValue}>
                      {community.memberCount} / {community.maxMembers}명
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="time" size={20} color="#FF7A5C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>생성일</Text>
                    <Text style={styles.infoValue}>
                      {new Date(community.createdAt).toLocaleDateString('ko-KR')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>멤버 ({community.members?.length || 0}명)</Text>
                <View style={styles.memberGrid}>
                  {community.members && community.members.length > 0 ? (
                    community.members.map((member) => (
                      <View key={member.id} style={styles.memberCard}>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberAvatarText}>
                            {member.user?.name?.[0] || 'U'}
                          </Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName} numberOfLines={1}>
                            {member.user?.name || '익명'}
                          </Text>
                          <View style={styles.memberRole}>
                            {member.role === 'leader' ? (
                              <>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.memberRoleText}>리더</Text>
                              </>
                            ) : (
                              <>
                                <Ionicons name="person" size={12} color="#666" />
                                <Text style={styles.memberRoleText}>멤버</Text>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyMembersText}>아직 멤버가 없습니다.</Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomBar}>
        {isMember ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={() => router.push(`/community/chat/${id}`)}
          >
            <Ionicons name="chatbubbles" size={20} color="#FF7A5C" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryActionButtonText}>멤버 전용 채팅</Text>
          </TouchableOpacity>
        ) : community.hasPendingRequest ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.pendingActionButton]}
            disabled={true}
          >
            <Ionicons
              name="hourglass-outline"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.pendingActionButtonText}>신청 완료 (승인 대기 중)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.primaryActionButton,
              community.memberCount >= community.maxMembers && styles.disabledActionButton
            ]}
            onPress={handleJoinRequest}
            disabled={community.memberCount >= community.maxMembers}
          >
            <Ionicons
              name="person-add"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryActionButtonText}>
              {community.memberCount >= community.maxMembers ? '정원 마감' : '가입 신청하기'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF7A5C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  mainContent: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF7A5C',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF7A5C',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  memberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  memberCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  memberAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberRole: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberRoleText: {
    fontSize: 12,
    color: '#666',
  },
  emptyMembersText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryActionButton: {
    backgroundColor: '#FF7A5C',
  },
  primaryActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryActionButton: {
    backgroundColor: '#f5f5f5',
  },
  secondaryActionButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingActionButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  pendingActionButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledActionButton: {
    opacity: 0.5,
  },
});
