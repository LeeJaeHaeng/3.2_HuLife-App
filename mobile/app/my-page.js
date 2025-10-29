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
import { Calendar } from 'react-native-calendars';
import { getCurrentUser, logoutUser } from '../api/authService';
import { getUserCommunitiesAPI, getUserHobbiesAPI, getUserSchedulesAPI } from '../api/userService';
import AddScheduleModal from '../components/AddScheduleModal';
import EditProfileModal from '../components/EditProfileModal';

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

  const [user, setUser] = useState(null);
  const [userHobbies, setUserHobbies] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [userSchedules, setUserSchedules] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 (초기 + 새로고침 통합)
  const [error, setError] = useState(null);
  const [isAddScheduleModalVisible, setIsAddScheduleModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);

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

      const [userData, hobbiesData, communitiesData, schedulesData] = await Promise.all([
        getCurrentUser(),
        getUserHobbiesAPI(),
        getUserCommunitiesAPI(),
        getUserSchedulesAPI()
      ]);

      console.log("[마이페이지] 받은 사용자 데이터:", userData ? 'OK' : '실패');
      console.log("[마이페이지] 받은 관심 취미 데이터:", JSON.stringify(hobbiesData, null, 2));
      console.log("[마이페이지] 받은 참여 모임 데이터:", communitiesData ? `${communitiesData.length}개` : '실패');
      console.log("[마이페이지] 받은 일정 데이터:", schedulesData ? `${schedulesData.length}개` : '실패');

      // 상태 업데이트
      setUser(userData);
      setUserHobbies(Array.isArray(hobbiesData) ? hobbiesData : []);
      setUserCommunities(Array.isArray(communitiesData) ? communitiesData : []);
      setUserSchedules(Array.isArray(schedulesData) ? schedulesData : []);
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
           <TabButton label="일정" activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>

        {/* 5. 탭 컨텐츠 */}
        <View style={styles.tabContent}>
          {activeTab === '관심 취미' && (
            userHobbies.length > 0 ? (
              userHobbies.map(item => (
                item.hobby ? (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.listItemCard}
                    onPress={() => router.push(`/hobbies/${item.hobbyId}`)}
                  >
                    <Text style={styles.listItemTitle}>{item.hobby.name || `ID: ${item.hobbyId}`}</Text>
                    <Text style={styles.listItemSubtitle}>상태: {item.status} • 진행도: {item.progress || 0}%</Text>
                  </TouchableOpacity>
                ) : (
                  <View key={item.id} style={styles.listItemCard}>
                     <Text style={styles.listItemTitle}>취미 정보 로딩 실패 (ID: {item.hobbyId})</Text>
                  </View>
                )
              ))
            ) : <Text style={styles.emptyText}>아직 관심 취미가 없습니다.</Text>
          )}

          {activeTab === '참여 모임' && (
             userCommunities.length > 0 ? (
              userCommunities.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.listItemCard}
                  onPress={() => router.push(`/community/${item.communityId || item.id}`)}
                >
                  <Text style={styles.listItemTitle}>{item.community?.name || item.name || '커뮤니티'}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {item.community?.location || item.location || '위치 미정'}
                    {(item.community?.schedule || item.schedule) ? ` • ${item.community?.schedule || item.schedule}` : ''}
                  </Text>
                </TouchableOpacity>
              ))
            ) : <Text style={styles.emptyText}>아직 참여한 모임이 없습니다.</Text>
          )}

          {activeTab === '일정' && (
            <>
              {/* Calendar */}
              <View style={styles.calendarContainer}>
                <Calendar
                  markingType={'multi-dot'}
                  markedDates={markedDates}
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
                onPress={() => setIsAddScheduleModalVisible(true)}
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
                      <View key={item.id} style={styles.scheduleCard}>
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
                      </View>
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
        onClose={() => setIsAddScheduleModalVisible(false)}
        onScheduleAdded={() => {
          loadMyPageData(); // Refresh data after adding schedule
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
  tabContainer: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 16, borderRadius: 12, padding: 6, },  // 4→6
  tab: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', minHeight: 52 },  // 12→14, added minHeight
  activeTab: { backgroundColor: '#FF7A5C' },
  tabText: { fontSize: 18, fontWeight: '600', color: 'black' },  // 16→18
  activeTabText: { color: 'white' },
  tabContent: { marginHorizontal: 16, marginTop: 18 },  // 16→18
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
});