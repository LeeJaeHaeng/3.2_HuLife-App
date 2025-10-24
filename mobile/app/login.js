import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../api/authService'; // 로그인 함수 가져오기

export default function LoginScreen() {
  const router = useRouter(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 에러 상태 추가
  const [loading, setLoading] = useState(false);

  // 로그인 버튼 클릭 시 실행될 함수
  const handleLogin = async () => { // async 추가
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError(''); // 이전 에러 메시지 초기화

    try {
      await loginUser(email, password); // 실제 로그인 API 호출
      console.log("[로그인 화면] ✅ 로그인 성공!");
      router.replace('/dashboard'); // 로그인 성공 시 대시보드로 이동
    } catch (e) {
      console.error("[로그인 화면] ❌ 로그인 실패:", e.message);
      setError(e.message); // 서버 또는 네트워크 에러 메시지를 상태에 저장
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.card}>
          <View style={styles.header}>
            <Image source={require('../assets/hobbies/hulife_logo.png')} style={styles.logo} />
            <Text style={styles.title}>휴라이프에 오신 것을 환영합니다</Text>
            <Text style={styles.description}>새로운 취미와 친구를 만나보세요</Text>
          </View>

          {/* 에러 메시지 표시 영역 */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin} // 수정된 handleLogin 연결
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? '로그인 중...' : '로그인'}</Text>
          </TouchableOpacity>

          {/* 구분선 */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 소셜 로그인 버튼들 */}
          <View style={styles.socialLoginContainer}>
            {/* 카카오 로그인 */}
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

            {/* 네이버 로그인 */}
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

          {/* 구글 로그인 (전체 너비) */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => router.push('/oauth-webview?provider=google')}
          >
            <View style={styles.socialButtonContent}>
              <Text style={{ fontSize: 18 }}>🔍</Text>
              <Text style={styles.googleText}>구글</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              아직 계정이 없으신가요?{' '}
              <Link href="/signup" asChild>
                <Text style={styles.linkText}>회원가입</Text>
              </Link>
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// styles에 error 관련 스타일 추가
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#EA580C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  socialButton: {
    height: 50,
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
    fontSize: 16,
    fontWeight: '600',
  },
  naverButton: {
    flex: 1,
    backgroundColor: '#03C75A',
    marginLeft: 6,
  },
  naverIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  naverText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
  },
  googleText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#6B7280',
  },
  linkText: {
    color: '#EA580C',
    fontWeight: 'bold',
  },
});