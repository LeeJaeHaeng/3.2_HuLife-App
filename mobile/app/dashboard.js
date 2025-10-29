import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router'; // useRouter 추가
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // ActivityIndicator 추가
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser } from '../api/authService'; // 사용자 정보
import { getRecommendationsAPI } from '../api/surveyService'; // 추천 데이터
import { getUserCommunitiesAPI, getUserHobbiesAPI, getUserSchedulesAPI } from '../api/userService'; // 사용자 관련 데이터
import hobbyImages from '../assets/hobbyImages'; // 이미지 맵

// SummaryCard 컴포넌트 (변경 없음)
const SummaryCard = ({ icon, value, label, link }) => (
    <Link href={link} asChild>
        <TouchableOpacity style={styles.summaryCard}>
            {icon}
            <Text style={styles.summaryValue}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </TouchableOpacity>
    </Link>
);

// ProgressBar 컴포넌트 (변경 없음)
const ProgressBar = ({ value }) => (
    <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
);

export default function DashboardScreen() {
    const router = useRouter(); // 라우터 사용
    // ✨ 실제 데이터를 담을 상태 변수들
    const [user, setUser] = useState(null);
    const [userHobbies, setUserHobbies] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);
    const [userSchedules, setUserSchedules] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✨ 화면 로드 시 모든 데이터를 한 번에 가져옵니다.
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                // 여러 API 동시 호출
                const [userData, hobbiesData, communitiesData, schedulesData, recsData] = await Promise.all([
                    getCurrentUser(),
                    getUserHobbiesAPI(),
                    getUserCommunitiesAPI(),
                    getUserSchedulesAPI(),
                    getRecommendationsAPI() // 추천 목록 호출
                ]);

                setUser(userData);
                setUserHobbies(Array.isArray(hobbiesData) ? hobbiesData : []);
                setUserCommunities(Array.isArray(communitiesData) ? communitiesData : []);
                setUserSchedules(Array.isArray(schedulesData) ? schedulesData : []);
                // 추천 데이터 처리 (recommendations 키 확인)
                setRecommendations(Array.isArray(recsData?.recommendations) ? recsData.recommendations : []);

            } catch (e) {
                setError("대시보드 정보를 불러오는 데 실패했습니다.");
                console.error("[대시보드 에러]", e);
                // 로그인 필요 에러 시 로그인 화면으로 이동
                if (e.message?.includes("로그인이 필요합니다") || e.response?.status === 401) {
                  router.replace('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []); // 마운트 시 한 번만 실행

    // 로딩 중 화면
    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#FF7A5C" />
            </SafeAreaView>
        );
    }

    // 에러 발생 시
    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <Text>{error}</Text>
                {/* 재시도 버튼이나 로그인 버튼 추가 가능 */}
                <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/login')}>
                   <Text style={styles.retryButtonText}>로그인 화면으로</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // 데이터 로드 성공 시
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* 1. 헤더 영역 */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../assets/hobbies/hulife_logo.png')} style={styles.logo} />
                        <Text style={styles.headerTitle}>휴라이프</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <Link href="/community" asChild>
                            <TouchableOpacity>
                                <Feather name="users" size={24} color="#FF7A5C" />
                            </TouchableOpacity>
                        </Link>
                        <Link href="/my-page" asChild>
                            <TouchableOpacity>
                                <Feather name="user" size={24} color="#FF7A5C" />
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* 2. 환영 메시지 */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>안녕하세요, {user?.name || '사용자'}님!</Text>
                    <Text style={styles.welcomeSubtitle}>오늘도 즐거운 취미 생활 되세요</Text>
                </View>

                {/* 3. 취미 추천 배너 */}
                <Link href="/survey" asChild>
                    <TouchableOpacity style={styles.surveyBanner}>
                        <Feather name="search" size={24} color="white" />
                        <View style={{ marginLeft: 16, flexShrink: 1 }}>
                            <Text style={styles.bannerTitle}>나에게 꼭 맞는 취미 찾기</Text>
                            <Text style={styles.bannerSubtitle}>간단한 설문으로 맞춤 취미를 추천받으세요!</Text>
                        </View>
                    </TouchableOpacity>
                </Link>

                {/* 4. 요약 카드 그리드 (✨ 실제 데이터 개수 사용) */}
                <View style={styles.summaryGrid}>
                    <SummaryCard icon={<Feather name="heart" size={28} color="#FF7A5C" />} value={userHobbies.length} label="관심 취미" link="/hobbies" />
                    <SummaryCard icon={<Feather name="users" size={28} color="#FF7A5C" />} value={userCommunities.length} label="참여 모임" link="/community" />
                    <SummaryCard icon={<Feather name="calendar" size={28} color="#FF7A5C" />} value={userSchedules.length} label="예정된 일정" link="/my-page" />
                    {/* 완료한 취미는 userHobbies 데이터 구조에 따라 달라짐 (일단 0으로 표시) */}
                    <SummaryCard icon={<Feather name="award" size={28} color="#FF7A5C" />} value={userHobbies.filter(h => h.status === 'completed').length} label="완료한 취미" link="/my-page" />
                </View>

                {/* 5. 추천 취미 (✨ 실제 추천 데이터 사용) */}
                {recommendations.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>추천 취미</Text>
                        {recommendations.slice(0, 3).map(hobby => ( // 최대 3개 표시
                            <TouchableOpacity key={hobby.id} style={styles.listItem} onPress={() => router.push(`/hobbies/${hobby.id}`)}>
                                <Image source={hobbyImages[hobby.name] || require('../assets/hobbies/hulife_logo.png')} style={styles.itemImage} />
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemTitle}>{hobby.name}</Text>
                                    <View style={styles.progressContainer}>
                                        <ProgressBar value={hobby.matchScore} />
                                        <Text style={styles.matchScore}>{hobby.matchScore}% 매칭</Text>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.viewMoreButton} onPress={() => router.push('/recommendations')}>
                            <Text style={styles.viewMoreButtonText}>모든 추천 보기</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 6. 다가오는 일정 (✨ 실제 일정 데이터 사용) */}
                {userSchedules.length > 0 && (
                     <View style={styles.card}>
                        <Text style={styles.cardTitle}>다가오는 일정</Text>
                        {/* 날짜가 가까운 순서대로 정렬 후 최대 2개 표시 */}
                        {userSchedules
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .slice(0, 2)
                            .map(event => (
                                <View key={event.id} style={styles.scheduleItem}>
                                    <Text style={styles.itemTitle}>{event.title}</Text>
                                    <Text style={styles.itemSubtitle}>
                                        {new Date(event.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                                        {event.time ? ` • ${event.time}` : ''}
                                    </Text>
                                </View>
                         ))}
                     </View>
                )}

                {/* 7. 학습 진행도 (✨ 실제 관심 취미 데이터 사용) */}
                {userHobbies.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>학습 진행도</Text>
                        {userHobbies.slice(0, 5).map(item => (
                            // hobby 객체에 JOIN된 취미 정보가 포함되어 있음
                            <TouchableOpacity
                                key={item.id}
                                style={{ marginBottom: 16 }}
                                onPress={() => router.push(`/hobbies/${item.hobbyId}`)}
                            >
                                <View style={styles.progressLabelContainer}>
                                    <Text style={styles.itemTitle}>{item.hobby?.name || `취미 ID: ${item.hobbyId}`}</Text>
                                    <Text style={styles.itemSubtitle}>{item.progress || 0}% 완료</Text>
                                </View>
                                <ProgressBar value={item.progress || 0} />
                            </TouchableOpacity>
                        ))}
                    </View>
                 )}
            </ScrollView>
        </SafeAreaView>
    );
}

// styles 정의 (일부 스타일 추가/수정)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'white', borderBottomWidth: 2, borderBottomColor: '#eee' },  // Thicker border
    logo: { width: 44, height: 44, marginRight: 10 },  // 40→44, 8→10
    headerTitle: { fontSize: 26, fontWeight: 'bold' },  // 22→26 for readability
    headerLink: { fontSize: 18, color: '#FF7A5C', fontWeight: '500' },  // 16→18
    welcomeSection: { padding: 22 },  // 20→22
    welcomeTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 6, lineHeight: 38 },  // 28→30 for readability
    welcomeSubtitle: { fontSize: 20, color: '#4B5563' },  // 18→20, darker color
    surveyBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF7A5C', padding: 22, borderRadius: 12, marginHorizontal: 16, marginBottom: 18, minHeight: 90 },  // 20→22, added minHeight
    bannerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', lineHeight: 26 },  // 18→20 for readability
    bannerSubtitle: { fontSize: 16, color: 'white', marginTop: 6 },  // 14→16, 4→6
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10 },
    summaryCard: { width: '45%', backgroundColor: 'white', borderRadius: 12, padding: 22, marginBottom: 20, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },  // 20→22
    summaryValue: { fontSize: 26, fontWeight: 'bold', marginTop: 10 },  // 24→26, 8→10
    summaryLabel: { fontSize: 16, color: '#4B5563', marginTop: 6 },  // 14→16, darker color, 4→6
    card: { backgroundColor: 'white', borderRadius: 12, padding: 22, marginHorizontal: 16, marginBottom: 18 },  // 20→22, 16→18
    cardTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 18 },  // 20→22, 16→18 for readability
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },  // 12→14
    itemImage: { width: 56, height: 56, borderRadius: 8, marginRight: 14, backgroundColor: '#e5e7eb' },  // 50→56, 12→14
    itemContent: { flex: 1 },
    itemTitle: { fontSize: 18, fontWeight: '500', lineHeight: 24 },  // 16→18 for readability
    itemSubtitle: { fontSize: 16, color: '#4B5563', marginTop: 6 },  // 14→16, darker color, 4→6
    progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },  // 8→10
    progressBg: { height: 10, backgroundColor: '#e9ecef', borderRadius: 5, flex: 1 },  // 8→10, 4→5
    progressFill: { height: 10, backgroundColor: '#FF7A5C', borderRadius: 5 },  // 8→10, 4→5
    progressLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },  // 8→10
    matchScore: { marginLeft: 12, fontSize: 16, color: '#FF7A5C', fontWeight: 'bold' },  // 10→12, 14→16
    viewMoreButton: { marginTop: 18, alignItems: 'center', paddingVertical: 10 },  // 16→18, added padding
    viewMoreButtonText: { color: '#FF7A5C', fontWeight: 'bold', fontSize: 16 },  // Added explicit size
    scheduleItem: { backgroundColor: '#f1f3f5', padding: 18, borderRadius: 8, marginBottom: 12 },  // 16→18, 10→12
    retryButton: { marginTop: 22, backgroundColor: '#FF7A5C', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 8, minHeight: 52 },  // Larger touch area
    retryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', }  // 16→18
});