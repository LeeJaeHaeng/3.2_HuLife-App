import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export default function AboutScreen({navigation}: Props) {
  const stats = [
    {icon: '👥', value: '12,000+', label: '활동 회원'},
    {icon: '❤️', value: '500+', label: '활동 모임'},
    {icon: '🎯', value: '123+', label: '취미 카테고리'},
    {icon: '🏆', value: '95%', label: '회원 만족도'},
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>회사 소개</Text>
        <Text style={styles.subtitle}>
          은퇴 후 더 풍요로운 삶을 위한 휴라이프입니다
        </Text>
      </View>

      {/* 미션 카드 */}
      <View style={styles.missionCard}>
        <Text style={styles.missionTitle}>우리의 미션</Text>
        <Text style={styles.missionText}>
          휴라이프는 은퇴 후 새로운 인생을 시작하는 분들이 자신에게 맞는 취미를
          찾고, 비슷한 관심사를 가진 사람들과 교류하며 즐거운 노후 생활을 누릴
          수 있도록 돕습니다.
        </Text>
        <Text style={styles.missionText}>
          AI 기반 취미 추천 시스템과 지역 기반 커뮤니티 매칭을 통해 12,000명
          이상의 회원들이 새로운 취미 생활을 즐기고 있습니다.
        </Text>
      </View>

      {/* 통계 그리드 */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* 연락처 카드 */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>연락처</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>이메일:</Text>
          <Text style={styles.contactValue}>contact@hulife.com</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>주소:</Text>
          <Text style={styles.contactValue}>
            서울특별시 강남구 테헤란로 123
          </Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>전화:</Text>
          <Text style={styles.contactValue}>02-1234-5678</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactRow: {
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    color: '#6B7280',
  },
});
