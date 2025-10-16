import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

interface UserData {
  name: string;
  hobbiesCount: number;
  communitiesCount: number;
  schedulesCount: number;
  completedHobbiesCount: number;
}

interface Recommendation {
  id: string;
  name: string;
  category: string;
  matchScore: number;
}

interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
}

interface UserHobby {
  id: string;
  hobbyId: string;
  hobbyName: string;
  progress: number;
}

export default function DashboardScreen({navigation}: Props) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [userHobbies, setUserHobbies] = useState<UserHobby[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // API 호출 (현재는 목업 데이터 사용)
      // 실제 API 연동 시:
      // const response = await api.get('/dashboard');
      // setUserData(response.data.user);
      // setRecommendations(response.data.recommendations);
      // setSchedules(response.data.schedules);
      // setUserHobbies(response.data.userHobbies);

      // 목업 데이터
      setUserData({
        name: '사용자',
        hobbiesCount: 5,
        communitiesCount: 3,
        schedulesCount: 2,
        completedHobbiesCount: 1,
      });

      setRecommendations([
        {
          id: '1',
          name: '수채화',
          category: '미술',
          matchScore: 95,
        },
        {
          id: '2',
          name: '요가',
          category: '운동',
          matchScore: 88,
        },
        {
          id: '3',
          name: '독서 모임',
          category: '문화',
          matchScore: 82,
        },
      ]);

      setSchedules([
        {
          id: '1',
          title: '수채화 정기 모임',
          date: '2025-10-20',
          time: '14:00',
          location: '강남 문화센터',
        },
        {
          id: '2',
          title: '요가 클래스',
          date: '2025-10-22',
          time: '10:00',
          location: '서초 스포츠센터',
        },
      ]);

      setUserHobbies([
        {
          id: '1',
          hobbyId: '1',
          hobbyName: '수채화',
          progress: 65,
        },
        {
          id: '2',
          hobbyId: '2',
          hobbyName: '요가',
          progress: 40,
        },
        {
          id: '3',
          hobbyId: '3',
          hobbyName: '독서',
          progress: 20,
        },
      ]);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A5C" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 환영 메시지 */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          안녕하세요, {userData?.name}님!
        </Text>
        <Text style={styles.welcomeSubtitle}>오늘도 즐거운 취미 생활 되세요</Text>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Profile')}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>❤️</Text>
          </View>
          <Text style={styles.statNumber}>{userData?.hobbiesCount}</Text>
          <Text style={styles.statLabel}>관심 취미</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Profile')}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>👥</Text>
          </View>
          <Text style={styles.statNumber}>{userData?.communitiesCount}</Text>
          <Text style={styles.statLabel}>참여 중인 모임</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📅</Text>
          </View>
          <Text style={styles.statNumber}>{userData?.schedulesCount}</Text>
          <Text style={styles.statLabel}>예정된 일정</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>🏆</Text>
          </View>
          <Text style={styles.statNumber}>
            {userData?.completedHobbiesCount}
          </Text>
          <Text style={styles.statLabel}>완료한 취미</Text>
        </TouchableOpacity>
      </View>

      {/* 추천 취미 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추천 취미</Text>
        {recommendations.map(hobby => (
          <TouchableOpacity
            key={hobby.id}
            style={styles.recommendationCard}
            onPress={() =>
              navigation.navigate('HobbyDetail', {hobbyId: hobby.id})
            }>
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationName}>{hobby.name}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{hobby.category}</Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {width: `${hobby.matchScore}%`},
                    ]}
                  />
                </View>
                <Text style={styles.matchScore}>{hobby.matchScore}% 매칭</Text>
              </View>
            </View>
            <View style={styles.viewButton}>
              <Text style={styles.viewButtonText}>보기</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => navigation.navigate('Recommendations', {surveyResults: {}})}>
          <Text style={styles.moreButtonText}>더 많은 추천 보기</Text>
        </TouchableOpacity>
      </View>

      {/* 다가오는 일정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>다가오는 일정</Text>
        {schedules.length > 0 ? (
          schedules.map(event => (
            <View key={event.id} style={styles.scheduleCard}>
              <Text style={styles.scheduleTitle}>{event.title}</Text>
              <Text style={styles.scheduleDateTime}>
                {formatDate(event.date)} {event.time}
              </Text>
              {event.location && (
                <Text style={styles.scheduleLocation}>{event.location}</Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>예정된 일정이 없습니다</Text>
          </View>
        )}
      </View>

      {/* 학습 진행도 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>학습 진행도</Text>
        {userHobbies.length > 0 ? (
          userHobbies.map(userHobby => (
            <View key={userHobby.id} style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View style={styles.progressTitleContainer}>
                  <Text style={styles.progressIcon}>📚</Text>
                  <Text style={styles.progressHobbyName}>
                    {userHobby.hobbyName}
                  </Text>
                </View>
                <Text style={styles.progressPercentage}>
                  {userHobby.progress}% 완료
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {width: `${userHobby.progress}%`},
                  ]}
                />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              아직 시작한 취미가 없습니다
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 32,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF7A5C',
    borderRadius: 4,
  },
  matchScore: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF7A5C',
    marginLeft: 12,
  },
  viewButton: {
    backgroundColor: '#FF7A5C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  moreButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  moreButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },
  scheduleCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  scheduleDateTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  scheduleLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressCard: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  progressHobbyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
