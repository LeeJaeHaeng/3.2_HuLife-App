import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  DeviceEventEmitter,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// ✨ Heart 아이콘 대신 Feather 세트만 가져옵니다.
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllHobbies } from '../api/hobbyService';
import { addHobbyToUserAPI, getUserHobbiesAPI, removeHobbyFromUserAPI } from '../api/userService';
import hobbyImages from '../assets/hobbyImages';


// HobbyCard 컴포넌트 수정
const HobbyCard = ({ item, addedHobbies, onToggleInterest }) => {
  const router = useRouter();
  const isAdded = addedHobbies.has(item.id);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageSource = hobbyImages[item.name] || require('../assets/hobbies/hulife_logo.png');

  const handleToggle = async () => {
    setIsProcessing(true);
    await onToggleInterest(item.id, isAdded);
    setIsProcessing(false);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => router.push(`/hobbies/${item.id}`)}>
        <Image source={imageSource} style={styles.cardImage} />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <TouchableOpacity onPress={handleToggle} disabled={isProcessing} style={styles.heartButton}>
            {/* ✨ Heart 대신 Feather name="heart" 를 사용합니다. */}
            <Feather 
              name="heart"
              size={24}
              color={isAdded ? '#dc2626' : '#9ca3af'}
              fill={isAdded ? '#dc2626' : 'none'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </View>
  );
};


// HobbiesScreen 컴포넌트
export default function HobbiesScreen() {
  const router = useRouter();
  const [hobbies, setHobbies] = useState([]);
  const [addedHobbies, setAddedHobbies] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [difficultyFilter, setDifficultyFilter] = useState('전체');
  const [indoorOutdoorFilter, setIndoorOutdoorFilter] = useState('전체');
  const [budgetFilter, setBudgetFilter] = useState('전체');
  const [filtersExpanded, setFiltersExpanded] = useState(false); // 필터 접기/펴기 상태

  const loadData = useCallback(async () => {
      if (refreshing) return;
      try {
        setError(null);
        console.log("[취미 목록] 데이터 로딩 시작...");
        const [allHobbiesData, userHobbiesData] = await Promise.all([
          getAllHobbies(),
          getUserHobbiesAPI()
        ]);

        if (Array.isArray(allHobbiesData)) {
          setHobbies(allHobbiesData);
        } else {
          throw new Error("취미 목록 데이터 형식이 올바르지 않습니다.");
        }
        if (Array.isArray(userHobbiesData)) {
          setAddedHobbies(new Set(userHobbiesData.map(h => h.hobbyId)));
        } else {
          console.warn("관심 취미 데이터 형식이 올바르지 않습니다.");
          setAddedHobbies(new Set());
        }
        console.log("[취미 목록] 데이터 로딩 성공.");

      } catch (e) {
        setError("데이터를 불러오는 데 실패했습니다.");
        console.error("[취미 목록 에러]", e);
      } finally {
        if (loading) setLoading(false);
        if (refreshing) setRefreshing(false);
      }
  }, [loading, refreshing]);

  useFocusEffect(
    useCallback(() => {
      console.log("[취미 목록] 화면 포커스됨. 데이터 새로고침 시도.");
      if (!loading) {
          setRefreshing(true);
          loadData();
      } else if (hobbies.length === 0) {
          loadData();
      }
      return () => {
        console.log("[취미 목록] 화면 포커스 잃음.");
      };
    }, [loadData, loading, hobbies.length])
  );

  // 🔔 전역 이벤트 리스너: 다른 화면에서 좋아요 상태가 변경되면 즉시 데이터 새로고침
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('HOBBY_INTEREST_CHANGED', () => {
      console.log("[취미 목록] 🔔 좋아요 상태 변경 이벤트 수신! 관심 취미 목록 다시 확인...");
      // 관심 취미 목록만 다시 확인
      getUserHobbiesAPI().then(userHobbiesData => {
        if (Array.isArray(userHobbiesData)) {
          setAddedHobbies(new Set(userHobbiesData.map(h => h.hobbyId)));
          console.log(`[취미 목록] 관심 취미 개수 업데이트: ${userHobbiesData.length}개`);
        }
      }).catch(err => {
        console.error("[취미 목록] 관심 취미 목록 확인 실패:", err);
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
      } else {
        await addHobbyToUserAPI(hobbyId, 'interested');
        setAddedHobbies(prev => new Set(prev).add(hobbyId));
      }
      // 🔔 전역 이벤트 발송: 마이페이지에 데이터 새로고침 알림
      DeviceEventEmitter.emit('HOBBY_INTEREST_CHANGED');
      console.log("[취미 목록] 좋아요 상태 변경 이벤트 발송!");
    } catch (e) {
      Alert.alert("오류", e.message || "작업 처리 중 오류가 발생했습니다.");
    }
  };

  // Filter hobbies based on search and all filters
  const filteredHobbies = hobbies.filter(hobby => {
    const matchesSearch = searchQuery
      ? hobby.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hobby.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = categoryFilter === '전체'
      ? true
      : hobby.category === categoryFilter;

    const matchesDifficulty = difficultyFilter === '전체'
      ? true
      : hobby.difficulty === difficultyFilter;

    const matchesIndoorOutdoor = indoorOutdoorFilter === '전체'
      ? true
      : hobby.indoorOutdoor === indoorOutdoorFilter;

    const matchesBudget = budgetFilter === '전체'
      ? true
      : hobby.budget === budgetFilter;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesIndoorOutdoor && matchesBudget;
  });

  // Get unique filter values from hobbies
  const categories = ['전체', ...new Set(hobbies.map(h => h.category))];
  const difficulties = ['전체', '쉬움', '보통', '어려움'];
  const indoorOutdoorOptions = ['전체', '실내', '실외', '둘 다'];
  const budgetOptions = ['전체', '무료', '저렴', '보통', '비쌈'];


  if (loading && hobbies.length === 0) {
     return (
        <SafeAreaView style={[styles.container, styles.center]}>
            <ActivityIndicator size="large" color="#FF7A5C" />
        </SafeAreaView>
     );
  }
  if (error) {
     return (
        <SafeAreaView style={[styles.container, styles.center]}>
            <Text>{error}</Text>
        </SafeAreaView>
     );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>모든 취미</Text>
        <TouchableOpacity onPress={() => router.push('/community')}>
          <Feather name="users" size={24} color="#FF7A5C" />
        </TouchableOpacity>
      </View>

      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          placeholder="어떤 취미를 찾으시나요?"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Feather name="x" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* 필터 토글 버튼 */}
      <TouchableOpacity
        style={styles.filterToggleButton}
        onPress={() => setFiltersExpanded(!filtersExpanded)}
      >
        <Feather name="filter" size={20} color="#FF7A5C" />
        <Text style={styles.filterToggleText}>
          {filtersExpanded ? '필터 접기' : '필터 펼치기'}
        </Text>
        <Feather
          name={filtersExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#FF7A5C"
        />
      </TouchableOpacity>

      {/* 필터 섹션 (접기/펴기 가능) */}
      {filtersExpanded && (
        <>
          {/* 카테고리 필터 */}
          <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>카테고리</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                categoryFilter === item && styles.categoryChipActive
              ]}
              onPress={() => setCategoryFilter(item)}
            >
              <Text style={[
                styles.categoryChipText,
                categoryFilter === item && styles.categoryChipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* 난이도 필터 */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>난이도</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={difficulties}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                difficultyFilter === item && styles.categoryChipActive
              ]}
              onPress={() => setDifficultyFilter(item)}
            >
              <Text style={[
                styles.categoryChipText,
                difficultyFilter === item && styles.categoryChipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* 실내/실외 필터 */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>장소</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={indoorOutdoorOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                indoorOutdoorFilter === item && styles.categoryChipActive
              ]}
              onPress={() => setIndoorOutdoorFilter(item)}
            >
              <Text style={[
                styles.categoryChipText,
                indoorOutdoorFilter === item && styles.categoryChipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* 예산 필터 */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>예산</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={budgetOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                budgetFilter === item && styles.categoryChipActive
              ]}
              onPress={() => setBudgetFilter(item)}
            >
              <Text style={[
                styles.categoryChipText,
                budgetFilter === item && styles.categoryChipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>
        </>
      )}

      {/* 취미 목록 */}
      <FlatList
        numColumns={2}
        data={filteredHobbies}
        renderItem={({ item }) => (
          <HobbyCard
            item={item}
            addedHobbies={addedHobbies}
            onToggleInterest={handleToggleInterest}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.title}>모든 취미 둘러보기</Text>
            <Text style={styles.subtitle}>
              다양한 취미 활동 중에서 당신에게 맞는 것을 찾아보세요
            </Text>
          </View>
        }
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Feather name="search" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  {searchQuery || categoryFilter !== '전체'
                    ? '검색 결과가 없습니다.'
                    : '표시할 취미가 없습니다.'}
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

// styles 정의 (변경 없음)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  infoText: { fontSize: 16, color: '#6b7280', marginTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  loadingOverlay: { position: 'absolute', top: 120, left: 0, right: 0, alignItems: 'center', zIndex: 10 }, 
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  listHeader: { marginBottom: 24, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#6b7280' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, marginHorizontal: 16, marginTop: 16, paddingHorizontal: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 50, fontSize: 16 },
  clearButton: { padding: 4 },
  filterToggleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F0', paddingVertical: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 8, gap: 8 },
  filterToggleText: { fontSize: 14, fontWeight: '600', color: '#FF7A5C' },
  filterContainer: { paddingVertical: 12 },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#333', paddingHorizontal: 16, marginBottom: 8 },
  filterList: { paddingHorizontal: 16, gap: 8 },
  categoryChip: { backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#FF7A5C' },
  categoryChipText: { fontSize: 14, color: '#666', fontWeight: '500' },
  categoryChipTextActive: { color: '#fff' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 16, color: '#999', marginTop: 16 },
  card: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, marginHorizontal: 6, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, },
  cardImage: { width: '100%', height: 140, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: '#e5e7eb' },
  cardContent: { padding: 12 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, },
  cardCategory: { fontSize: 12, color: '#FF7A5C', fontWeight: '600', },
  heartButton: { padding: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardDescription: { fontSize: 13, color: '#4b5563', lineHeight: 18 },
});