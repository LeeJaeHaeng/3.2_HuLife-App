import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {communityService, joinRequestService} from '../services/api';
import {Community, MembershipStatus} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityDetail'>;

export default function CommunityDetailScreen({route, navigation}: Props) {
  const {communityId} = route.params;
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>('not-member');
  const [isLeader, setIsLeader] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      // 모임 정보 로드
      const fetchedCommunity = await communityService.getById(communityId);
      setCommunity(fetchedCommunity);

      // 멤버십 상태 확인
      try {
        const status = await joinRequestService.getMembershipStatus(communityId);
        setMembershipStatus(status.status);
        setIsLeader(status.isLeader);

        // 리더인 경우 대기 중인 가입 신청 수 조회
        if (status.isLeader) {
          const requests = await joinRequestService.getPendingRequests(communityId);
          setPendingRequestsCount(requests.length);
        }
      } catch (error) {
        console.log('멤버십 상태 확인 실패 (비로그인 상태일 수 있음)');
      }
    } catch (error) {
      console.error('모임 정보 로드 실패:', error);
      Alert.alert('오류', '모임 정보를 불러올 수 없습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    Alert.alert(
      '가입 신청',
      '이 모임에 가입 신청하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '신청',
          onPress: async () => {
            setActionLoading(true);
            try {
              const result = await joinRequestService.requestJoin(communityId);
              Alert.alert('성공', result.message || '가입 신청이 완료되었습니다.');
              setMembershipStatus('pending');
            } catch (error: any) {
              Alert.alert('오류', error.response?.data?.error || '가입 신청에 실패했습니다.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleLeave = async () => {
    Alert.alert(
      '모임 탈퇴',
      '정말 이 모임에서 탈퇴하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await joinRequestService.leave(communityId);
              Alert.alert('성공', '모임에서 탈퇴되었습니다.', [
                {text: '확인', onPress: () => navigation.goBack()},
              ]);
            } catch (error: any) {
              Alert.alert('오류', error.response?.data?.error || '탈퇴에 실패했습니다.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const renderActionButton = () => {
    if (actionLoading) {
      return (
        <View style={[styles.actionButton, styles.actionButtonDisabled]}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      );
    }

    switch (membershipStatus) {
      case 'not-member':
        return (
          <TouchableOpacity style={styles.actionButton} onPress={handleJoinRequest}>
            <Text style={styles.actionButtonText}>가입 신청</Text>
          </TouchableOpacity>
        );
      case 'pending':
        return (
          <View style={[styles.actionButton, styles.actionButtonDisabled]}>
            <Text style={styles.actionButtonText}>신청 대기 중</Text>
          </View>
        );
      case 'member':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.leaveButton]} onPress={handleLeave}>
            <Text style={styles.leaveButtonText}>모임 탈퇴</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A5C" />
      </View>
    );
  }

  if (!community) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>모임을 찾을 수 없습니다</Text>
      </View>
    );
  }

  const isFull = community.memberCount >= community.maxMembers;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 모임 이미지 */}
        <Image source={{uri: community.imageUrl}} style={styles.image} />

        {/* 모임 정보 */}
        <View style={styles.content}>
          <Text style={styles.name}>{community.name}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{community.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>{community.schedule}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👥</Text>
            <Text style={[styles.infoText, isFull && styles.fullText]}>
              {community.memberCount} / {community.maxMembers}명
              {isFull && ' (정원 마감)'}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>모임 소개</Text>
          <Text style={styles.description}>{community.description}</Text>

          {/* 멤버 전용 메뉴 */}
          {membershipStatus === 'member' && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>모임 활동</Text>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('CommunityChat', {communityId})}>
                <Text style={styles.menuIcon}>💬</Text>
                <Text style={styles.menuText}>모임 채팅</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('CommunityPostList')}>
                <Text style={styles.menuIcon}>📰</Text>
                <Text style={styles.menuText}>게시판</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 리더 전용 메뉴 */}
          {isLeader && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>모임 관리</Text>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('JoinRequests', {communityId})}>
                <Text style={styles.menuIcon}>📬</Text>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>가입 신청 관리</Text>
                  {pendingRequestsCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{pendingRequestsCount}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* 액션 버튼 */}
      <View style={styles.footer}>{renderActionButton()}</View>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
  },
  fullText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 24,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuArrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#FF7A5C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  leaveButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});
