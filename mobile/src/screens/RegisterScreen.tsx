import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {authService} from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

// 한국 지역 목록
const REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

export default function RegisterScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name || !age || !location) {
      Alert.alert('오류', '모든 필수 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('오류', '올바른 나이를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({
        email,
        password,
        name,
        age: ageNum,
        location,
      });
      Alert.alert('성공', '회원가입이 완료되었습니다!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('회원가입 실패', '다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* 지역 선택 모달 */}
      <Modal
        visible={showRegionPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRegionPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>지역 선택</Text>
              <TouchableOpacity onPress={() => setShowRegionPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.regionList}>
              {REGIONS.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={[
                    styles.regionItem,
                    location === region && styles.regionItemSelected,
                  ]}
                  onPress={() => {
                    setLocation(region);
                    setShowRegionPicker(false);
                  }}>
                  <Text
                    style={[
                      styles.regionText,
                      location === region && styles.regionTextSelected,
                    ]}>
                    {region}
                  </Text>
                  {location === region && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>HuLife에 오신 것을 환영합니다</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="이메일 *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="이름 *"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="나이 *"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowRegionPicker(true)}>
              <Text style={[styles.inputText, !location && styles.placeholder]}>
                {location || '지역 선택 *'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인 *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}>
              <Text style={styles.registerButtonText}>
                {isLoading ? '가입 중...' : '가입하기'}
              </Text>
            </TouchableOpacity>

            {/* 구분선 */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 소셜 회원가입 버튼들 */}
            <View style={styles.socialButtons}>
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.kakaoButton]}
                  onPress={() =>
                    Alert.alert('준비중', '카카오 간편 가입은 준비중입니다.')
                  }>
                  <Text style={styles.kakaoIcon}>💬</Text>
                  <Text style={styles.kakaoText}>카카오</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.naverButton]}
                  onPress={() =>
                    Alert.alert('준비중', '네이버 간편 가입은 준비중입니다.')
                  }>
                  <Text style={styles.naverIcon}>N</Text>
                  <Text style={styles.naverText}>네이버</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() =>
                  Alert.alert('준비중', '구글 간편 가입은 준비중입니다.')
                }>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleText}>구글</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.loginButtonText}>
                이미 계정이 있으신가요? 로그인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  input: {
    height: 56,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalClose: {
    fontSize: 24,
    color: '#6B7280',
  },
  regionList: {
    maxHeight: 400,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  regionItemSelected: {
    backgroundColor: '#FFF4F0',
  },
  regionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  regionTextSelected: {
    color: '#FF7A5C',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 20,
    color: '#FF7A5C',
    fontWeight: 'bold',
  },
  registerButton: {
    height: 56,
    backgroundColor: '#FF7A5C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  socialButtons: {
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  socialButton: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  kakaoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  naverIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  naverText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 8,
  },
  googleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  loginButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});
