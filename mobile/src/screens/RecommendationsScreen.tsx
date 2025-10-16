import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {HobbyRecommendation} from '../types';
import {surveyService, hobbyService} from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Recommendations'>;

export default function RecommendationsScreen({navigation}: Props) {
  const [recommendations, setRecommendations] = useState<HobbyRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addedHobbies, setAddedHobbies] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecommendations();
    loadUserHobbies();
  }, []);

  const loadRecommendations = async () => {
    try {
      const result = await surveyService.getRecommendations();

      if (result.recommendations.length === 0) {
        Alert.alert('알림', '설문을 먼저 완료해주세요.', [
          {
            text: '설문하러 가기',
            onPress: () => navigation.replace('Survey'),
          },
        ]);
        return;
      }

      setRecommendations(result.recommendations);
    } catch (error: any) {
      Alert.alert('오류', '추천 결과를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUserHobbies = async () => {
    try {
      const userHobbies = await hobbyService.getUserHobbies();
      const hobbyIds = new Set(userHobbies.map(h => h.id));
      setAddedHobbies(hobbyIds);
    } catch (error) {
      console.error('Failed to load user hobbies:', error);
    }
  };

  const handleToggleHobby = async (hobbyId: string) => {
    const isAdded = addedHobbies.has(hobbyId);

    try {
      if (isAdded) {
        await hobbyService.removeFromUserHobbies(hobbyId);
        setAddedHobbies(prev => {
          const next = new Set(prev);
          next.delete(hobbyId);
          return next;
        });
        Alert.alert('알림', '관심 취미에서 제거되었습니다.');
      } else {
        await hobbyService.addToUserHobbies(hobbyId);
        setAddedHobbies(prev => new Set(prev).add(hobbyId));
        Alert.alert('알림', '관심 취미에 추가되었습니다!');
      }
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.error || '작업에 실패했습니다.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecommendations();
    loadUserHobbies();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A5C" />
        <Text style={styles.loadingText}>추천 결과를 생성하고 있습니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF7A5C']} />}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>당신을 위한 맞춤 취미</Text>
          <Text style={styles.headerSubtitle}>
            설문 결과를 바탕으로 가장 적합한 취미를 추천해드립니다
          </Text>
        </View>

        {/* Recommendations List */}
        {recommendations.map((hobby, index) => {
          const isAdded = addedHobbies.has(hobby.id);
          return (
            <View key={hobby.id} style={styles.card}>
              {/* Best Recommendation Badge */}
              {index === 0 && (
                <View style={styles.bestBadge}>
                  <Text style={styles.bestBadgeText}>✨ 최고 추천</Text>
                </View>
              )}

              {/* Hobby Image */}
              <Image
                source={{uri: hobby.imageUrl || 'https://via.placeholder.com/400x200'}}
                style={styles.hobbyImage}
                resizeMode="cover"
              />

              {/* Content */}
              <View style={styles.cardContent}>
                {/* Title and Category */}
                <View style={styles.titleRow}>
                  <Text style={styles.hobbyName}>{hobby.name}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{hobby.category}</Text>
                  </View>
                </View>

                {/* Match Score */}
                <View style={styles.matchScoreContainer}>
                  <View style={styles.matchDot} />
                  <Text style={styles.matchScoreText}>매칭도 {hobby.matchScore}%</Text>
                </View>

                {/* Description */}
                <Text style={styles.description} numberOfLines={3}>
                  {hobby.description}
                </Text>

                {/* Reasons */}
                <View style={styles.reasonsContainer}>
                  <Text style={styles.reasonsTitle}>추천 이유:</Text>
                  {hobby.reasons.map((reason, idx) => (
                    <View key={idx} style={styles.reasonItem}>
                      <Text style={styles.reasonBullet}>•</Text>
                      <Text style={styles.reasonText}>{reason}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => navigation.navigate('HobbyDetail', {hobbyId: hobby.id})}>
                    <Text style={styles.detailButtonText}>자세히 보기</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.addButton, isAdded && styles.addButtonActive]}
                    onPress={() => handleToggleHobby(hobby.id)}>
                    <Text style={[styles.addButtonIcon, isAdded && styles.addButtonIconActive]}>
                      {isAdded ? '❤️' : '🤍'}
                    </Text>
                    <Text style={[styles.addButtonText, isAdded && styles.addButtonTextActive]}>
                      {isAdded ? '추가됨' : '관심 추가'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>마음에 드는 취미를 찾지 못하셨나요?</Text>
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => navigation.replace('Survey')}>
              <Text style={styles.footerButtonText}>설문 다시하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => navigation.navigate('Hobbies')}>
              <Text style={styles.footerButtonText}>모든 취미 둘러보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bestBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  bestBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  hobbyImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },
  cardContent: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hobbyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  matchScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7A5C',
    marginRight: 8,
  },
  matchScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF7A5C',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  reasonsContainer: {
    marginBottom: 20,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  reasonBullet: {
    fontSize: 14,
    color: '#FF7A5C',
    marginRight: 8,
    marginTop: 2,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  detailButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FF7A5C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  addButtonActive: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  addButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  addButtonIconActive: {
    // No changes needed
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  addButtonTextActive: {
    color: '#EF4444',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  footerButtons: {
    gap: 12,
    width: '100%',
  },
  footerButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
