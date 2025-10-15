import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function LoginScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    Alert.alert('준비중', '로그인 기능은 준비중입니다.');
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('준비중', `${provider} 로그인은 준비중입니다.`);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.logo}>🌟</Text>
            <Text style={styles.title}>휴라이프에 오신 것을 환영합니다</Text>
            <Text style={styles.subtitle}>새로운 취미와 친구를 만나보세요</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.options}>
              <View style={styles.remember}>
                <View style={styles.checkbox} />
                <Text style={styles.rememberText}>로그인 상태 유지</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.forgot}>비밀번호 찾기</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            {/* 소셜 로그인 - 웹과 동일 */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.kakaoButton]}
                  onPress={() => handleSocialLogin('카카오')}>
                  <Text style={styles.kakaoIcon}>💬</Text>
                  <Text style={styles.kakaoText}>카카오</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.naverButton]}
                  onPress={() => handleSocialLogin('네이버')}>
                  <Text style={styles.naverIcon}>N</Text>
                  <Text style={styles.naverText}>네이버</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('구글')}>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleText}>구글</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>아직 계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF5F0'},
  scrollContent: {flexGrow: 1, justifyContent: 'center', padding: 16},
  card: {backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4},
  header: {alignItems: 'center', marginBottom: 32},
  logo: {fontSize: 64, marginBottom: 16},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8},
  subtitle: {fontSize: 16, color: '#6B7280', textAlign: 'center'},
  form: {marginBottom: 24},
  inputGroup: {marginBottom: 16},
  label: {fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8},
  input: {height: 48, backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, fontSize: 16},
  options: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24},
  remember: {flexDirection: 'row', alignItems: 'center'},
  checkbox: {width: 16, height: 16, borderWidth: 2, borderColor: '#D1D5DB', borderRadius: 4, marginRight: 8},
  rememberText: {fontSize: 14, color: '#6B7280'},
  forgot: {fontSize: 14, color: '#FF7A5C', fontWeight: '600'},
  loginButton: {height: 48, backgroundColor: '#FF7A5C', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 24},
  loginButtonText: {fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'},
  dividerContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: 24},
  dividerLine: {flex: 1, height: 1, backgroundColor: '#E5E7EB'},
  dividerText: {marginHorizontal: 16, fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase'},
  socialButtons: {gap: 12},
  socialRow: {flexDirection: 'row', gap: 12},
  socialButton: {height: 48, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1},
  kakaoButton: {backgroundColor: '#FEE500'},
  kakaoIcon: {fontSize: 20, marginRight: 8},
  kakaoText: {fontSize: 16, fontWeight: '600', color: '#000000'},
  naverButton: {backgroundColor: '#03C75A'},
  naverIcon: {fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginRight: 8},
  naverText: {fontSize: 16, fontWeight: '600', color: '#FFFFFF'},
  googleButton: {borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF'},
  googleIcon: {fontSize: 20, fontWeight: 'bold', color: '#4285F4', marginRight: 8},
  googleText: {fontSize: 16, fontWeight: '600', color: '#1F2937'},
  footer: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  footerText: {fontSize: 14, color: '#6B7280'},
  footerLink: {fontSize: 14, color: '#FF7A5C', fontWeight: '600'},
});
