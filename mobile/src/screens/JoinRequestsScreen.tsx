import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {joinRequestService} from '../services/api';
import {JoinRequest} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinRequests'>;

export default function JoinRequestsScreen({route, navigation}: Props) {
  const {communityId} = route.params;
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const fetchedRequests = await joinRequestService.getPendingRequests(communityId);
      setRequests(fetchedRequests);
    } catch (error: any) {
      console.error('가입 신청 목록 로드 실패:', error);
      Alert.alert('오류', error.response?.data?.error || '가입 신청 목록을 불러올 수 없습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (requestId: string) => {
    Alert.alert(
      '가입 승인',
      '이 신청을 승인하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '승인',
          onPress: async () => {
            setProcessingId(requestId);
            try {
              const result = await joinRequestService.approve(requestId);
              Alert.alert('성공', result.message || '가입이 승인되었습니다.');
              // 승인된 신청을 목록에서 제거
              setRequests(prev => prev.filter(req => req.id !== requestId));
            } catch (error: any) {
              Alert.alert('오류', error.response?.data?.error || '승인에 실패했습니다.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  };

  const handleReject = (requestId: string) => {
    Alert.alert(
      '가입 거절',
      '이 신청을 거절하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '거절',
          style: 'destructive',
          onPress: async () => {
            setProcessingId(requestId);
            try {
              const result = await joinRequestService.reject(requestId);
              Alert.alert('성공', result.message || '가입이 거절되었습니다.');
              // 거절된 신청을 목록에서 제거
              setRequests(prev => prev.filter(req => req.id !== requestId));
            } catch (error: any) {
              Alert.alert('오류', error.response?.data?.error || '거절에 실패했습니다.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderRequest = ({item}: {item: JoinRequest}) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.user.name[0]}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.userDetails}>
            {item.user.age}세 • {item.user.location}
          </Text>
          <Text style={styles.requestDate}>
            신청일: {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleReject(item.id)}
          disabled={processingId === item.id}>
          {processingId === item.id ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <>
              <Text style={styles.rejectIcon}>❌</Text>
              <Text style={styles.rejectButtonText}>거절</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleApprove(item.id)}
          disabled={processingId === item.id}>
          {processingId === item.id ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.approveIcon}>✅</Text>
              <Text style={styles.approveButtonText}>승인</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A5C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={renderRequest}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>현재 가입 신청이 없습니다</Text>
          </View>
        }
      />
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
  list: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  approveIcon: {
    fontSize: 18,
  },
  rejectIcon: {
    fontSize: 18,
  },
  approveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
