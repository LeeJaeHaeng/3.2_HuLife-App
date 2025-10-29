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

            {/* 구분선 */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 소셜 회원가입 버튼들 */}
            <View style={styles.socialLoginContainer}>
              {/* 카카오 회원가입 */}
              <TouchableOpacity
                style={[styles.socialButton, styles.kakaoButton]}
                onPress={() => router.push('/oauth-webview?provider=kakao')}
              >
                <View style={styles.socialButtonContent}>
                  <View style={styles.kakaoIcon}>
                    <Text style={{ fontSize: 18 }}>💬</Text>
                  </View>
                  <Text style={styles.kakaoText}>카카오</Text>
                </View>
              </TouchableOpacity>

              {/* 네이버 회원가입 */}
              <TouchableOpacity
                style={[styles.socialButton, styles.naverButton]}
                onPress={() => router.push('/oauth-webview?provider=naver')}
              >
                <View style={styles.socialButtonContent}>
                  <Text style={styles.naverIcon}>N</Text>
                  <Text style={styles.naverText}>네이버</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 구글 회원가입 (전체 너비) */}
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => router.push('/oauth-webview?provider=google')}
            >
              <View style={styles.socialButtonContent}>
                <Text style={{ fontSize: 18 }}>🔍</Text>
                <Text style={styles.googleText}>구글</Text>
              </View>
            </TouchableOpacity>
            
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
  logo: { width: 80, height: 80, marginBottom: 20 },  // 64→80 for better visibility
  title: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },  // 28→32 for seniors
  description: { fontSize: 18, color: '#4B5563', marginTop: 10 },  // 16→18, darker color
  errorText: { color: 'red', textAlign: 'center', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: { marginBottom: 20 },  // 16→20 for better spacing
  inputGroupHalf: { width: '48%', marginBottom: 20 },
  label: { fontSize: 18, marginBottom: 10, color: '#374151', fontWeight: '600' },  // 16→18 for readability
  input: {
    height: 56,  // 50→56 for easier touch
    borderWidth: 2,  // 1→2 for better visibility
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,  // 16→18 for readability
  },
  pickerContainer: {
    borderWidth: 2,  // 1→2 for better visibility
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 56,  // 50→56 for easier touch
    fontSize: 18,  // Added for consistency
  },
  selectButton: {
    height: 56,  // 50→56 for easier touch
    borderWidth: 2,  // 1→2 for better visibility
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  termsContainer: {
    marginVertical: 20,  // 16→20 for better spacing
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,  // 12→16 for better spacing
    minHeight: 48,  // Minimum touch target size
  },
  checkbox: {
    width: 24,  // 20→24 for easier touch
    height: 24,
    borderWidth: 2,  // 1→2 for better visibility
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 14,  // 12→14 for better spacing
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
    fontSize: 16,  // Added for better visibility
  },
  checkboxLabel: {
    fontSize: 16,  // 14→16 for readability
    lineHeight: 22,  // Added for better readability
    color: '#374151',  // Explicit color for consistency
    flex: 1, // 텍스트가 길어질 경우 줄바꿈되도록
  },
  button: {
    height: 56,  // 50→56 for easier touch
    backgroundColor: '#FF7A5C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,  // 8→12 for better spacing
  },
  buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },  // 16→20 for readability
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#4B5563',  // Darker for better contrast
    fontSize: 16,  // 14→16 for readability
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  socialButton: {
    height: 56,  // 50→56 for easier touch
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kakaoButton: {
    flex: 1,
    backgroundColor: '#FEE500',
    marginRight: 6,
  },
  kakaoIcon: {
    width: 20,
    alignItems: 'center',
  },
  kakaoText: {
    color: '#000000',
    fontSize: 18,  // 16→18 for readability
    fontWeight: '600',
  },
  naverButton: {
    flex: 1,
    backgroundColor: '#03C75A',
    marginLeft: 6,
  },
  naverIcon: {
    color: '#FFFFFF',
    fontSize: 22,  // 20→22 for better visibility
    fontWeight: 'bold',
  },
  naverText: {
    color: '#FFFFFF',
    fontSize: 18,  // 16→18 for readability
    fontWeight: '600',
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,  // 1→2 for better visibility
    borderColor: '#D1D5DB',
    marginBottom: 16,
  },
  googleText: {
    color: '#374151',
    fontSize: 18,  // 16→18 for readability
    fontWeight: '600',
  },
  footer: { marginTop: 20 },  // 16→20 for better spacing
  footerText: { textAlign: 'center', color: '#4B5563', fontSize: 16 },  // Darker color, explicit size
  linkText: { color: '#FF7A5C', fontWeight: 'bold', fontSize: 16 },  // Explicit size for consistency
});