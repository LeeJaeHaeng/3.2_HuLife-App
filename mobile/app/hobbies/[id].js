import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator, Alert,
  DeviceEventEmitter,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubeIframe from 'react-native-youtube-iframe';
import { getHobbyById, getHobbyReviews, updateHobbyReview, deleteHobbyReview } from '../../api/hobbyService';
import { addHobbyToUserAPI, getUserHobbiesAPI, removeHobbyFromUserAPI } from '../../api/userService';
import { getAllCommunitiesAPI } from '../../api/communityService';
import { logActivity, ActivityTypes } from '../../api/activityService';
import { getCurrentUser } from '../../api/authService';
import { getAllGalleryItems } from '../../api/galleryService';
import hobbyImages from '../../assets/hobbyImages';
import AddReviewModal from '../../components/AddReviewModal';
import UploadGalleryModal from '../../components/UploadGalleryModal';

// API URL 가져오기 (환경 변수 또는 하드코딩)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://hulife-db-leejaehaeng.aws-ap-northeast-1.turso.io'; // 실제 사용하는 API 주소로 교체 필요할 수도 있음

// 헬퍼 함수: 이미지 URL이 상대 경로라면 절대 경로로 변환
const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path; // Base64 이미지 처리
  // 슬래시 처리
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export default function HobbyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [hobby, setHobby] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [communities, setCommunities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 안전하게 JSON 파싱하는 헬퍼 함수
  const safeJsonParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        // 문자열이 배열 형태인지 확인 ('[' 로 시작)
        if (data.trim().startsWith('[')) {
           return JSON.parse(data);
        }
        // 아닐 경우 쉼표로 구분된 문자열로 가정하거나 그냥 문자열 하나로 배열 만듦
        return [data];
      } catch (e) {
        console.warn('JSON parse error:', e, data);
        return [data]; // 파싱 실패 시 원본 문자열을 담은 배열 반환
      }
    }
    return [];
  };

  const loadData = useCallback(async () => {
    if (!id) {
      setError("취미 ID가 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [hobbyData, userHobbiesData, communitiesData, reviewsData, galleryData, userData] = await Promise.all([
        getHobbyById(id),
        getUserHobbiesAPI(),
        getAllCommunitiesAPI(id),
        getHobbyReviews(id),
        getAllGalleryItems(id),
        getCurrentUser().catch(() => null)
      ]);

      setHobby(hobbyData);
      setCommunities(Array.isArray(communitiesData) ? communitiesData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setGalleryItems(Array.isArray(galleryData) ? galleryData : []);
      setCurrentUser(userData);

      if (Array.isArray(userHobbiesData)) {
        const userHobby = userHobbiesData.find(uh => uh.hobbyId === id);
        setIsInterested(!!userHobby);
      }
    } catch (e) {
      console.error("[상세 페이지 에러]", e);
      setError("취미 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const startTimeRef = useRef(null);

  useEffect(() => {
    loadData();
    startTimeRef.current = Date.now();
    return () => {
      if (startTimeRef.current && id) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        logActivity(ActivityTypes.VIEW_HOBBY, id, { duration });
      }
    };
  }, [loadData, id]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('HOBBY_INTEREST_CHANGED', () => {
      getUserHobbiesAPI().then(userHobbiesData => {
        if (Array.isArray(userHobbiesData)) {
          const userHobby = userHobbiesData.find(uh => uh.hobbyId === id);
          setIsInterested(!!userHobby);
        }
      });
    });
    return () => subscription.remove();
  }, [id]);

  const handleToggleInterest = async () => {
    setIsToggling(true);
    try {
      if (isInterested) {
        await removeHobbyFromUserAPI(id);
        setIsInterested(false);
        Alert.alert("성공", "관심 취미에서 제거되었습니다.");
      } else {
        await addHobbyToUserAPI(id, 'interested');
        setIsInterested(true);
        await loadData();
        Alert.alert("성공", "관심 취미에 추가되었습니다!");
      }
      DeviceEventEmitter.emit('HOBBY_INTEREST_CHANGED');
    } catch (e) {
      Alert.alert("오류", e.message || "작업 처리 중 오류가 발생했습니다.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteReview = (reviewId, reviewUserId) => {
    if (!currentUser || currentUser.id !== reviewUserId) {
      Alert.alert('오류', '본인의 리뷰만 삭제할 수 있습니다.');
      return;
    }
    Alert.alert('리뷰 삭제', '정말 이 리뷰를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive',
        onPress: async () => {
          try {
            await deleteHobbyReview(reviewId);
            Alert.alert('성공', '리뷰가 삭제되었습니다.');
            await loadData();
          } catch (error) {
            Alert.alert('오류', error.message);
          }
        },
      },
    ]);
  };

  const handleEditReview = (review) => {
    if (!currentUser || currentUser.id !== review.userId) {
      Alert.alert('오류', '본인의 리뷰만 수정할 수 있습니다.');
      return;
    }
    setEditingReview(review);
    setIsReviewModalVisible(true);
  };

  const onStateChange = useCallback((state) => {
    if (state === 'ended') setPlaying(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF7A5C" />
      </SafeAreaView>
    );
  }

  if (error || !hobby) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>{error || '취미 정보를 찾을 수 없습니다.'}</Text>
      </SafeAreaView>
    );
  }

  const imageSource = hobbyImages[hobby.name] || require('../../assets/hobbies/hulife_logo.png');
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const videoId = getYoutubeVideoId(hobby.youtubeUrl || hobby.videoUrl);

  // ⭐️ 여기서 안전하게 데이터 변환 (가장 중요!)
  const benefitsList = safeJsonParse(hobby.benefits);
  const requirementsList = safeJsonParse(hobby.requirements);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{hobby.name}</Text>
        <TouchableOpacity onPress={handleToggleInterest} disabled={isToggling}>
          <Feather
            name="heart"
            size={24}
            color={isInterested ? '#dc2626' : 'gray'}
            fill={isInterested ? '#dc2626' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {['info', 'gallery', 'communities', 'reviews'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'info' ? '상세정보' :
               tab === 'gallery' ? `갤러리 (${galleryItems.length})` :
               tab === 'communities' ? `모임 (${communities.length})` :
               `리뷰 (${reviews.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {activeTab === 'gallery' ? (
          <View style={styles.galleryContainer}>
            <View style={styles.galleryHeader}>
              <Text style={styles.galleryTitle}>{hobby.name} 작품 갤러리</Text>
              {currentUser && (
                <TouchableOpacity style={styles.uploadButton} onPress={() => setIsUploadModalVisible(true)}>
                  <Feather name="upload" size={16} color="#fff" />
                  <Text style={styles.uploadButtonText}>업로드</Text>
                </TouchableOpacity>
              )}
            </View>
            {galleryItems.length > 0 ? (
              <View style={styles.galleryGrid}>
                {galleryItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.galleryItem}
                    activeOpacity={0.9}
                    onPress={() => router.push({ pathname: '/gallery/[id]', params: { id: item.id } })}
                  >
                    <Image
                      source={{ uri: getFullImageUrl(item.image) }} // 이미지 경로 처리
                      style={styles.galleryItemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.galleryItemOverlay}>
                      <Text style={styles.galleryItemAuthor} numberOfLines={1}>{item.userName}</Text>
                      <Text style={styles.galleryItemTitle} numberOfLines={1}>{item.title}</Text>
                      <View style={styles.galleryItemStats}>
                        <Feather name="heart" size={12} color="#fff" />
                        <Text style={styles.galleryItemStatText}>{item.likes}</Text>
                        <Feather name="eye" size={12} color="#fff" style={{ marginLeft: 8 }} />
                        <Text style={styles.galleryItemStatText}>{item.views}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyGallery}>
                <Feather name="image" size={48} color="#cbd5e1" />
                <Text style={styles.emptyGalleryText}>아직 업로드된 작품이 없습니다</Text>
                {currentUser && (
                  <TouchableOpacity style={styles.uploadFirstButton} onPress={() => setIsUploadModalVisible(true)}>
                    <Text style={styles.uploadFirstButtonText}>첫 번째 작품 공유하기</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ) : activeTab === 'info' ? (
          <>
            <View style={styles.videoContainer}>
              {videoId ? (
                <YoutubeIframe height={230} play={playing} videoId={videoId} onChangeState={onStateChange} />
              ) : (
                <Image source={imageSource} style={styles.mainImage} />
              )}
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.metaContainer}>
                <Text style={styles.category}>{hobby.category}</Text>
              </View>
              <Text style={styles.title}>{hobby.name}</Text>
              <Text style={styles.description}>{hobby.description}</Text>

              {benefitsList.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>이런 점이 좋아요</Text>
                  {benefitsList.map((benefit, index) => (
                    <Text key={index} style={styles.listItem}>• {benefit}</Text>
                  ))}
                </View>
              )}

              {requirementsList.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>준비물</Text>
                  {requirementsList.map((req, index) => (
                    <Text key={index} style={styles.listItem}>• {req}</Text>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : activeTab === 'communities' ? (
          <View style={styles.communitiesContainer}>
            {communities.length > 0 ? (
              communities.map((community) => (
                <TouchableOpacity
                  key={community.id}
                  style={styles.communityCard}
                  onPress={() => router.push(`/community/${community.id}`)}
                >
                  <Image
                    source={{ uri: getFullImageUrl(community.imageUrl) }} // 이미지 경로 처리
                    style={styles.communityImage}
                    defaultSource={require('../../assets/icon.png')}
                  />
                  <View style={styles.communityInfo}>
                    <Text style={styles.communityName}>{community.name}</Text>
                    <Text style={styles.communityDescription} numberOfLines={2}>{community.description}</Text>
                    <View style={styles.communityMeta}>
                      <View style={styles.communityMetaItem}>
                        <Feather name="map-pin" size={14} color="#666" />
                        <Text style={styles.communityMetaText}>{community.location}</Text>
                      </View>
                      <View style={styles.communityMetaItem}>
                        <Feather name="users" size={14} color="#666" />
                        <Text style={styles.communityMetaText}>{community.memberCount}/{community.maxMembers}명</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyCommunitiesContainer}>
                <Feather name="users" size={48} color="#ccc" />
                <Text style={styles.emptyCommunitiesText}>아직 이 취미와 관련된 모임이 없습니다.</Text>
                <TouchableOpacity style={styles.createCommunityButton} onPress={() => router.push('/community')}>
                  <Text style={styles.createCommunityButtonText}>모임 둘러보기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewHeaderTitle}>사용자 리뷰 ({reviews.length})</Text>
              <TouchableOpacity style={styles.addReviewButton} onPress={() => setIsReviewModalVisible(true)}>
                <Feather name="edit" size={16} color="#fff" />
                <Text style={styles.addReviewButtonText}>리뷰 작성</Text>
              </TouchableOpacity>
            </View>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader2}>
                    <View style={styles.reviewUserInfo}>
                      {review.userProfileImage ? (
                        <Image source={{ uri: getFullImageUrl(review.userProfileImage) }} style={styles.reviewAvatar} />
                      ) : (
                        <View style={styles.reviewAvatarFallback}>
                          <Text style={styles.reviewAvatarText}>{review.userName?.[0] || '?'}</Text>
                        </View>
                      )}
                      <View>
                        <Text style={styles.reviewUserName}>{review.userName}</Text>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Feather key={star} name="star" size={14} color={star <= review.rating ? '#FFD700' : '#d1d5db'} fill={star <= review.rating ? '#FFD700' : 'transparent'} />
                          ))}
                        </View>
                      </View>
                    </View>
                    <View style={styles.reviewMetaContainer}>
                      <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('ko-KR')}</Text>
                      {currentUser && currentUser.id === review.userId && (
                        <View style={styles.reviewActions}>
                          <TouchableOpacity onPress={() => handleEditReview(review)} style={styles.reviewActionButton}>
                            <Feather name="edit-2" size={16} color="#3b82f6" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDeleteReview(review.id, review.userId)} style={styles.reviewActionButton}>
                            <Feather name="trash-2" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyReviewsContainer}>
                <Feather name="message-square" size={48} color="#ccc" />
                <Text style={styles.emptyReviewsText}>아직 이 취미에 대한 리뷰가 없습니다.</Text>
                <Text style={styles.emptyReviewsSubtext}>첫 번째 리뷰를 작성해보세요!</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <AddReviewModal
        visible={isReviewModalVisible}
        onClose={() => { setIsReviewModalVisible(false); setEditingReview(null); }}
        hobbyId={id}
        hobbyName={hobby?.name}
        editingReview={editingReview}
        onReviewAdded={() => { loadData(); setEditingReview(null); }}
      />

      <UploadGalleryModal
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        onUploadSuccess={() => { setIsUploadModalVisible(false); loadData(); }}
        hobbyId={id}
        hobbyName={hobby?.name}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 16 },
  videoContainer: { backgroundColor: 'black' },
  mainImage: { width: '100%', height: 230, backgroundColor: '#e5e7eb' },
  contentContainer: { padding: 20 },
  metaContainer: { marginBottom: 8 },
  category: { alignSelf: 'flex-start', backgroundColor: '#FFF5F0', color: '#FF7A5C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 14, fontWeight: '600', overflow: 'hidden' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  description: { fontSize: 16, color: '#4b5563', lineHeight: 24, marginBottom: 24 },
  section: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  listItem: { fontSize: 16, color: '#4b5563', lineHeight: 24 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#FF7A5C' },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#FF7A5C', fontWeight: 'bold' },
  communitiesContainer: { padding: 16 },
  communityCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  communityImage: { width: 100, height: 100, backgroundColor: '#f0f0f0' },
  communityInfo: { flex: 1, padding: 12 },
  communityName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  communityDescription: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 20 },
  communityMeta: { flexDirection: 'row', gap: 12 },
  communityMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  communityMetaText: { fontSize: 12, color: '#666' },
  emptyCommunitiesContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyCommunitiesText: { fontSize: 16, color: '#999', marginTop: 16, marginBottom: 24, textAlign: 'center' },
  createCommunityButton: { backgroundColor: '#FF7A5C', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  createCommunityButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reviewsContainer: { padding: 16 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reviewHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  addReviewButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FF7A5C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addReviewButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  reviewCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  reviewHeader2: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  reviewUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb' },
  reviewAvatarFallback: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF7A5C', justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  reviewUserName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewMetaContainer: { alignItems: 'flex-end' },
  reviewDate: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  reviewActions: { flexDirection: 'row', gap: 8 },
  reviewActionButton: { padding: 4 },
  reviewComment: { fontSize: 15, color: '#374151', lineHeight: 22 },
  galleryContainer: { padding: 16 },
  galleryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  galleryTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FF7A5C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  uploadButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galleryItem: { width: '48%', aspectRatio: 0.75, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e5e7eb', marginBottom: 8 },
  galleryItemImage: { width: '100%', height: '100%' },
  galleryItemOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.5)' },
  galleryItemAuthor: { fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 2 },
  galleryItemTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  galleryItemStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  galleryItemStatText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  emptyGallery: { alignItems: 'center', paddingVertical: 60 },
  emptyGalleryText: { fontSize: 16, color: '#999', marginTop: 16, marginBottom: 24, textAlign: 'center' },
  uploadFirstButton: { backgroundColor: '#FF7A5C', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  uploadFirstButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyReviewsContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyReviewsText: { fontSize: 16, color: '#999', marginTop: 16, textAlign: 'center' },
  emptyReviewsSubtext: { fontSize: 14, color: '#ccc', marginTop: 8, textAlign: 'center' },
});