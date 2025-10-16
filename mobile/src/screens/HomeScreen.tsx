import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import Logo from '../components/Logo';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function HomeScreen({navigation}: Props) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Login/Register */}
      <View style={styles.header}>
        {/* Brand Logo */}
        <Logo size="large" showSubtext={true} />
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.headerButtonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButtonPrimary}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.headerButtonPrimaryText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.heroSection}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>✨</Text>
          <Text style={styles.badgeText}>은퇴 후 새로운 인생을 시작하세요</Text>
        </View>

        <Text style={styles.heroTitle}>
          당신만을 위한{'\n'}
          <Text style={styles.heroTitleAccent}>맞춤 취미</Text>를{'\n'}
          찾아드립니다
        </Text>

        <Text style={styles.heroSubtitle}>
          AI 기반 취미 추천부터 지역 모임 가입까지,{'\n'}
          휴라이프가 당신의 행복한 노후를 함께합니다.
        </Text>

        <View style={styles.ctaButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Survey')}>
            <Text style={styles.primaryButtonText}>취미 추천받기 →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('HobbyList')}>
            <Text style={styles.secondaryButtonText}>둘러보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12,000+</Text>
            <Text style={styles.statLabel}>활동 회원</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>활동 모임</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>취미 카테고리</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>이용 방법</Text>
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
            <Text style={styles.stepTitle}>설문 응답</Text>
            <Text style={styles.stepDesc}>간단한 질문에 답하고{'\n'}맞춤 취미를 추천받으세요</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
            <Text style={styles.stepTitle}>취미 탐색</Text>
            <Text style={styles.stepDesc}>다양한 취미를 둘러보고{'\n'}관심있는 활동을 찾아보세요</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
            <Text style={styles.stepTitle}>모임 참여</Text>
            <Text style={styles.stepDesc}>지역 모임에 가입하고{'\n'}새로운 친구를 만나세요</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>바로가기</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('HobbyList')}>
            <Text style={styles.quickIcon}>🎨</Text>
            <Text style={styles.quickText}>전체 취미</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('CommunityList')}>
            <Text style={styles.quickIcon}>👥</Text>
            <Text style={styles.quickText}>모임 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.quickIcon}>📊</Text>
            <Text style={styles.quickText}>대시보드</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('About')}>
            <Text style={styles.quickIcon}>ℹ️</Text>
            <Text style={styles.quickText}>회사 소개</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('FAQ')}>
            <Text style={styles.quickIcon}>❓</Text>
            <Text style={styles.quickText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.quickIcon}>📧</Text>
            <Text style={styles.quickText}>문의하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  headerButtonPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FF7A5C',
  },
  headerButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroSection: {backgroundColor: '#FFF5F0', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 48},
  badge: {flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,122,92,0.1)', borderWidth: 1, borderColor: 'rgba(255,122,92,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 24},
  badgeIcon: {fontSize: 16, marginRight: 6},
  badgeText: {fontSize: 13, fontWeight: '600', color: '#FF7A5C'},
  heroTitle: {fontSize: 40, fontWeight: 'bold', color: '#1F2937', lineHeight: 52, marginBottom: 20},
  heroTitleAccent: {color: '#FF7A5C'},
  heroSubtitle: {fontSize: 17, color: '#6B7280', lineHeight: 26, marginBottom: 32},
  ctaButtons: {gap: 12, marginBottom: 40},
  primaryButton: {backgroundColor: '#FF7A5C', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  primaryButtonText: {fontSize: 18, fontWeight: 'bold', color: '#FFFFFF'},
  secondaryButton: {backgroundColor: 'transparent', height: 56, borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center'},
  secondaryButtonText: {fontSize: 18, fontWeight: 'bold', color: '#1F2937'},
  stats: {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 16},
  statItem: {alignItems: 'center'},
  statNumber: {fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 4},
  statLabel: {fontSize: 14, color: '#6B7280'},
  divider: {width: 1, height: 48, backgroundColor: '#E5E7EB'},
  section: {paddingHorizontal: 24, paddingVertical: 32},
  sectionTitle: {fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 24, textAlign: 'center'},
  steps: {gap: 24},
  step: {alignItems: 'center'},
  stepNumber: {width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF7A5C', justifyContent: 'center', alignItems: 'center', marginBottom: 16},
  stepNumberText: {fontSize: 24, fontWeight: 'bold', color: '#FFFFFF'},
  stepTitle: {fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8},
  stepDesc: {fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22},
  quickActions: {flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12},
  quickButton: {alignItems: 'center', padding: 20, backgroundColor: '#F9FAFB', borderRadius: 16, width: 100},
  quickIcon: {fontSize: 36, marginBottom: 8},
  quickText: {fontSize: 14, fontWeight: '600', color: '#374151'},
});
