// mobile/app/about.js
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_COLOR = '#FF7A5C';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회사 소개</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>회사 소개</Text>
          <Text style={styles.subtitle}>
            은퇴 후 더 풍요로운 삶을 위한 휴라이프입니다
          </Text>
        </View>

        {/* Mission Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>우리의 미션</Text>
          <Text style={styles.cardText}>
            휴라이프는 은퇴 후 새로운 인생을 시작하는 분들이 자신에게 맞는 취미를 찾고,
            비슷한 관심사를 가진 사람들과 교류하며 즐거운 노후 생활을 누릴 수 있도록 돕습니다.
          </Text>
          <Text style={styles.cardText}>
            AI 기반 취미 추천 시스템과 지역 기반 커뮤니티 매칭을 통해
            12,000명 이상의 회원들이 새로운 취미 생활을 즐기고 있습니다.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderColor: '#3b82f6' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#3b82f620' }]}>
              <Feather name="users" size={40} color="#3b82f6" />
            </View>
            <Text style={styles.statNumber}>12,000+</Text>
            <Text style={styles.statLabel}>활동 회원</Text>
          </View>

          <View style={[styles.statCard, { borderColor: '#ec4899' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#ec489920' }]}>
              <Feather name="heart" size={40} color="#ec4899" />
            </View>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>활동 모임</Text>
          </View>

          <View style={[styles.statCard, { borderColor: '#10b981' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#10b98120' }]}>
              <Feather name="target" size={40} color="#10b981" />
            </View>
            <Text style={styles.statNumber}>123+</Text>
            <Text style={styles.statLabel}>취미 카테고리</Text>
          </View>

          <View style={[styles.statCard, { borderColor: '#f59e0b' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b20' }]}>
              <Feather name="award" size={40} color="#f59e0b" />
            </View>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>회원 만족도</Text>
          </View>
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>연락처</Text>
          <View style={styles.contactItem}>
            <Feather name="mail" size={20} color={BRAND_COLOR} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>이메일</Text>
              <Text style={styles.contactValue}>contact@hulife.com</Text>
            </View>
          </View>
          <View style={styles.contactItem}>
            <Feather name="map-pin" size={20} color={BRAND_COLOR} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>주소</Text>
              <Text style={styles.contactValue}>서울특별시 강남구 테헤란로 123</Text>
            </View>
          </View>
          <View style={styles.contactItem}>
            <Feather name="phone" size={20} color={BRAND_COLOR} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>전화</Text>
              <Text style={styles.contactValue}>02-1234-5678</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 26,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#6b7280',
  },
});
