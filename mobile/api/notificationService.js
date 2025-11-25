import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './apiClient';

// 알림 핸들러 설정 (앱이 포그라운드에 있을 때 알림 표시 방식)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  /**
   * 푸시 알림 권한 요청 및 토큰 등록
   * @returns {Promise<string|null>} Expo Push Token
   */
  async registerForPushNotifications() {
    let token = null;

    // 물리 디바이스인지 확인
    if (!Device.isDevice) {
      console.log('[알림 서비스] 에뮬레이터에서는 푸시 알림을 사용할 수 없습니다.');
      return null;
    }

    // Expo Go 감지 (SDK 53+에서는 Push Notification 미지원)
    if (Constants.appOwnership === 'expo') {
      console.log('[알림 서비스] ⚠️ Expo Go에서는 푸시 알림이 지원되지 않습니다. Development Build를 사용하세요.');
      return null;
    }

    try {
      // 알림 권한 확인
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // 권한이 없으면 요청
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[알림 서비스] 푸시 알림 권한이 거부되었습니다.');
        return null;
      }

      // Expo 프로젝트 ID 확인
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.log('[알림 서비스] ⚠️ Expo 프로젝트 ID가 설정되지 않았습니다. app.json에 extra.eas.projectId를 추가하세요.');
        return null;
      }

      // Expo Push Token 가져오기
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      token = tokenData.data;
      this.expoPushToken = token;

      console.log('[알림 서비스] ✅ Expo Push Token:', token);

      // 서버에 토큰 등록
      await this.registerTokenWithServer(token);

    } catch (error) {
      // Expo Go 관련 오류는 조용히 처리
      if (error.message?.includes('expo-notifications')) {
        console.log('[알림 서비스] ℹ️ Expo Go에서는 푸시 알림을 사용할 수 없습니다.');
      } else {
        console.error('[알림 서비스] ❌ 토큰 등록 실패:', error.message || error);
      }
    }

    // Android 알림 채널 설정
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF7A5C',
      });

      // 채팅 알림 전용 채널
      await Notifications.setNotificationChannelAsync('chat', {
        name: '채팅 알림',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 150, 150, 150],
        lightColor: '#FF7A5C'
      });

      // 모임 알림 전용 채널
      await Notifications.setNotificationChannelAsync('community', {
        name: '모임 알림',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: '#FF7A5C',
      });
    }

    return token;
  }

  /**
   * 서버에 푸시 토큰 등록
   * @param {string} token - Expo Push Token
   */
  async registerTokenWithServer(token) {
    try {
      await api.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
        deviceInfo: {
          brand: Device.brand,
          modelName: Device.modelName,
          osVersion: Device.osVersion,
        },
      });
      console.log('[알림 서비스] ✅ 서버에 토큰 등록 완료');
    } catch (error) {
      console.error('[알림 서비스] ❌ 서버 토큰 등록 실패:', error);
    }
  }

  /**
   * 알림 리스너 설정
   * @param {Function} onNotification - 알림 수신 시 콜백
   * @param {Function} onNotificationResponse - 알림 탭 시 콜백
   */
  setupNotificationListeners(onNotification, onNotificationResponse) {
    // 알림 수신 리스너 (앱이 포그라운드에 있을 때)
    this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[알림 서비스] 📩 알림 수신:', notification);
      if (onNotification) {
        onNotification(notification);
      }
    });

    // 알림 응답 리스너 (사용자가 알림을 탭했을 때)
    this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[알림 서비스] 👆 알림 탭:', response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });
  }

  /**
   * 리스너 제거 (컴포넌트 언마운트 시)
   */
  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * 로컬 알림 스케줄링 (테스트용)
   * @param {Object} notification - 알림 내용
   * @param {number} seconds - 몇 초 후 알림 (기본 5초)
   */
  async scheduleLocalNotification(notification, seconds = 5) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title || '휴라이프',
          body: notification.body || '새로운 알림이 있습니다.',
          data: notification.data || {},
          sound: 'notification-sound.wav',
          badge: 1,
        },
        trigger: {
          seconds,
        },
      });
      console.log('[알림 서비스] ⏰ 로컬 알림 스케줄됨:', id);
      return id;
    } catch (error) {
      console.error('[알림 서비스] ❌ 로컬 알림 스케줄 실패:', error);
      return null;
    }
  }

  /**
   * 즉시 로컬 알림 표시
   * @param {Object} notification - 알림 내용
   */
  async presentLocalNotification(notification) {
    return await this.scheduleLocalNotification(notification, 0);
  }

  /**
   * 배지 개수 설정
   * @param {number} count - 배지 숫자
   */
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('[알림 서비스] ❌ 배지 설정 실패:', error);
    }
  }

  /**
   * 모든 알림 제거
   */
  async dismissAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
  }

  /**
   * Expo Push Token 가져오기
   * @returns {string|null}
   */
  getExpoPushToken() {
    return this.expoPushToken;
  }
}

// Singleton 인스턴스 export
const notificationService = new NotificationService();
export default notificationService;
