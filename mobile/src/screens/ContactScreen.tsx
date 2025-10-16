import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Contact'>;

export default function ContactScreen({navigation}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // 입력값 검증
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('알림', '메시지를 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 실제 API 호출 시:
    // api.post('/contact', { name, email, subject, message })
    //   .then(() => {
    //     Alert.alert('성공', '문의가 성공적으로 전송되었습니다.');
    //     // 폼 초기화
    //     setName('');
    //     setEmail('');
    //     setSubject('');
    //     setMessage('');
    //   })
    //   .catch((error) => {
    //     Alert.alert('오류', '문의 전송에 실패했습니다.');
    //   });

    // 목업: 성공 알림
    Alert.alert(
      '문의 전송 완료',
      '문의가 성공적으로 전송되었습니다.\n빠른 시일 내에 답변드리겠습니다.',
      [
        {
          text: '확인',
          onPress: () => {
            // 폼 초기화
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>문의하기</Text>
        <Text style={styles.subtitle}>
          궁금하신 점이 있으시면 언제든 문의해주세요
        </Text>
      </View>

      {/* 연락처 정보 카드 */}
      <View style={styles.contactCardsContainer}>
        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={styles.contactCardTitle}>이메일</Text>
          <Text style={styles.contactCardValue}>contact@hulife.com</Text>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactCardTitle}>전화</Text>
          <Text style={styles.contactCardValue}>02-1234-5678</Text>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📍</Text>
          <Text style={styles.contactCardTitle}>주소</Text>
          <Text style={styles.contactCardValue}>서울 강남구 테헤란로 123</Text>
        </View>
      </View>

      {/* 문의 폼 */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>문의 메시지 보내기</Text>
        <Text style={styles.formDescription}>
          아래 양식을 작성해주시면 빠른 시일 내에 답변드리겠습니다
        </Text>

        {/* 이름 & 이메일 */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formFieldHalf}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* 제목 */}
        <View style={styles.formField}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            placeholder="문의 제목을 입력해주세요"
            placeholderTextColor="#9CA3AF"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* 메시지 */}
        <View style={styles.formField}>
          <Text style={styles.label}>메시지</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="문의 내용을 상세히 작성해주세요"
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* 제출 버튼 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>문의 보내기</Text>
        </TouchableOpacity>
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
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  contactCardsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  contactCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactCardValue: {
    fontSize: 15,
    color: '#6B7280',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formFieldHalf: {
    flex: 1,
    marginRight: 8,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#FF7A5C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
