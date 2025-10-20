import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { registerUser } from '../api/authService';
// 약관 동의를 위한 간단한 체크박스 컴포넌트
const CustomCheckbox = ({ label, isChecked, onCheck }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onCheck}>
    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
      {isChecked && <Text style={styles.checkboxCheckmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function SignUpScreen() {
  const router = useRouter();

  // 각 입력 필드를 위한 상태 변수들
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('서울'); // 임시로 기본값 설정
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // 약관 동의 상태
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // --- 클라이언트 측 유효성 검사 ---
    if (!name || !age || !email || !password || !confirmPassword) {
      Alert.alert('오류', '필수 정보를 모두 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('오류', '필수 이용약관에 동의해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 서버에 보낼 데이터 준비
      const userData = {
        name,
        age: parseInt(age),
        location,
        email,
        password,
        phone: phone || undefined,
      };

      console.log('[회원가입] 가입 정보:', userData);

      // 실제 API 호출
      const response = await registerUser(userData);

      console.log('[회원가입] 성공:', response);

      // 회원가입 성공
      Alert.alert(
        '성공',
        '회원가입이 완료되었습니다! 설문조사를 진행해주세요.',
        [
          {
            text: '확인',
            onPress: () => router.replace('/survey') // 설문조사 화면으로 이동
          }
        ]
      );
    } catch (error) {
      console.error('[회원가입] 실패:', error);
      setError(error.message);
      Alert.alert('오류', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* ScrollView로 전체를 감싸서 스크롤 가능하게 만듭니다. */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Image source={require('../assets/hobbies/hulife_logo.png')} style={styles.logo} />
              <Text style={styles.title}>휴라이프 시작하기</Text>
              <Text style={styles.description}>새로운 인생 2막을 함께 준비해요</Text>
            </View>

            {/* 에러 메시지 */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* 이름 / 나이 */}
            <View style={styles.row}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>이름</Text>
                <TextInput style={styles.input} placeholder="홍길동" value={name} onChangeText={setName} />
              </View>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>나이</Text>
                <TextInput style={styles.input} placeholder="65" keyboardType="number-pad" value={age} onChangeText={setAge} />
              </View>
            </View>

            {/* 이메일 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput style={styles.input} placeholder="example@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            {/* 비밀번호 / 비밀번호 확인 */}
            <View style={styles.row}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
              </View>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>비밀번호 확인</Text>
                <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
              </View>
            </View>
            
            {/* 거주 지역 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>거주 지역</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={location}
                  onValueChange={(itemValue) => setLocation(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="서울" value="서울" />
                  <Picker.Item label="경기" value="경기" />
                  <Picker.Item label="인천" value="인천" />
                  <Picker.Item label="부산" value="부산" />
                  <Picker.Item label="대구" value="대구" />
                  <Picker.Item label="광주" value="광주" />
                  <Picker.Item label="대전" value="대전" />
                  <Picker.Item label="울산" value="울산" />
                  <Picker.Item label="세종" value="세종" />
                  <Picker.Item label="강원" value="강원" />
                  <Picker.Item label="충북" value="충북" />
                  <Picker.Item label="충남" value="충남" />
                  <Picker.Item label="전북" value="전북" />
                  <Picker.Item label="전남" value="전남" />
                  <Picker.Item label="경북" value="경북" />
                  <Picker.Item label="경남" value="경남" />
                  <Picker.Item label="제주" value="제주" />
                </Picker>
              </View>
            </View>

            {/* 전화번호 (선택) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>전화번호 (선택)</Text>
              <TextInput style={styles.input} placeholder="010-1234-5678" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>
            
            {/* 약관 동의 */}
            <View style={styles.termsContainer}>
              <CustomCheckbox 
                label="(필수) 만 14세 이상이며, 이용약관 및 개인정보 처리방침에 동의합니다"
                isChecked={termsAccepted}
                onCheck={() => setTermsAccepted(!termsAccepted)}
              />
              <CustomCheckbox 
                label="(선택) 마케팅 정보 수신에 동의합니다"
                isChecked={marketingAccepted}
                onCheck={() => setMarketingAccepted(!marketingAccepted)}
              />
            </View>

            {/* 회원가입 버튼 */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? '가입하는 중...' : '회원가입'}</Text>
            </TouchableOpacity>

            {/* 소셜 로그인 (임시) */}
            <Text style={styles.socialLoginText}>소셜 로그인 버튼 영역</Text>
            
            {/* 로그인 링크 */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                이미 계정이 있으신가요?{' '}
                <Link href="/login" asChild>
                  <Text style={styles.linkText}>로그인</Text>
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 64, height: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  description: { fontSize: 16, color: '#6B7280', marginTop: 8 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: { marginBottom: 16 },
  inputGroupHalf: { width: '48%', marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8, color: '#374151' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  selectButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  termsContainer: {
    marginVertical: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF7A5C',
    borderColor: '#FF7A5C',
  },
  checkboxCheckmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1, // 텍스트가 길어질 경우 줄바꿈되도록
  },
  button: {
    height: 50,
    backgroundColor: '#FF7A5C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  socialLoginText: { textAlign: 'center', marginVertical: 24, color: '#6B7280' },
  footer: { marginTop: 16 },
  footerText: { textAlign: 'center', color: '#6B7280' },
  linkText: { color: '#FF7A5C', fontWeight: 'bold' },
});