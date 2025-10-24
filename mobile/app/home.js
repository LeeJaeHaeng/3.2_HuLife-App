// mobile/app/home.js
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { getAllCommunitiesAPI } from '../api/communityService';

const { width } = Dimensions.get('window');
const BRAND_COLOR = '#FF7A5C';

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featuredCommunities, setFeaturedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    loadFeaturedCommunities();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const loadFeaturedCommunities = async () => {
    try {
      const communities = await getAllCommunitiesAPI();
      setFeaturedCommunities(communities.slice(0, 3));
    } catch (error) {
      console.error('Featured communities error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>HuLife</Text>
            <Text style={styles.logoSub}>휴라이프</Text>
          </View>
          <View style={styles.headerRight}>
            {!isLoggedIn ? (
              <>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => router.push('/login')}
                >
                  <Text style={styles.headerButtonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.headerButton, styles.headerButtonPrimary]}
                  onPress={() => router.push('/signup')}
                >
                  <Text style={styles.headerButtonTextPrimary}>시작하기</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.headerButton, styles.headerButtonPrimary]}
                onPress={() => router.push('/dashboard')}
              >
                <Text style={styles.headerButtonTextPrimary}>대시보드</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>은퇴 후,{'\n'}새로운 삶을 시작하세요</Text>
          <Text style={styles.heroSubtitle}>
            당신에게 맞는 취미를 찾고,{'\n'}
            같은 관심사를 가진 사람들과 함께하세요
          </Text>
          <TouchableOpacity
            style={styles.heroCTA}
            onPress={() => router.push('/survey')}
          >
            <Text style={styles.heroCTAText}>무료로 시작하기</Text>
            <Feather name="arrow-right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Hobby Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인기 취미 카테고리</Text>
          <View style={styles.categoryGrid}>
            {[
              { name: '운동/스포츠', icon: 'activity', color: '#3b82f6' },
              { name: '예술/창작', icon: 'aperture', color: '#8b5cf6' },
              { name: '요리/베이킹', icon: 'coffee', color: '#f97316' },
              { name: '음악', icon: 'music', color: '#ec4899' },
              { name: '공예', icon: 'scissors', color: '#10b981' },
              { name: '자연/야외', icon: 'sun', color: '#eab308' },
            ].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryCard, { borderColor: category.color }]}
                onPress={() => router.push('/hobbies')}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Feather name={category.icon} size={28} color={category.color} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Groups */}
        {!loading && featuredCommunities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>추천 모임</Text>
              <TouchableOpacity onPress={() => router.push('/community')}>
                <Text style={styles.sectionLink}>전체보기</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredCommunities.map((community) => (
                <TouchableOpacity
                  key={community.id}
                  style={styles.communityCard}
                  onPress={() => router.push(`/community/${community.id}`)}
                >
                  <Image
                    source={{ uri: community.imageUrl || 'https://via.placeholder.com/300' }}
                    style={styles.communityImage}
                  />
                  <View style={styles.communityInfo}>
                    <Text style={styles.communityName} numberOfLines={1}>
                      {community.name}
                    </Text>
                    <Text style={styles.communityLocation} numberOfLines={1}>
                      <Feather name="map-pin" size={14} color="#666" /> {community.location}
                    </Text>
                    <Text style={styles.communityMembers}>
                      <Feather name="users" size={14} color="#666" /> {community.memberCount}명
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이용 방법</Text>
          <View style={styles.stepsContainer}>
            {[
              {
                step: '1',
                title: '간단한 설문조사',
                desc: '나에게 맞는 취미를 찾기 위한\n간단한 질문에 답변해보세요',
                icon: 'edit-3',
              },
              {
                step: '2',
                title: 'AI 맞춤 추천',
                desc: 'AI가 분석한 당신에게\n딱 맞는 취미를 추천해드려요',
                icon: 'cpu',
              },
              {
                step: '3',
                title: '모임 참여',
                desc: '관심사가 같은 사람들과\n함께 취미를 즐겨보세요',
                icon: 'users',
              },
            ].map((item, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepIcon}>
                  <Feather name={item.icon} size={32} color={BRAND_COLOR} />
                </View>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{item.step}</Text>
                </View>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonials */}
        <View style={[styles.section, styles.testimonialsSection]}>
          <Text style={[styles.sectionTitle, styles.testimonialsTitle]}>
            회원님들의 이야기
          </Text>
          {[
            {
              name: '김영수',
              age: 65,
              hobby: '요가',
              text: '은퇴 후 건강이 걱정되었는데, 요가 모임을 통해 건강도 챙기고 새로운 친구들도 만났어요.',
            },
            {
              name: '이순희',
              age: 62,
              hobby: '수채화',
              text: '평생 하고 싶었던 그림을 이제야 시작했어요. 같은 관심사를 가진 분들과 함께라 더 즐겁습니다.',
            },
            {
              name: '박민수',
              age: 68,
              hobby: '등산',
              text: '매주 등산 모임에 참여하면서 체력도 좋아지고 삶의 활력을 찾았습니다.',
            },
          ].map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialAvatarText}>
                  {testimonial.name.charAt(0)}
                </Text>
              </View>
              <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              <View style={styles.testimonialFooter}>
                <Text style={styles.testimonialName}>
                  {testimonial.name} ({testimonial.age}세)
                </Text>
                <Text style={styles.testimonialHobby}>{testimonial.hobby}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>지금 바로 시작하세요</Text>
          <Text style={styles.ctaSubtitle}>
            12,000명 이상의 회원들이 함께하고 있습니다
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/survey')}
          >
            <Text style={styles.ctaButtonText}>무료로 시작하기</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.footerLink}>회사 소개</Text>
            </TouchableOpacity>
            <Text style={styles.footerDivider}>|</Text>
            <TouchableOpacity onPress={() => router.push('/faq')}>
              <Text style={styles.footerLink}>FAQ</Text>
            </TouchableOpacity>
            <Text style={styles.footerDivider}>|</Text>
            <TouchableOpacity onPress={() => router.push('/contact')}>
              <Text style={styles.footerLink}>문의하기</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerCopyright}>
            © 2025 HuLife. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND_COLOR,
  },
  logoSub: {
    fontSize: 16,
    color: '#6b7280',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonPrimary: {
    backgroundColor: BRAND_COLOR,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  headerButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  heroCTAText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  sectionLink: {
    fontSize: 14,
    color: BRAND_COLOR,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 64) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  communityCard: {
    width: 240,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  communityImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  communityInfo: {
    padding: 12,
    gap: 4,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  communityLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  communityMembers: {
    fontSize: 14,
    color: '#6b7280',
  },
  stepsContainer: {
    gap: 24,
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    position: 'relative',
  },
  stepIcon: {
    marginBottom: 16,
  },
  stepNumber: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND_COLOR + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_COLOR,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  testimonialsSection: {
    backgroundColor: '#f9fafb',
  },
  testimonialsTitle: {
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  testimonialAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  testimonialText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  testimonialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  testimonialHobby: {
    fontSize: 14,
    color: BRAND_COLOR,
    fontWeight: '600',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_COLOR,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: '#9ca3af',
  },
  footerDivider: {
    fontSize: 14,
    color: '#9ca3af',
    marginHorizontal: 12,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#6b7280',
  },
});
