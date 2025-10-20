import { Feather, Ionicons } from '@expo/vector-icons'; // Ionicons 추가 확인
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    DeviceEventEmitter,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRecommendationsAPI } from '../api/surveyService';
import { addHobbyToUserAPI, getUserHobbiesAPI, removeHobbyFromUserAPI } from '../api/userService';
import hobbyImages from '../assets/hobbyImages';

// RecommendationCard 컴포넌트 (변경 없음)
const RecommendationCard = ({ item, index, addedHobbies, onToggleInterest }) => {
    const router = useRouter();
    const isAdded = addedHobbies.has(item.id);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePress = async () => {
        setIsProcessing(true);
        await onToggleInterest(item.id, isAdded);
        setIsProcessing(false);
    };

    const imageSource = hobbyImages[item.name] || require('../assets/hobbies/hulife_logo.png');

    return (
        <View style={styles.card}>
            <Image source={imageSource} style={styles.cardImage} />
            {index === 0 && (
                <View style={styles.badge}>
                    <Ionicons name="sparkles" size={12} color="white" style={{ marginRight: 4 }}/>
                    <Text style={styles.badgeText}>최고 추천</Text>
                </View>
            )}
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={{ flexShrink: 1 }}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardCategory}>{item.category}</Text>
                    </View>
                    <Text style={styles.matchScore}>{item.matchScore}% 매칭</Text>
                </View>
                <Text style={styles.description}>{item.description}</Text>

                {item.reasons && item.reasons.length > 0 && (
                    <View style={styles.reasonSection}>
                        <Text style={styles.reasonTitle}>추천 이유:</Text>
                        {item.reasons.map((reason, idx) => (
                            <Text key={idx} style={styles.reasonText}>• {reason}</Text>
                        ))}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => router.push(`/hobbies/${item.id}`)}
                    >
                        <Text style={styles.detailsButtonText}>자세히 보기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.interestButton, isAdded && styles.interestButtonAdded]}
                        onPress={handlePress}
                        disabled={isProcessing}
                    >
                        <Feather name="heart" size={16} color={isAdded ? '#dc2626' : '#6b7280'} fill={isAdded ? '#dc2626' : 'none'} />
                        <Text style={[styles.interestButtonText, isAdded && styles.interestButtonTextAdded]}>
                            {isProcessing ? '처리중' : (isAdded ? '추가됨' : '관심 추가')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


// RecommendationsScreen 컴포넌트
export default function RecommendationsScreen() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState([]);
  const [addedHobbies, setAddedHobbies] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [recsResponse, hobbiesData] = await Promise.all([
          getRecommendationsAPI(),
          getUserHobbiesAPI()
        ]);

        const recsData = recsResponse.recommendations;

        if (Array.isArray(recsData)) {
            setRecommendations(recsData);
            if (recsData.length === 0) {
               Alert.alert("알림", "추천 결과를 생성하기 위해 설문조사를 먼저 진행해주세요.", [{ text: "설문하기", onPress: () => router.replace('/survey') }]);
            }
        } else {
             console.error("❌ 에러: 서버 응답에서 recommendations 배열을 찾을 수 없습니다.", recsResponse);
             throw new Error("서버 응답 형식이 올바르지 않습니다.");
        }

         if (Array.isArray(hobbiesData)) {
            setAddedHobbies(new Set(hobbiesData.map(h => h.hobbyId)));
        } else {
            console.warn("관심 취미 데이터 형식이 올바르지 않습니다.");
            setAddedHobbies(new Set());
        }

      } catch (e) {
        setError(e.message || "데이터를 불러오는 데 실패했습니다.");
         if (e.message?.includes("로그인이 필요합니다")) { }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🔔 전역 이벤트 리스너: 다른 화면에서 좋아요 상태가 변경되면 즉시 데이터 새로고침
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('HOBBY_INTEREST_CHANGED', () => {
      console.log("[추천 페이지] 🔔 좋아요 상태 변경 이벤트 수신! 관심 취미 목록 다시 확인...");
      // 관심 취미 목록만 다시 확인
      getUserHobbiesAPI().then(hobbiesData => {
        if (Array.isArray(hobbiesData)) {
          setAddedHobbies(new Set(hobbiesData.map(h => h.hobbyId)));
          console.log(`[추천 페이지] 관심 취미 개수 업데이트: ${hobbiesData.length}개`);
        }
      }).catch(err => {
        console.error("[추천 페이지] 관심 취미 목록 확인 실패:", err);
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleToggleInterest = async (hobbyId, isCurrentlyAdded) => {
    try {
      if (isCurrentlyAdded) {
        await removeHobbyFromUserAPI(hobbyId);
        setAddedHobbies(prev => {
          const next = new Set(prev);
          next.delete(hobbyId);
          return next;
        });
        Alert.alert("성공", "관심 취미에서 제거되었습니다.");
      } else {
        await addHobbyToUserAPI(hobbyId, 'interested');
        setAddedHobbies(prev => new Set(prev).add(hobbyId));
        Alert.alert("성공", "관심 취미에 추가되었습니다!");
      }
      // 🔔 전역 이벤트 발송: 마이페이지에 데이터 새로고침 알림
      DeviceEventEmitter.emit('HOBBY_INTEREST_CHANGED');
      console.log("[추천 페이지] 좋아요 상태 변경 이벤트 발송!");
    } catch (e) {
      Alert.alert("오류", e.message || "작업 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) { return ( <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#FF7A5C" /></View> ); }
  if (error) { return ( <SafeAreaView style={[styles.container, styles.center]}><StatusBar barStyle="dark-content" /><Text style={styles.errorText}>{error}</Text></SafeAreaView> ); }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/dashboard')}>
           <Image source={require('../assets/hobbies/hulife_logo.png')} style={{width: 30, height: 30}}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>맞춤 취미 추천</Text>
        <TouchableOpacity onPress={() => router.replace('/dashboard')}>
            <Text style={styles.headerLink}>대시보드</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recommendations}
        renderItem={({ item, index }) => (
          <RecommendationCard
            item={item}
            index={index}
            addedHobbies={addedHobbies}
            onToggleInterest={handleToggleInterest}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        // ✨ ListHeaderComponent에 실제 JSX 코드 삽입
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.title}>당신을 위한 맞춤 취미</Text>
            <Text style={styles.subtitle}>설문 결과를 바탕으로 가장 적합한 취미를 추천해드립니다.</Text>
          </View>
        }
        // ✨ ListFooterComponent에 실제 JSX 코드 삽입
        ListFooterComponent={
           <View style={styles.listFooter}>
             <Text style={styles.footerText}>마음에 드는 취미를 찾지 못하셨나요?</Text>
             <TouchableOpacity style={styles.footerButton} onPress={() => router.replace('/survey')}>
               <Text style={styles.footerButtonText}>설문 다시하기</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/hobbies')}>
               <Text style={styles.footerButtonText}>모든 취미 둘러보기</Text>
             </TouchableOpacity>
           </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

// styles 정의 (변경 없음)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  errorText: { color: '#dc2626', textAlign: 'center'},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerLink: { fontSize: 16, color: '#FF7A5C', fontWeight: '500' },
  listHeader: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 20},
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center'},
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center'},
  card: { backgroundColor: 'white', borderRadius: 12, marginHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, overflow: 'hidden' },
  cardImage: { width: '100%', height: 200, backgroundColor: '#e5e7eb' },
  badge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', marginRight: 8, flexShrink: 1 },
  cardCategory: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  matchScore: { fontSize: 14, fontWeight: 'bold', color: '#FF7A5C', marginLeft: 8 },
  description: { fontSize: 15, color: '#4b5563', lineHeight: 22, marginBottom: 16 },
  reasonSection: { marginBottom: 16, paddingLeft: 8 },
  reasonTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  reasonText: { fontSize: 14, color: '#6b7280', marginLeft: 8 },
  buttonContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
  detailsButton: { flex: 1, backgroundColor: '#FF7A5C', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  detailsButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  interestButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: '#d1d5db', borderWidth: 1, paddingVertical: 12, borderRadius: 8 },
  interestButtonAdded: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  interestButtonText: { color: '#6b7280', fontWeight: 'bold', fontSize: 16, marginLeft: 6 },
  interestButtonTextAdded: { color: '#dc2626' },
  listFooter: { alignItems: 'center', marginTop: 20, padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  footerText: { color: '#6b7280', marginBottom: 12 },
  footerButton: { borderColor: '#d1d5db', borderWidth: 1, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginBottom: 12, width: '80%', alignItems: 'center' },
  footerButtonText: { fontWeight: '600' },
});