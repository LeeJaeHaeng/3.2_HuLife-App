import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import notificationService from '../api/notificationService';
import OfflineIndicator from '../components/OfflineIndicator';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // 푸시 알림 초기화
    initializeNotifications();

    // 딥링크 리스너 설정
    setupDeepLinking();

    return () => {
      // 리스너 정리
      notificationService.removeListeners();
    };
  }, []);

  const initializeNotifications = async () => {
    // 푸시 알림 권한 요청 및 토큰 등록
    await notificationService.registerForPushNotifications();

    // 알림 리스너 설정
    notificationService.setupNotificationListeners(
      // 알림 수신 시 (앱이 포그라운드에 있을 때)
      (notification) => {
        console.log('[App] 📩 알림 수신:', notification.request.content.title);
      },
      // 알림 탭 시 (사용자가 알림을 탭했을 때)
      (response) => {
        handleNotificationResponse(response);
      }
    );
  };

  const handleNotificationResponse = (response) => {
    const data = response.notification.request.content.data;
    console.log('[App] 👆 알림 탭 - 데이터:', data);

    // 알림 타입에 따라 화면 이동
    if (data.type === 'chat') {
      // 채팅 메시지 알림 → 채팅방으로 이동
      router.push(`/community/chat/${data.chatRoomId}`);
    } else if (data.type === 'join_request') {
      // 가입 신청 알림 → 커뮤니티 상세로 이동
      router.push(`/community/${data.communityId}`);
    } else if (data.type === 'comment') {
      // 댓글 알림 → 게시글 상세로 이동
      if (data.postId) {
        router.push(`/community/posts/${data.postId}`);
      } else if (data.galleryId) {
        router.push(`/gallery/${data.galleryId}`);
      }
    } else if (data.type === 'like') {
      // 좋아요 알림 → 해당 콘텐츠로 이동
      if (data.postId) {
        router.push(`/community/posts/${data.postId}`);
      } else if (data.galleryId) {
        router.push(`/gallery/${data.galleryId}`);
      }
    } else if (data.screen) {
      // 일반 화면 이동
      router.push(data.screen);
    }
  };

  const setupDeepLinking = async () => {
    try {
      // 앱이 딥링크로 열렸을 때 초기 URL 가져오기
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('[App] 🔗 초기 딥링크 감지:', initialUrl);
        handleDeepLink(initialUrl);
      }

      // 앱이 실행 중일 때 딥링크 수신 리스너 설정
      const subscription = Linking.addEventListener('url', ({ url }) => {
        console.log('[App] 🔗 딥링크 수신:', url);
        handleDeepLink(url);
      });

      // 클린업 함수 반환 (useEffect에서 사용되지 않지만 나중을 위해)
      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.error('[App] ❌ 딥링크 설정 오류:', error);
    }
  };

  const handleDeepLink = (url) => {
    try {
      // URL 파싱: hulifeexpoapp://community/123 형태
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log('[App] 🔍 딥링크 파싱:', { hostname, path, queryParams });

      // 호스트네임에 따라 라우팅
      if (hostname === 'community' && path) {
        // 커뮤니티 초대 링크: hulifeexpoapp://community/[id]
        router.push(`/community/${path}`);
      } else if (hostname === 'chat' && path) {
        // 채팅방 링크: hulifeexpoapp://chat/[id]
        router.push(`/community/chat/${path}`);
      } else if (hostname === 'hobby' && path) {
        // 취미 상세 링크: hulifeexpoapp://hobby/[id]
        router.push(`/hobbies/${path}`);
      } else if (hostname === 'gallery' && path) {
        // 갤러리 작품 링크: hulifeexpoapp://gallery/[id]
        router.push(`/gallery/${path}`);
      } else if (hostname === 'post' && path) {
        // 게시글 링크: hulifeexpoapp://post/[id]
        router.push(`/community/posts/${path}`);
      } else if (queryParams?.screen) {
        // 쿼리 파라미터로 화면 지정: hulifeexpoapp://open?screen=/dashboard
        router.push(queryParams.screen);
      } else {
        console.log('[App] ⚠️ 알 수 없는 딥링크 형식:', url);
      }
    } catch (error) {
      console.error('[App] ❌ 딥링크 처리 오류:', error);
    }
  };

  return (
    <>
      <OfflineIndicator />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF7A5C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
      {/* 메인 화면 */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />

      {/* 기본 화면들 */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: '회원가입' }} />
      <Stack.Screen name="oauth-webview" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />

      {/* 정보 페이지 */}
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="faq" options={{ headerShown: false }} />
      <Stack.Screen name="contact" options={{ headerShown: false }} />

      {/* 취미 관련 화면들 */}
      <Stack.Screen name="hobbies" options={{ headerShown: false }} />
      <Stack.Screen name="hobbies/[id]" options={{ headerShown: false }} />

      {/* 커뮤니티 관련 화면들 */}
      <Stack.Screen name="community" options={{ headerShown: false }} />
      <Stack.Screen name="community/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="community/create" options={{ headerShown: false }} />
      <Stack.Screen name="community/posts/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="community/posts/create" options={{ headerShown: false }} />
      <Stack.Screen name="community/chat/[id]" options={{ headerShown: false }} />

      {/* 갤러리 관련 화면들 */}
      <Stack.Screen name="gallery" options={{ headerShown: false }} />
      <Stack.Screen name="gallery/[id]" options={{ headerShown: false }} />

      {/* 마이페이지 */}
      <Stack.Screen name="my-page" options={{ headerShown: false }} />

      {/* 설문조사 */}
      <Stack.Screen name="survey" options={{ headerShown: false }} />

      {/* 추천 결과 */}
      <Stack.Screen name="recommendations" options={{ headerShown: false }} />
    </Stack>
    </>
  );
}