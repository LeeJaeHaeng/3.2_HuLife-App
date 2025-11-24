import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllGalleryItems, toggleGalleryLike } from '../api/galleryService';
import * as SecureStore from 'expo-secure-store';
import hobbyImages from '../assets/hobbyImages';

// 갤러리 카드 컴포넌트 (2-column grid)
const GalleryCard = ({ item, onPress, onLike, currentUserId }) => {
  const [isLiking, setIsLiking] = useState(false);
  const isLiked = false; // TODO: 사용자의 좋아요 여부 추적 필요

  // 동영상 여부 확인
  const isVideo = item.videoUrl || item.image?.includes('video') || item.image?.includes('.mp4');

  // 이미지 소스 결정 (취미 이미지 우선 사용)
  let imageSource;
  if (isVideo) {
    // 동영상: videoThumbnail 사용, 없으면 placeholder
    if (item.videoThumbnail) {
      imageSource = { uri: item.videoThumbnail };
    } else {
      imageSource = require('../assets/icon.png');
    }
  } else {
    // 1순위: hobbyName으로 로컬 이미지 찾기
    if (item.hobbyName && hobbyImages[item.hobbyName]) {
      imageSource = hobbyImages[item.hobbyName];
      console.log('[갤러리 카드] 취미 이미지 사용:', item.hobbyName);
    }
    // 2순위: Base64 또는 URL 이미지
    else if (item.image && item.image.length > 0) {
      imageSource = { uri: item.image };
    }
    // 3순위: placeholder
    else {
      imageSource = require('../assets/icon.png');
    }
  }

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(item.id);
    setIsLiking(false);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* 작품 이미지/동영상 썸네일 */}
      <Image
        source={imageSource}
        style={styles.cardImage}
        resizeMode="cover"
        defaultSource={require('../assets/icon.png')}
        onError={(e) => console.error('[갤러리 카드] 이미지 로드 실패:', item.title, e.nativeEvent.error)}
      />

      {/* 동영상 표시 아이콘 */}
      {isVideo && (
        <View style={styles.videoIndicator}>
          <Feather name="play-circle" size={32} color="rgba(255,255,255,0.9)" />
        </View>
      )}

      {/* 그라데이션 오버레이 & 정보 */}
      <View style={styles.cardOverlay}>
        {/* 상단: 취미 카테고리 */}
        <View style={styles.cardTop}>
          <View style={styles.hobbyBadge}>
            <Text style={styles.hobbyBadgeText}>{item.hobbyName}</Text>
          </View>
        </View>

        {/* 하단: 작성자 정보 & 통계 */}
        <View style={styles.cardBottom}>
          <View style={styles.cardAuthor}>
            <Text style={styles.cardAuthorName} numberOfLines={1}>
              {item.userName}
            </Text>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Feather name="heart" size={14} color="#fff" />
              <Text style={styles.statText}>{item.likes || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="eye" size={14} color="#fff" />
              <Text style={styles.statText}>{item.views || 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 갤러리 메인 화면
export default function GalleryScreen() {
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 현재 사용자 정보 로드
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userStr = await SecureStore.getItemAsync('currentUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('[갤러리] 사용자 정보 로드 실패:', error);
      }
    };
    loadCurrentUser();
  }, []);

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      setError(null);
      console.log('[갤러리] 데이터 로딩 시작...');
      const items = await getAllGalleryItems();
      setGalleryItems(items);
      console.log(`[갤러리] ✅ ${items.length}개 작품 로드 완료`);
    } catch (e) {
      setError('갤러리를 불러오는데 실패했습니다.');
      console.error('[갤러리 에러]', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 화면 포커스 시 자동 새로고침
  useFocusEffect(
    useCallback(() => {
      console.log('[갤러리] 화면 포커스됨. 데이터 로딩.');
      loadData();
    }, [loadData])
  );

  // 좋아요 토글
  const handleLike = async (itemId) => {
    try {
      const result = await toggleGalleryLike(itemId);
      // 목록 업데이트
      setGalleryItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, likes: result.likes } : item
        )
      );
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  // 작품 상세 보기
  const handleItemPress = (item) => {
    router.push({
      pathname: '/gallery/[id]',
      params: { id: item.id }
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7A5C" />
        <Text style={styles.loadingText}>갤러리 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Feather name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>갤러리</Text>
        <Text style={styles.headerSubtitle}>
          {galleryItems.length}개의 작품
        </Text>
      </View>

      {/* 갤러리 그리드 */}
      <FlatList
        data={galleryItems}
        renderItem={({ item }) => (
          <GalleryCard
            item={item}
            onPress={() => handleItemPress(item)}
            onLike={handleLike}
            currentUserId={currentUserId}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            colors={['#FF7A5C']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="image" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>아직 업로드된 작품이 없습니다</Text>
            <Text style={styles.emptySubtext}>첫 번째 작품을 공유해보세요!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    flex: 1,
    aspectRatio: 0.75, // 3:4 ratio (portrait)
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardTop: {
    alignItems: 'flex-start',
  },
  hobbyBadge: {
    backgroundColor: 'rgba(255, 122, 92, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hobbyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  cardBottom: {
    gap: 8,
  },
  cardAuthor: {
    gap: 2,
  },
  cardAuthorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF7A5C',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
