import React, {useEffect, useState} from 'react';
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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Hobby} from '../types';
import {hobbyService} from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'HobbyList'>;

// Helper function to convert relative image URLs to absolute URLs
const getAbsoluteImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // If already absolute URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Convert relative URL to absolute URL using local development server
  const baseUrl = 'http://10.205.167.63:3000';
  return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
};

export default function HobbyListScreen({navigation}: Props) {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHobbies();
  }, []);

  const loadHobbies = async () => {
    try {
      const data = await hobbyService.getAll();
      console.log('✅ 취미 목록 로드 성공:', data.length, '개');
      setHobbies(data);
    } catch (error: any) {
      console.error('❌ Failed to load hobbies:', error);
      console.error('Error details:', error.message);
      console.error('Error response:', error.response?.data);

      let errorMessage = '취미 목록을 불러오는데 실패했습니다.';
      if (error.message === 'Network Error') {
        errorMessage = '네트워크 연결을 확인해주세요.\n서버와 연결할 수 없습니다.';
      } else if (error.response) {
        errorMessage = `서버 오류: ${error.response.status}`;
      }

      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHobbies();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A5C" />
        <Text style={styles.loadingText}>취미 목록을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF7A5C']} />}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>전체 취미</Text>
        <Text style={styles.headerSubtitle}>
          {hobbies.length}개의 다양한 취미를 만나보세요
        </Text>
      </View>

      {/* Hobbies Grid */}
      {hobbies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 등록된 취미가 없습니다.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {hobbies.map(hobby => (
            <TouchableOpacity
              key={hobby.id}
              style={styles.card}
              onPress={() => navigation.navigate('HobbyDetail', {hobbyId: hobby.id})}
              activeOpacity={0.7}>
              {/* Hobby Image */}
              <Image
                source={{uri: getAbsoluteImageUrl(hobby.imageUrl)}}
                style={styles.hobbyImage}
                resizeMode="cover"
              />

              {/* Content */}
              <View style={styles.cardContent}>
                {/* Category Badge */}
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{hobby.category}</Text>
                </View>

                {/* Hobby Name */}
                <Text style={styles.hobbyName} numberOfLines={1}>
                  {hobby.name}
                </Text>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>
                  {hobby.description}
                </Text>

                {/* Info Row */}
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>
                      {hobby.indoorOutdoor === 'indoor' ? '🏠' : hobby.indoorOutdoor === 'outdoor' ? '🌳' : '🏠🌳'}
                    </Text>
                    <Text style={styles.infoText}>
                      {hobby.indoorOutdoor === 'indoor' ? '실내' : hobby.indoorOutdoor === 'outdoor' ? '실외' : '실내/외'}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>
                      {hobby.socialIndividual === 'social' ? '👥' : hobby.socialIndividual === 'individual' ? '👤' : '👥👤'}
                    </Text>
                    <Text style={styles.infoText}>
                      {hobby.socialIndividual === 'social' ? '단체' : hobby.socialIndividual === 'individual' ? '개인' : '단체/개인'}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>💰</Text>
                    <Text style={styles.infoText}>
                      {hobby.budget === 'low' ? '저렴' : hobby.budget === 'medium' ? '보통' : '높음'}
                    </Text>
                  </View>
                </View>

                {/* Difficulty Stars */}
                <View style={styles.difficultyRow}>
                  <Text style={styles.difficultyLabel}>난이도:</Text>
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Text key={star} style={styles.star}>
                        {star <= hobby.difficulty ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{height: 20}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  hobbyImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },
  cardContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFF4F2',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF7A5C',
  },
  hobbyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
});
