import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { getHobbyById, getHobbyReviews } from '../../api/hobbyService';
import { addHobbyToUserAPI, getUserHobbiesAPI, removeHobbyFromUserAPI } from '../../api/userService';
import { getAllCommunitiesAPI } from '../../api/communityService';
import hobbyImages from '../../assets/hobbyImages';
import AddReviewModal from '../../components/AddReviewModal';

export default function HobbyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 화면에 필요한 모든 데이터를 상태로 관리합니다.
  const [hobby, setHobby] = useState(null); // 현재 취미 상세 정보
  const [isInterested, setIsInterested] = useState(false); // 현재 취미를 '관심 추가' 했는지 여부
  const [loading, setLoading] = useState(true); // 전체 데이터 로딩 상태
  const [isToggling, setIsToggling] = useState(false); // 좋아요 버튼 처리 중 로딩 상태
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'communities', 'reviews'
  const [communities, setCommunities] = useState([]); // 관련 커뮤니티 목록
  const [reviews, setReviews] = useState([]); // 리뷰 목록
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false); // 리뷰 작성 모달

  // 데이터 로딩 함수 (재사용 가능하도록 분리)
  const loadData = useCallback(async () => {
    if (!id) {
      setError("취미 ID가 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // 상세 정보와 사용자의 관심 목록, 관련 커뮤니티, 리뷰를 동시에 요청합니다.
      const [hobbyData, userHobbiesData, communitiesData, reviewsData] = await Promise.all([
        getHobbyById(id),
        getUserHobbiesAPI(),
        getAllCommunitiesAPI(id), // 이 취미와 관련된 커뮤니티만 조회
        getHobbyReviews(id) // 리뷰 목록 조회
      ]);

      setHobby(hobbyData); // 취미 상세 정보 설정
      setCommunities(Array.isArray(communitiesData) ? communitiesData : []); // 커뮤니티 목록 설정
      setReviews(Array.isArray(reviewsData) ? reviewsData : []); // 리뷰 목록 설정

      // 사용자의 관심 목록에 현재 취미가 있는지 확인합니다.
      if (Array.isArray(userHobbiesData)) {
        const isAlreadyAdded = userHobbiesData.some(uh => uh.hobbyId === id);
        setIsInterested(isAlreadyAdded);
        console.log(`[상세 페이지] 이 취미는 관심 목록에 ${isAlreadyAdded ? '있습니다' : '없습니다'}.`);
      }
      console.log(`[상세 페이지] 관련 커뮤니티 ${communitiesData.length}개, 리뷰 ${reviewsData.length}개 로드됨`);
    } catch (e) {
      console.error("[상세 페이지 에러]", e);
      setError("취미 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 화면이 열릴 때 필요한 모든 데이터를 가져옵니다.
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 🔔 전역 이벤트 리스너: 다른 화면에서 좋아요 상태가 변경되면 즉시 데이터 새로고침
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('HOBBY_INTEREST_CHANGED', () => {
      console.log("[상세 페이지] 🔔 좋아요 상태 변경 이벤트 수신! 관심 상태 다시 확인...");
      // 하트 상태만 다시 확인 (전체 데이터 다시 로드하지 않음)
      getUserHobbiesAPI().then(userHobbiesData => {
        if (Array.isArray(userHobbiesData)) {
          const isAlreadyAdded = userHobbiesData.some(uh => uh.hobbyId === id);
          setIsInterested(isAlreadyAdded);
          console.log(`[상세 페이지] 관심 상태 업데이트: ${isAlreadyAdded ? '있음' : '없음'}`);
        }
      }).catch(err => {
        console.error("[상세 페이지] 관심 상태 확인 실패:", err);
      });
    });

    return () => {
      subscription.remove();
    };
  }, [id]);

  // 좋아요(관심 추가/제거) 버튼을 눌렀을 때 실행될 함수
  const handleToggleInterest = async () => {
    setIsToggling(true);
    try {
      if (isInterested) { // 이미 관심 추가 상태라면 제거 API 호출
        await removeHobbyFromUserAPI(id);
        setIsInterested(false);
        Alert.alert("성공", "관심 취미에서 제거되었습니다.");
      } else { // 아니라면 추가 API 호출
        await addHobbyToUserAPI(id, 'interested');
        setIsInterested(true);
        Alert.alert("성공", "관심 취미에 추가되었습니다!");
      }
      // 🔔 전역 이벤트 발송: 마이페이지에 데이터 새로고침 알림
      DeviceEventEmitter.emit('HOBBY_INTEREST_CHANGED');
      console.log("[상세 페이지] 좋아요 상태 변경 이벤트 발송!");
    } catch (e) {
      Alert.alert("오류", e.message || "작업 처리 중 오류가 발생했습니다.");
    } finally {
      setIsToggling(false);
    }
  };


  const onStateChange = useCallback((state) => {
    if (state === 'ended') setPlaying(false);
  }, []);
  
  // 로딩 중 화면
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF7A5C" />
      </SafeAreaView>
    );
  }

  // 에러 발생 시 화면
  if (error || !hobby) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>{error || '취미 정보를 찾을 수 없습니다.'}</Text>
      </SafeAreaView>
    );
  }

  // 데이터 로드 성공 시 실제 화면 렌더링
  const imageSource = hobbyImages[hobby.name] || require('../../assets/hobbies/hulife_logo.png');
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const videoId = getYoutubeVideoId(hobby.youtubeUrl || hobby.videoUrl);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{hobby.name}</Text>
        {/* ✨ 좋아요 버튼 기능 연결 */}
        <TouchableOpacity onPress={handleToggleInterest} disabled={isToggling}>
          <Feather 
            name="heart" 
            size={24} 
            color={isInterested ? '#dc2626' : 'gray'} // 상태에 따라 색 변경
            fill={isInterested ? '#dc2626' : 'none'}    // 상태에 따라 채우기
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            상세정보
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'communities' && styles.activeTab]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>
            모임 ({communities.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            리뷰 ({reviews.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {activeTab === 'info' ? (
          <>
            <View style={styles.videoContainer}>
              {videoId ? (
                <YoutubeIframe
                  height={230}
                  play={playing}
                  videoId={videoId}
                  onChangeState={onStateChange}
                />
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

              {/* 웹 화면처럼 모든 정보 표시 */}
              {hobby.benefits && hobby.benefits.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>이런 점이 좋아요</Text>
                  {hobby.benefits.map((benefit, index) => (
                    <Text key={index} style={styles.listItem}>• {benefit}</Text>
                  ))}
                </View>
              )}

              {hobby.requirements && hobby.requirements.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>준비물</Text>
                  {hobby.requirements.map((req, index) => (
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
                    source={{ uri: community.imageUrl }}
                    style={styles.communityImage}
                    defaultSource={require('../../assets/icon.png')}
                  />
                  <View style={styles.communityInfo}>
                    <Text style={styles.communityName}>{community.name}</Text>
                    <Text style={styles.communityDescription} numberOfLines={2}>
                      {community.description}
                    </Text>
                    <View style={styles.communityMeta}>
                      <View style={styles.communityMetaItem}>
                        <Feather name="map-pin" size={14} color="#666" />
                        <Text style={styles.communityMetaText}>{community.location}</Text>
                      </View>
                      <View style={styles.communityMetaItem}>
                        <Feather name="users" size={14} color="#666" />
                        <Text style={styles.communityMetaText}>
                          {community.memberCount}/{community.maxMembers}명
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyCommunitiesContainer}>
                <Feather name="users" size={48} color="#ccc" />
                <Text style={styles.emptyCommunitiesText}>
                  아직 이 취미와 관련된 모임이 없습니다.
                </Text>
                <TouchableOpacity
                  style={styles.createCommunityButton}
                  onPress={() => router.push('/community')}
                >
                  <Text style={styles.createCommunityButtonText}>모임 둘러보기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewHeaderTitle}>
                사용자 리뷰 ({reviews.length})
              </Text>
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setIsReviewModalVisible(true)}
              >
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
                        <Image
                          source={{ uri: review.userProfileImage }}
                          style={styles.reviewAvatar}
                        />
                      ) : (
                        <View style={styles.reviewAvatarFallback}>
                          <Text style={styles.reviewAvatarText}>
                            {review.userName?.[0] || '?'}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Text style={styles.reviewUserName}>{review.userName}</Text>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Feather
                              key={star}
                              name="star"
                              size={14}
                              color={star <= review.rating ? '#FFD700' : '#d1d5db'}
                              fill={star <= review.rating ? '#FFD700' : 'transparent'}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                    </Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyReviewsContainer}>
                <Feather name="message-square" size={48} color="#ccc" />
                <Text style={styles.emptyReviewsText}>
                  아직 이 취미에 대한 리뷰가 없습니다.
                </Text>
                <Text style={styles.emptyReviewsSubtext}>
                  첫 번째 리뷰를 작성해보세요!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Review Modal */}
      <AddReviewModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        hobbyId={id}
        hobbyName={hobby?.name}
        onReviewAdded={() => {
          loadData(); // Reload data to show new review
        }}
      />
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 16 },
  videoContainer: { backgroundColor: 'black' },
  mainImage: { width: '100%', height: 230, backgroundColor: '#e5e7eb' },
  contentContainer: { padding: 20 },
  metaContainer: { marginBottom: 8 },
  category: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF5F0',
    color: '#FF7A5C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '600',
    overflow: 'hidden', // iOS에서 borderRadius 적용 위함
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  description: { fontSize: 16, color: '#4b5563', lineHeight: 24, marginBottom: 24 },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  listItem: { fontSize: 16, color: '#4b5563', lineHeight: 24 },
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
  communitiesContainer: {
    padding: 16,
  },
  communityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  communityImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  communityInfo: {
    flex: 1,
    padding: 12,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  communityMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  communityMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  communityMetaText: {
    fontSize: 12,
    color: '#666',
  },
  emptyCommunitiesContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCommunitiesText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  createCommunityButton: {
    backgroundColor: '#FF7A5C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createCommunityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Reviews styles
  reviewsContainer: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF7A5C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  reviewAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reviewComment: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  emptyReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyReviewsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyReviewsSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});