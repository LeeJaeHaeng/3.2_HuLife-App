import React, { useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://172.30.1.60:3000';

export default function OAuthWebViewScreen() {
  const router = useRouter();
  const { provider } = useLocalSearchParams(); // 'kakao', 'naver', or 'google'
  const webViewRef = useRef(null);

  // Generate OAuth URL based on provider
  const getOAuthUrl = () => {
    const callbackUri = `${API_BASE_URL}/api/auth/${provider}/callback`;

    switch (provider) {
      case 'kakao':
        return `https://kauth.kakao.com/oauth/authorize?client_id=de424c0a4add19379cea19567a6cb17a&redirect_uri=${encodeURIComponent(callbackUri)}&response_type=code`;

      case 'naver':
        const state = Math.random().toString(36).substring(7);
        return `https://nid.naver.com/oauth2.0/authorize?client_id=JhDatPR2iI0ZeyBEAk_T&redirect_uri=${encodeURIComponent(callbackUri)}&response_type=code&state=${state}`;

      case 'google':
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=216701679575-komtl1g5qfmeue98bk93h8mho8m5nq9f.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(callbackUri)}&response_type=code&scope=openid%20email%20profile`;

      default:
        return '';
    }
  };

  // Handle navigation state changes
  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;
    console.log('[OAuth] Navigation URL:', url);

    // Check if URL is the callback URL
    if (url.includes(`/api/auth/${provider}/callback`)) {
      console.log('[OAuth] Callback detected!');

      // Check if there's an error
      if (url.includes('error=')) {
        const errorMatch = url.match(/error=([^&]+)/);
        const error = errorMatch ? errorMatch[1] : 'unknown';
        Alert.alert('로그인 실패', `OAuth 로그인에 실패했습니다: ${error}`);
        router.back();
        return;
      }

      // Check if redirecting to survey or dashboard
      if (url.includes('/survey')) {
        console.log('[OAuth] New user - redirecting to survey');
        router.replace('/survey');
        return;
      }

      if (url.includes('/dashboard')) {
        console.log('[OAuth] Existing user - redirecting to dashboard');
        router.replace('/dashboard');
        return;
      }

      // If no redirect detected, check session and navigate
      setTimeout(async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken');
          if (token) {
            console.log('[OAuth] Session found, going to dashboard');
            router.replace('/dashboard');
          } else {
            console.log('[OAuth] No session found');
            router.back();
          }
        } catch (error) {
          console.error('[OAuth] Session check error:', error);
          router.back();
        }
      }, 1000);
    }
  };

  const oauthUrl = getOAuthUrl();

  if (!oauthUrl) {
    Alert.alert('오류', '지원하지 않는 로그인 방식입니다.');
    router.back();
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <WebView
        ref={webViewRef}
        source={{ uri: oauthUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FF7A5C" />
          </View>
        )}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
