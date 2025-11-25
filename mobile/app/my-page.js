import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getCurrentUser, logoutUser } from '../api/authService';
import { getUserCommunitiesAPI, getUserHobbiesAPI, getUserSchedulesAPI, updateScheduleAPI, deleteScheduleAPI, removeHobbyFromUserAPI } from '../api/userService';
import { getAllGalleryItems } from '../api/galleryService';
import { getAllPostsAPI } from '../api/communityService';
import AddScheduleModal from '../components/AddScheduleModal';
import EditProfileModal from '../components/EditProfileModal';
import hobbyImages from '../assets/hobbyImages';
import { API_URL } from '../api/apiClient';

// 한국어 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

// TabButton 컴포넌트
const TabButton = ({ label, activeTab, setActiveTab }) => (
  <TouchableOpacity
    style={[styles.tab, activeTab === label && styles.activeTab]}
    onPress={() => setActiveTab(label)}
  >
    <Text style={[styles.tabText, activeTab === label && styles.activeTabText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function MyPageScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('관심 취미');
  const [myContentSubTab, setMyContentSubTab] = useState('내 작품'); // 내글 탭의 서브탭

  const [user, setUser] = useState(null);
  const [userHobbies, setUserHobbies] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [userSchedules, setUserSchedules] = useState([]);
  const [myGalleryItems, setMyGalleryItems] = useState([]); // 내 갤러리 작품
  const [myPosts, setMyPosts] = useState([]); // 내 게시판 글
  const [loading, setLoading] = useState(true); // 로딩 상태 (초기 + 새로고침 통합)
  const [error, setError] = useState(null);
  const [isAddScheduleModalVisible, setIsAddScheduleModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Calendar states
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  // 데이터 로딩 함수
  const loadMyPageData = useCallback(async () => {
    // 이미 로딩 중이면 중복 실행 방지 (선택적)
    // if (loading) return;

    try {
      setLoading(true); // 로딩 시작
      setError(null);
      console.log("[마이페이지] 데이터 로딩 시작...");

      const [userData, hobbiesData, communitiesData, schedulesData, galleryData, postsData] = await Promise.all([
        getCurrentUser(),
        getUserHobbiesAPI(),
        getUserCommunitiesAPI(),
        getUserSchedulesAPI(),
        getAllGalleryItems().catch(() => []), // 갤러리 목록 (에러 시 빈 배열)
        getAllPostsAPI().catch(() => []) // 게시글 목록 (에러 시 빈 배열)
      ]);

      console.log("[마이페이지] 받은 사용자 데이터:", userData ? 'OK' : '실패');
      console.log("[마이페이지] 받은 관심 취미 데이터:", JSON.stringify(hobbiesData, null, 2));
      console.log("[마이페이지] 받은 참여 모임 데이터:", communitiesData ? `${communitiesData.length}개` : '실패');
      console.log("[마이페이지] 받은 일정 데이터:", schedulesData ? `${schedulesData.length}개` : '실패');
      console.log("[마이페이지] 받은 갤러리 데이터:", galleryData ? `${galleryData.length}개` : '실패');
      console.log("[마이페이지] 받은 게시글 데이터:", postsData ? `${postsData.length}개` : '실패');

      // 상태 업데이트
      setUser(userData);
      setUserHobbies(Array.isArray(hobbiesData) ? hobbiesData : []);
      setUserCommunities(Array.isArray(communitiesData) ? communitiesData : []);
      setUserSchedules(Array.isArray(schedulesData) ? schedulesData : []);

      // 내 갤러리 작품 필터링
      const myGallery = Array.isArray(galleryData)
        ? galleryData.filter(item => item.userId === userData?.id)
        : [];
      setMyGalleryItems(myGallery);

      // 내 게시글 필터링
      const myPostsList = Array.isArray(postsData)
        ? postsData.filter(post => post.userId === userData?.id)
        : [];
      setMyPosts(myPostsList);

      console.log("[마이페이지] 데이터 로딩 및 상태 업데이트 성공.");

    } catch (e) {
      setError("마이페이지 정보를 불러오는 데 실패했습니다. 로그인이 필요할 수 있습니다.");
      console.error("[마이페이지 에러]", e);
    } finally {
      setLoading(false); // 로딩 종료
    }
  }, []); // loading 상태 의존성 제거

  // 캘린더에 일정 마킹
  useEffect(() => {
    if (userSchedules.length > 0) {
      const marked = {};
      userSchedules.forEach(schedule => {
        const dateStr = new Date(schedule.date).toISOString().split('T')[0];
        const typeColor = getTypeColor(schedule.type);

        if (!marked[dateStr]) {
          marked[dateStr] = { dots: [], marked: true };
        }
        marked[dateStr].dots.push({ color: typeColor });
      });

      // 선택된 날짜 하이라이트 추가
      if (selectedDate && marked[selectedDate]) {
        marked[selectedDate].selected = true;
        marked[selectedDate].selectedColor = '#FF7A5C';
      } else if (selectedDate) {
        marked[selectedDate] = { selected: true, selectedColor: '#FF7A5C' };
      }

      setMarkedDates(marked);
    }
  }, [userSchedules, selectedDate]);

  // Helper function for type colors
  const getTypeColor = (type) => {
    switch (type) {
      case 'class': return '#3b82f6'; // blue
      case 'practice': return '#10b981'; // green
      case 'meeting': return '#8b5cf6'; // purple
      case 'event': return '#f97316'; // orange
      default: return '#6b7280'; // gray
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'class': return '수업';
      case 'practice': return '연습';
      case 'meeting': return '모임';
      case 'event': return '행사';
      default: return type;
    }
  };

  // Handle schedule long press
  const handleScheduleLongPress = (schedule) => {
    Alert.alert(
      '일정 관리',
      `"${schedule.title}" 일정을 어떻게 하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '수정',
          onPress: () => {
            setEditingSchedule(schedule);
            setIsAddScheduleModalVisible(true);
          },
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => handleDeleteSchedule(schedule.id),
        },
      ]
    );
  };

  // Handle delete schedule
  const handleDeleteSchedule = (scheduleId) => {
    Alert.alert(
      '일정 삭제',
      '정말 이 일정을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScheduleAPI(scheduleId);
              Alert.alert('성공', '일정이 삭제되었습니다.');
              await loadMyPageData();
            } catch (error) {
              console.error('[일정 삭제 실패]', error);
              Alert.alert('오류', error.message || '일정 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  // Handle remove hobby from interest
  const handleRemoveHobby = (hobbyId, hobbyName) => {
    Alert.alert(
      '관심 취미 제거',
      `"${hobbyName}"을(를) 관심 취미에서 제거하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '제거',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeHobbyFromUserAPI(hobbyId);
              DeviceEventEmitter.emit('HOBBY_INTEREST_CHANGED');
              await loadMyPageData();
            } catch (error) {
              console.error('[관심 취미 제거 실패]', error);
              Alert.alert('오류', error.message || '관심 취미 제거 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  // useFocusEffect 사용: 화면이 포커스를 얻을 때마다 실행
  useFocusEffect(
    useCallback(() => {
      console.log("[마이페이지] ✨ 화면 포커스됨. 데이터 로드 함수 실행!");
      loadMyPageData(); // 데이터 로딩 함수 호출

      return () => {
        console.log("[마이페이지] 화면 포커스 잃음.");
      };
    }, [loadMyPageData]) // loadMyPageData 함수에만 의존
  );

  // 🔔 전역 이벤트 리스너: 다른 화면에서 좋아요 상태가 변경되면 즉시 데이터 새로고침
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('HOBBY_INTEREST_CHANGED', () => {
      console.log("[마이페이지] 🔔 좋아요 상태 변경 이벤트 수신! 데이터 새로고침...");
      loadMyPageData();
    });

    return () => {
      subscription.remove();
    };
  }, [loadMyPageData]);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
              console.log("[마이페이지] 로그아웃 성공");
              // 로그인 화면으로 이동
              router.replace('/login');
            } catch (error) {
              console.error("[마이페이지] 로그아웃 실패:", error);
              Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
            }
          }
        }
      ]
    );
  };

  // 로딩 중 화면
  if (loading && !user) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF7A5C" />
      </SafeAreaView>
    );
  }

  // 에러 발생 또는 사용자 정보 로드 실패 시
  if (error || !user) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>
            <Text style={styles.headerTitle}>마이페이지</Text>
            <TouchableOpacity><Feather name="settings" size={24} color="black" /></TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
            <Text>{error || '사용자 정보를 표시할 수 없습니다.'}</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/login')}>
                <Text style={styles.loginButtonText}>로그인 하기</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#FF7A5C" />
        </TouchableOpacity>
      </View>

      {/* 로딩 중 오버레이 */}
      {loading && ( // loading 상태를 사용
          <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#FF7A5C" />
          </View>
      )}

      <ScrollView>
        {/* 2. 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarFallbackText}>{user.name ? user.name[0] : '?'}</Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{user.name || '이름 없음'}</Text>
          <Text style={styles.profileInfo}>{user.age ? `${user.age}세` : ''}{user.location ? ` • ${user.location}` : ''}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditProfileModalVisible(true)}
          >
            <Text style={styles.editButtonText}>프로필 수정</Text>
          </TouchableOpacity>
        </View>

        {/* 3. 활동 통계 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>활동 통계</Text>
          <View style={styles.statsRow}>
             <View style={styles.statsItem}><Feather name="heart" size={16} color="#6b7280" /><Text style={styles.statsLabel}>관심 취미</Text></View>
             <Text style={styles.statsValue}>{userHobbies.length}</Text>
          </View>
          <View style={styles.statsRow}>
             <View style={styles.statsItem}><Feather name="users" size={16} color="#6b7280" /><Text style={styles.statsLabel}>참여 모임</Text></View>
             <Text style={styles.statsValue}>{userCommunities.length}</Text>
          </View>
          <View style={styles.statsRow}>
             <View style={styles.statsItem}><Feather name="calendar" size={16} color="#6b7280" /><Text style={styles.statsLabel}>예정된 일정</Text></View>
             <Text style={styles.statsValue}>{userSchedules.length}</Text>
          </View>
        </View>

        {/* 4. 탭 뷰 */}
        <View style={styles.tabContainer}>
           <TabButton label="관심 취미" activeTab={activeTab} setActiveTab={setActiveTab} />
           <TabButton label="참여 모임" activeTab={activeTab} setActiveTab={setActiveTab} />
           <TabButton label="내글" activeTab={activeTab} setActiveTab={setActiveTab} />
           <TabButton label="일정" activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>

        {/* 5. 탭 컨텐츠 */}
        <View style={styles.tabContent}>
          {activeTab === '관심 취미' && (
            userHobbies.length > 0 ? (
              <View style={styles.hobbiesGrid}>
                {userHobbies.map(item => {
                  if (!item.hobby) {
                    return (
                      <View key={item.id} style={styles.hobbyCard}>
                        <Text style={styles.hobbyCardError}>취미 정보 로딩 실패</Text>
                      </View>
                    );
                  }

                  const imageSource = hobbyImages[item.hobby.name] || require('../assets/hobbies/hulife_logo.png');

                  return (
                    <View key={item.id} style={styles.hobbyCard}>
                      <TouchableOpacity
                        onPress={() => router.push(`/hobbies/${item.hobbyId}`)}
                        activeOpacity={0.9}
                      >
                        <Image source={imageSource} style={styles.hobbyCardImage} />
                        <View style={styles.hobbyCardContent}>
                          <View style={styles.hobbyCardHeader}>
                            <Text style={styles.hobbyCardCategory}>{item.hobby.category || '기타'}</Text>
                            <TouchableOpacity
                              onPress={() => handleRemoveHobby(item.hobbyId, item.hobby.name)}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Feather name="x" size={18} color="#9ca3af" />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.hobbyCardTitle} numberOfLines={2}>
                            {item.hobby.name}
                          </Text>
                          <Text style={styles.hobbyCardDescription} numberOfLines={2}>
                            {item.hobby.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Feather name="heart" size={64} color="#e5e7eb" />
                <Text style={styles.emptyStateText}>관심 취미가 없습니다</Text>
                <Text style={styles.emptyStateSubtext}>
                  취미를 둘러보고 마음에 드는 취미를 추가해보세요!
                </Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/hobbies')}
                >
                  <Feather name="compass" size={18} color="#fff" />
                  <Text style={styles.browseButtonText}>취미 둘러보기</Text>
                </TouchableOpacity>
              </View>
            )
          )}

          {activeTab === '참여 모임' && (
            userCommunities.length > 0 ? (
              <View style={styles.communitiesGrid}>
                {userCommunities.map(item => {
                  const community = item.community || item;
                  const communityName = community.name || '커뮤니티';
                  const communityLocation = community.location || '위치 미정';
                  const communitySchedule = community.schedule || '';
                  const memberCount = community.memberCount || 0;
                  const maxMembers = community.maxMembers || 0;

                  // 취미 이름으로 hobbyImages에서 이미지 가져오기
                  const getImageSource = () => {
                    // 1. hobbyName이 있으면 hobbyImages에서 직접 찾기
                    if (community.hobbyName && hobbyImages[community.hobbyName]) {
                      return hobbyImages[community.hobbyName];
                    }

                    // 2. 서버 업로드 이미지인지 확인
                    if (community.imageUrl?.includes('uploads') || community.imageUrl?.includes('public')) {
                      const absoluteUrl = community.imageUrl.startsWith('/')
                        ? `${API_URL}${community.imageUrl}`
                        : `${API_URL}/${community.imageUrl}`;
                      return { uri: absoluteUrl };
                    }

                    // 3. HTTP URL인 경우
                    if (community.imageUrl?.startsWith('http')) {
                      return { uri: community.imageUrl };
                    }

                    // 4. 기본 이미지 (플레이스홀더)
                    return null;
                  };

                  const imageSource = getImageSource();

                  return (
                    <View key={item.id} style={styles.communityCard}>
                      <TouchableOpacity
                        onPress={() => router.push(`/community/${item.communityId || item.id}`)}
                        activeOpacity={0.9}
                      >
                        {imageSource ? (
                          <Image
                            source={imageSource}
                            style={styles.communityCardImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={[styles.communityCardImage, styles.communityImagePlaceholder]}>
                            <Feather name="users" size={40} color="#cbd5e1" />
                          </View>
                        )}
                        <View style={styles.communityCardContent}>
                          <Text style={styles.communityCardTitle} numberOfLines={2}>
                            {communityName}
                          </Text>
                          <View style={styles.communityCardInfo}>
                            <View style={styles.communityInfoRow}>
                              <Feather name="map-pin" size={12} color="#9ca3af" />
                              <Text style={styles.communityInfoText} numberOfLines={1}>
                                {communityLocation}
                              </Text>
                            </View>
                            {communitySchedule && (
                              <View style={styles.communityInfoRow}>
                                <Feather name="clock" size={12} color="#9ca3af" />
                                <Text style={styles.communityInfoText} numberOfLines={1}>
                                  {communitySchedule}
                                </Text>
                              </View>
                            )}
                            <View style={styles.communityMemberBadge}>
                              <Feather name="users" size={12} color="#FF7A5C" />
                              <Text style={styles.communityMemberText}>
                                {memberCount}/{maxMembers}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Feather name="users" size={64} color="#e5e7eb" />
                <Text style={styles.emptyStateText}>참여한 모임이 없습니다</Text>
                <Text style={styles.emptyStateSubtext}>
                  새로운 모임에 참여하고 취미를 함께 즐겨보세요!
                </Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/community')}
                >
                  <Feather name="search" size={18} color="#fff" />
                  <Text style={styles.browseButtonText}>모임 찾기</Text>
                </TouchableOpacity>
              </View>
            )
          )}

          {activeTab === '내글' && (
            <>
              {/* 서브 탭 */}
              <View style={styles.subTabContainer}>
                <TouchableOpacity
                  style={[
                    styles.subTabButton,
                    myContentSubTab === '내 작품' && styles.subTabButtonActive
                  ]}
                  onPress={() => setMyContentSubTab('내 작품')}
                >
                  <Text style={[
                    styles.subTabText,
                    myContentSubTab === '내 작품' && styles.subTabTextActive
                  ]}>
                    내 작품
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.subTabButton,
                    myContentSubTab === '내 게시판 글' && styles.subTabButtonActive
                  ]}
                  onPress={() => setMyContentSubTab('내 게시판 글')}
                >
                  <Text style={[
                    styles.subTabText,
                    myContentSubTab === '내 게시판 글' && styles.subTabTextActive
                  ]}>
                    내 게시판 글
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 내 작품 */}
              {myContentSubTab === '내 작품' && (
                myGalleryItems.length > 0 ? (
                  <View style={styles.myGalleryGrid}>
                    {myGalleryItems.map(item => {
                      // 취미 이름으로 이미지 가져오기 (3단계 우선순위)
                      const getImageSource = () => {
                        // 1. hobbyName으로 hobbyImages에서 찾기
                        if (item.hobbyName && hobbyImages[item.hobbyName]) {
                          return hobbyImages[item.hobbyName];
                        }
                        // 2. Base64 또는 URL 이미지
                        if (item.image && item.image.length > 0) {
                          return { uri: item.image };
                        }
                        // 3. 기본 이미지
                        return require('../assets/hobbies/hulife_logo.png');
                      };

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.myGalleryCard}
                          onPress={() => router.push(`/gallery/${item.id}`)}
                          activeOpacity={0.9}
                        >
                          <Image
                            source={getImageSource()}
                            style={styles.myGalleryImage}
                            resizeMode="cover"
                          />
                          <View style={styles.myGalleryOverlay}>
                            <Text style={styles.myGalleryTitle} numberOfLines={1}>
                              {item.title}
                            </Text>
                            <View style={styles.myGalleryMeta}>
                              <View style={styles.myGalleryMetaItem}>
                                <Feather name="heart" size={12} color="#fff" />
                                <Text style={styles.myGalleryMetaText}>{item.likes || 0}</Text>
                              </View>
                              <View style={styles.myGalleryMetaItem}>
                                <Feather name="eye" size={12} color="#fff" />
                                <Text style={styles.myGalleryMetaText}>{item.views || 0}</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Feather name="image" size={64} color="#e5e7eb" />
                    <Text style={styles.emptyStateText}>작성한 작품이 없습니다</Text>
                    <Text style={styles.emptyStateSubtext}>
                      갤러리에 첫 번째 작품을 공유해보세요!
                    </Text>
                    <TouchableOpacity
                      style={styles.browseButton}
                      onPress={() => router.push('/gallery')}
                    >
                      <Feather name="plus-circle" size={18} color="#fff" />
                      <Text style={styles.browseButtonText}>작품 업로드</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}

              {/* 내 게시판 글 */}
              {myContentSubTab === '내 게시판 글' && (
                myPosts.length > 0 ? (
                  <View style={styles.myPostsList}>
                    {myPosts.map(post => (
                      <TouchableOpacity
                        key={post.id}
                        style={styles.myPostCard}
                        onPress={() => router.push(`/community/posts/${post.id}`)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.myPostHeader}>
                          <View style={styles.myPostCategoryBadge}>
                            <Text style={styles.myPostCategoryText}>{post.category}</Text>
                          </View>
                          <Text style={styles.myPostDate}>
                            {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Text>
                        </View>
                        <Text style={styles.myPostTitle} numberOfLines={2}>
                          {post.title}
                        </Text>
                        <Text style={styles.myPostContent} numberOfLines={2}>
                          {post.content}
                        </Text>
                        <View style={styles.myPostStats}>
                          <View style={styles.myPostStatItem}>
                            <Feather name="heart" size={14} color="#9ca3af" />
                            <Text style={styles.myPostStatText}>{post.likes || 0}</Text>
                          </View>
                          <View style={styles.myPostStatItem}>
                            <Feather name="message-circle" size={14} color="#9ca3af" />
                            <Text style={styles.myPostStatText}>{post.comments || 0}</Text>
                          </View>
                          <View style={styles.myPostStatItem}>
                            <Feather name="eye" size={14} color="#9ca3af" />
                            <Text style={styles.myPostStatText}>{post.views || 0}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Feather name="file-text" size={64} color="#e5e7eb" />
                    <Text style={styles.emptyStateText}>작성한 게시글이 없습니다</Text>
                    <Text style={styles.emptyStateSubtext}>
                      커뮤니티에 첫 번째 게시글을 작성해보세요!
                    </Text>
                    <TouchableOpacity
                      style={styles.browseButton}
                      onPress={() => router.push('/community')}
                    >
                      <Feather name="edit" size={18} color="#fff" />
                      <Text style={styles.browseButtonText}>게시글 작성</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </>
          )}

          {activeTab === '일정' && (
            <>
              {/* Calendar */}
              <View style={styles.calendarContainer}>
                <Calendar
                  markingType={'multi-dot'}
                  markedDates={markedDates}
                  monthFormat={'yyyy년 MM월'}
                  onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                  }}
                  theme={{
                    todayTextColor: '#FF7A5C',
                    selectedDayBackgroundColor: '#FF7A5C',
                    selectedDayTextColor: '#ffffff',
                    arrowColor: '#FF7A5C',
                    monthTextColor: '#333',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 18,
                    textDayFontSize: 16,
                    textDayHeaderFontSize: 14,
                  }}
                  style={styles.calendar}
                />
              </View>

              {/* Add Schedule Button */}
              <TouchableOpacity
                style={styles.addScheduleButton}
                onPress={() => {
                  setEditingSchedule(null);
                  setIsAddScheduleModalVisible(true);
                }}
              >
                <Feather name="plus" size={20} color="#fff" />
                <Text style={styles.addScheduleButtonText}>일정 추가</Text>
              </TouchableOpacity>

              {/* Selected Date Header */}
              {selectedDate && (
                <View style={styles.selectedDateHeader}>
                  <Feather name="calendar" size={18} color="#FF7A5C" />
                  <Text style={styles.selectedDateText}>
                    {new Date(selectedDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </Text>
                </View>
              )}

              {/* Schedule List */}
              {userSchedules.length > 0 ? (
                userSchedules
                  .filter((s) => {
                    // 선택된 날짜가 있으면 해당 날짜만, 없으면 전체 미래 일정
                    if (selectedDate) {
                      const scheduleDate = new Date(s.date).toISOString().split('T')[0];
                      return scheduleDate === selectedDate;
                    }
                    return new Date(s.date) >= new Date();
                  })
                  .slice(0, 10)
                  .map(item => {

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.scheduleCard}
                        onLongPress={() => handleScheduleLongPress(item)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
                        <View style={styles.scheduleContent}>
                          <View style={styles.scheduleHeader}>
                            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
                              <Text style={styles.typeBadgeText}>{getTypeLabel(item.type)}</Text>
                            </View>
                            <Text style={styles.scheduleTitle}>{item.title}</Text>
                          </View>
                          <View style={styles.scheduleDetails}>
                            <View style={styles.scheduleDetailItem}>
                              <Feather name="calendar" size={14} color="#666" />
                              <Text style={styles.scheduleDetailText}>
                                {new Date(item.date).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'short',
                                })}
                              </Text>
                            </View>
                            {item.time && (
                              <View style={styles.scheduleDetailItem}>
                                <Feather name="clock" size={14} color="#666" />
                                <Text style={styles.scheduleDetailText}>{item.time}</Text>
                              </View>
                            )}
                            {item.location && (
                              <View style={styles.scheduleDetailItem}>
                                <Feather name="map-pin" size={14} color="#666" />
                                <Text style={styles.scheduleDetailText}>{item.location}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
              ) : (
                <View style={styles.emptySchedule}>
                  <Feather name="calendar" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>예정된 일정이 없습니다.</Text>
                  <Text style={styles.emptySubtext}>새로운 취미 활동 일정을 추가해보세요!</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Add Schedule Modal */}
      <AddScheduleModal
        visible={isAddScheduleModalVisible}
        onClose={() => {
          setIsAddScheduleModalVisible(false);
          setEditingSchedule(null);
        }}
        editingSchedule={editingSchedule}
        onScheduleAdded={() => {
          loadMyPageData(); // Refresh data after adding/updating schedule
          setEditingSchedule(null);
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isEditProfileModalVisible}
        onClose={() => setIsEditProfileModalVisible(false)}
        user={user}
        onUpdate={() => {
          loadMyPageData(); // Refresh data after profile update
        }}
      />
    </SafeAreaView>
  );
}

// styles 정의
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { justifyContent: 'center', alignItems: 'center', flex:1 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 2, borderBottomColor: '#e5e7eb', },  // Thicker border
  headerTitle: { fontSize: 24, fontWeight: 'bold' },  // 20→24 for readability
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  profileCard: { backgroundColor: 'white', alignItems: 'center', padding: 26, margin: 16, borderRadius: 12, },  // 24→26
  avatarContainer: { marginBottom: 18 },  // 16→18
  avatar: { width: 104, height: 104, borderRadius: 52, backgroundColor: '#e5e7eb' },  // 96→104 for better visibility
  avatarFallback: { backgroundColor: '#FF7A5C', justifyContent: 'center', alignItems: 'center', },
  avatarFallbackText: { color: 'white', fontSize: 44 },  // 40→44 for readability
  profileName: { fontSize: 26, fontWeight: 'bold', marginBottom: 6, lineHeight: 34 },  // 24→26 for readability
  profileInfo: { fontSize: 18, color: '#4B5563', marginBottom: 18 },  // 16→18, darker color
  editButton: { borderColor: '#e5e7eb', borderWidth: 2, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, minHeight: 48 },  // Larger touch area
  editButtonText: { fontWeight: '600', fontSize: 16 },  // Added explicit size
  card: { backgroundColor: 'white', padding: 18, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, },  // 16→18
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 14 },  // 18→20, 12→14
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, },  // 8→10
  statsItem: { flexDirection: 'row', alignItems: 'center' },
  statsLabel: { marginLeft: 10, color: '#4B5563', fontSize: 16 },  // 8→10, darker color, explicit size
  statsValue: { fontSize: 18, fontWeight: 'bold' },  // 16→18
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#FF7A5C',
    shadowColor: '#FF7A5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: -0.3,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  tabContent: {
    marginHorizontal: 16,
    marginTop: 0,
  },
  listItemCard: { backgroundColor: 'white', padding: 18, borderRadius: 12, marginBottom: 14, },  // 16→18, 12→14
  listItemTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6, lineHeight: 26 },  // 18→20, added line height
  listItemSubtitle: { color: '#4B5563', fontSize: 16, marginBottom: 10 },  // 14→16, darker color
  typeBadge: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, },  // 4→6, 8→10
  typeBadgeText: { fontSize: 14, fontWeight: '600', color: '#fff', },  // 12→14
  emptyText: { textAlign: 'center', color: '#4B5563', padding: 26, fontSize: 18 },  // Darker color, explicit size
  emptySubtext: { textAlign: 'center', color: '#9ca3af', fontSize: 16, marginTop: 10 },  // 14→16, 8→10
  loginButton: { marginTop: 22, backgroundColor: '#FF7A5C', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 8, minHeight: 52 },  // Larger touch area
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', },  // 16→18
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7A5C',
    paddingVertical: 14,  // 12→14
    paddingHorizontal: 18,  // 16→18
    borderRadius: 8,
    marginBottom: 18,  // 16→18
    gap: 10,  // 8→10
    minHeight: 52,  // Added minimum touch target
  },
  addScheduleButtonText: {
    color: '#fff',
    fontSize: 18,  // 16→18 for readability
    fontWeight: '600',
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,  // 12→14
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeIndicator: {
    width: 5,  // 4→5 for better visibility
  },
  scheduleContent: {
    flex: 1,
    padding: 18,  // 16→18
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,  // 12→14
    gap: 10,  // 8→10
  },
  scheduleTitle: {
    fontSize: 18,  // 16→18 for readability
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    lineHeight: 24,
  },
  scheduleDetails: {
    gap: 8,  // 6→8
  },
  scheduleDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,  // 6→7
  },
  scheduleDetailText: {
    fontSize: 16,  // 14→16 for readability
    color: '#4B5563',  // Darker color
  },
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 12,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,  // 8→10
    paddingHorizontal: 18,  // 16→18
    paddingVertical: 14,  // 12→14
    backgroundColor: '#FFF5F2',
    borderRadius: 8,
    marginBottom: 18,  // 16→18
  },
  selectedDateText: {
    fontSize: 18,  // 16→18 for readability
    fontWeight: '600',
    color: '#333',
  },
  // Hobbies Grid Styles
  hobbiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hobbyCard: {
    width: '48%',
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
  hobbyCardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  hobbyCardContent: {
    padding: 12,
  },
  hobbyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hobbyCardCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF7A5C',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  hobbyCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 20,
  },
  hobbyCardDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  hobbyCardError: {
    padding: 16,
    textAlign: 'center',
    color: '#ef4444',
    fontSize: 14,
  },
  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF7A5C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Communities Grid Styles
  communitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  communityCard: {
    width: '48%',
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
  communityCardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  communityImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityCardContent: {
    padding: 12,
  },
  communityCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  communityCardInfo: {
    gap: 6,
  },
  communityInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  communityInfoText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
    lineHeight: 16,
  },
  communityMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5F2',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  communityMemberText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF7A5C',
  },
  // 내글 탭 스타일
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 8,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  subTabButtonActive: {
    backgroundColor: '#FFF5F2',
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  subTabTextActive: {
    color: '#FF7A5C',
  },
  // 내 작품 그리드
  myGalleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  myGalleryCard: {
    width: '48%',
    aspectRatio: 0.75,
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
  myGalleryImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
  },
  myGalleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  myGalleryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  myGalleryMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  myGalleryMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  myGalleryMetaText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  // 내 게시판 글
  myPostsList: {
    gap: 12,
  },
  myPostCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  myPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  myPostCategoryBadge: {
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  myPostCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF7A5C',
  },
  myPostDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  myPostTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  myPostContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  myPostStats: {
    flexDirection: 'row',
    gap: 16,
  },
  myPostStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  myPostStatText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
});