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
import { Feather } from '@expo/vector-icons';
import { loginUser } from '../api/authService';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginUser(email, password);
      console.log("[로그인 화면] ✅ 로그인 성공!");
      router.replace('/dashboard');
    } catch (e) {
      console.error("[로그인 화면] ❌ 로그인 실패:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const providerNames = {
      kakao: '카카오',
      naver: '네이버',
      google: '구글'
    };

    Alert.alert(
      `${providerNames[provider]} 로그인`,
      `브라우저에서 ${providerNames[provider]} 로그인을 진행합니다.\n\n로그인 완료 후 앱으로 돌아와 "로그인 확인" 버튼을 눌러주세요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '브라우저 열기',
          onPress: async () => {
            const apiUrl = 'http://192.168.0.40:3000'; // API URL
            const authUrl = `${apiUrl}/api/auth/${provider}`;

            try {
              await Linking.openURL(authUrl);
              console.log(`[소셜 로그인] ${provider} 브라우저 열기 성공`);
            } catch (error) {
              console.error(`[소셜 로그인] 브라우저 열기 실패:`, error);
              Alert.alert('오류', '브라우저를 열 수 없습니다.');
            }
          }
        }
      ]
    );
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
            onPress={handleLogin}
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

          {/* 소셜 로그인 - 카카오 (공식 가이드라인) */}
          <TouchableOpacity
            style={styles.kakaoButton}
            onPress={() => handleSocialLogin('kakao')}
            activeOpacity={0.8}
          >
            <View style={styles.kakaoIconContainer}>
              <View style={styles.kakaoIconCircle}>
                <Text style={styles.kakaoIconText}>K</Text>
              </View>
            </View>
            <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
            <View style={styles.kakaoIconContainer} />
          </TouchableOpacity>

          {/* 소셜 로그인 - 네이버 (공식 가이드라인) */}
          <TouchableOpacity
            style={styles.naverButton}
            onPress={() => handleSocialLogin('naver')}
            activeOpacity={0.8}
          >
            <View style={styles.naverIconContainer}>
              <Text style={styles.naverIconText}>N</Text>
            </View>
            <Text style={styles.naverButtonText}>네이버로 로그인</Text>
            <View style={styles.naverIconContainer} />
          </TouchableOpacity>

          {/* 소셜 로그인 - 구글 (공식 가이드라인) */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => handleSocialLogin('google')}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Google로 로그인</Text>
            <View style={styles.googleIconContainer} />
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
    maxWidth: 440,
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
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  description: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 26,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1F2937',
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  button: {
    height: 56,
    backgroundColor: '#EA580C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 20,
    color: '#4B5563',
    fontSize: 16,
  },

  // 카카오 로그인 - 공식 가이드라인
  kakaoButton: {
    height: 50,
    backgroundColor: '#FEE500',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  kakaoIconContainer: {
    width: 24,
  },
  kakaoIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#381E1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoIconText: {
    color: '#FEE500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  kakaoButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.85,
  },

  // 네이버 로그인 - 공식 가이드라인
  naverButton: {
    height: 50,
    backgroundColor: '#03C75A',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  naverIconContainer: {
    width: 24,
  },
  naverIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  naverButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // 구글 로그인 - 공식 가이드라인
  googleButton: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DADCE0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIconContainer: {
    width: 24,
  },
  googleIconText: {
    color: '#4285F4',
    fontSize: 20,
    fontWeight: 'bold',
  },
  googleButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#3C4043',
    fontSize: 16,
    fontWeight: '500',
  },

  footer: {
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 24,
  },
  linkText: {
    color: '#EA580C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
