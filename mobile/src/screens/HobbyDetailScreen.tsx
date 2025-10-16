import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Hobby} from '../types';
import {hobbyService} from '../services/api';
import YoutubePlayer from 'react-native-youtube-iframe';

type Props = NativeStackScreenProps<RootStackParamList, 'HobbyDetail'>;

const {width} = Dimensions.get('window');

// 유튜브 URL에서 비디오 ID 추출
const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// 이미지 URL을 절대 경로로 변환
const getAbsoluteImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (imageUrl.startsWith('http')) return imageUrl;
  // 상대 경로인 경우 서버 기본 URL 추가
  return `http://10.205.167.63:3000${imageUrl}`;
};

// 난이도 레벨을 별점으로 변환
const getDifficultyStars = (difficulty: number): string => {
  return '⭐'.repeat(difficulty);
};

// 예산 레벨을 한글로 변환
const getBudgetLabel = (budget: string): string => {
  const budgetMap: {[key: string]: string} = {
    low: '💰 낮음',
    medium: '💰💰 보통',
    high: '💰💰💰 높음',
  };
  return budgetMap[budget] || budget;
};

// 실내/실외 라벨
const getLocationLabel = (indoorOutdoor: string): string => {
  const locationMap: {[key: string]: string} = {
    indoor: '🏠 실내',
    outdoor: '🌳 실외',
    both: '🏠🌳 실내/실외',
  };
  return locationMap[indoorOutdoor] || indoorOutdoor;
};

// 개인/단체 라벨
const getSocialLabel = (socialIndividual: string): string => {
  const socialMap: {[key: string]: string} = {
    individual: '👤 개인',
    social: '👥 단체',
    both: '👤👥 개인/단체',
  };
  return socialMap[socialIndividual] || socialIndividual;
};

export default function HobbyDetailScreen({route, navigation}: Props) {
  const {hobbyId} = route.params;
  const [hobby, setHobby] = useState<Hobby | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHobbyDetail();
  }, [hobbyId]);

  const loadHobbyDetail = async () => {
    try {
      setLoading(true);
      const data = await hobbyService.getById(hobbyId);
      console.log('✅ 취미 상세 로드 성공:', data.name);
      setHobby(data);
    } catch (error: any) {
      console.error('❌ Failed to load hobby detail:', error);
      Alert.alert('오류', '취미 상세 정보를 불러오는데 실패했습니다.', [
        {text: '확인', onPress: () => navigation.goBack()},
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A5C" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (!hobby) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>취미 정보를 찾을 수 없습니다.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const youtubeId = hobby.videoUrl ? extractYoutubeId(hobby.videoUrl) : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 대표 이미지 */}
      <Image
        source={{uri: getAbsoluteImageUrl(hobby.imageUrl)}}
        style={styles.heroImage}
        resizeMode="cover"
      />

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 카테고리 배지 */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{hobby.category}</Text>
        </View>

        {/* 취미 제목 */}
        <Text style={styles.title}>{hobby.name}</Text>

        {/* 상세 정보 태그 */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {getDifficultyStars(hobby.difficulty)} 난이도
            </Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{getBudgetLabel(hobby.budget)}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {getLocationLabel(hobby.indoorOutdoor)}
            </Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {getSocialLabel(hobby.socialIndividual)}
            </Text>
          </View>
        </View>

        {/* 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 소개</Text>
          <Text style={styles.description}>{hobby.description}</Text>
        </View>

        {/* 유튜브 동영상 */}
        {youtubeId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎬 소개 영상</Text>
            <View style={styles.videoContainer}>
              <YoutubePlayer
                height={220}
                videoId={youtubeId}
                play={false}
                webViewStyle={styles.youtubePlayer}
              />
            </View>
          </View>
        )}

        {/* 혜택 */}
        {hobby.benefits && hobby.benefits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ 혜택</Text>
            <View style={styles.listContainer}>
              {hobby.benefits.map((benefit, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 준비물 */}
        {hobby.requirements && hobby.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎒 준비물</Text>
            <View style={styles.listContainer}>
              {hobby.requirements.map((requirement, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{requirement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 커리큘럼 */}
        {hobby.curriculum && hobby.curriculum.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 커리큘럼</Text>
            {hobby.curriculum.map((item, index) => (
              <View key={index} style={styles.curriculumItem}>
                <View style={styles.curriculumHeader}>
                  <Text style={styles.weekNumber}>Week {item.week}</Text>
                  <Text style={styles.curriculumTitle}>{item.title}</Text>
                </View>
                <Text style={styles.curriculumContent}>{item.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 하단 여백 */}
        <View style={styles.bottomSpacing} />
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF7A5C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  heroImage: {
    width: width,
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF4F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7A5C',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 36,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    color: '#4B5563',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
  },
  videoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  youtubePlayer: {
    borderRadius: 12,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#FF7A5C',
    marginRight: 8,
    lineHeight: 24,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
  },
  curriculumItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF7A5C',
  },
  curriculumHeader: {
    marginBottom: 8,
  },
  weekNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF7A5C',
    marginBottom: 4,
  },
  curriculumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  curriculumContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 40,
  },
});
