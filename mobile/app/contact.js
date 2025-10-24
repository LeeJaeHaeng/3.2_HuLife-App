// mobile/app/contact.js
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_COLOR = '#FF7A5C';

export default function ContactScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    // Validation
    if (!form.name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      Alert.alert('알림', '올바른 이메일을 입력해주세요.');
      return;
    }
    if (!form.subject.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!form.message.trim()) {
      Alert.alert('알림', '메시지를 입력해주세요.');
      return;
    }

    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      Alert.alert(
        '전송 완료',
        '문의 메시지가 성공적으로 전송되었습니다.\n빠른 시일 내에 답변드리겠습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              setForm({ name: '', email: '', subject: '', message: '' });
            }
          }
        ]
      );
    }, 1500);
  };

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
        <Text style={styles.headerTitle}>문의하기</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>문의하기</Text>
          <Text style={styles.subtitle}>
            궁금하신 점이 있으시면 언제든 문의해주세요
          </Text>
        </View>

        {/* Contact Cards */}
        <View style={styles.contactCards}>
          <View style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: '#3b82f620' }]}>
              <Feather name="mail" size={32} color="#3b82f6" />
            </View>
            <Text style={styles.contactCardTitle}>이메일</Text>
            <Text style={styles.contactCardValue}>contact@hulife.com</Text>
          </View>

          <View style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: '#10b98120' }]}>
              <Feather name="phone" size={32} color="#10b981" />
            </View>
            <Text style={styles.contactCardTitle}>전화</Text>
            <Text style={styles.contactCardValue}>02-1234-5678</Text>
          </View>

          <View style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: '#f59e0b20' }]}>
              <Feather name="map-pin" size={32} color="#f59e0b" />
            </View>
            <Text style={styles.contactCardTitle}>주소</Text>
            <Text style={styles.contactCardValue}>서울 강남구 테헤란로 123</Text>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>문의 메시지 보내기</Text>
          <Text style={styles.formDescription}>
            아래 양식을 작성해주시면 빠른 시일 내에 답변드리겠습니다
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="홍길동"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholder="example@email.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              value={form.subject}
              onChangeText={(text) => setForm({ ...form, subject: text })}
              placeholder="문의 제목을 입력해주세요"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>메시지</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.message}
              onChangeText={(text) => setForm({ ...form, message: text })}
              placeholder="문의 내용을 상세히 작성해주세요"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, sending && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={sending}
          >
            {sending ? (
              <Text style={styles.submitButtonText}>전송 중...</Text>
            ) : (
              <Text style={styles.submitButtonText}>문의 보내기</Text>
            )}
          </TouchableOpacity>
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
  contactCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    marginBottom: 24,
    gap: 12,
  },
  contactCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactCardValue: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: BRAND_COLOR,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
