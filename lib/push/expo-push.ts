import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

// Expo SDK 인스턴스 생성
const expo = new Expo();

export interface PushNotificationPayload {
  to: string | string[]; // Expo Push Token(s)
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
}

/**
 * 푸시 알림 전송
 * @param payload - 푸시 알림 페이로드
 * @returns 전송 결과 티켓
 */
export async function sendPushNotification(
  payload: PushNotificationPayload
): Promise<ExpoPushTicket[]> {
  const tokens = Array.isArray(payload.to) ? payload.to : [payload.to];

  // 유효한 Expo Push Token인지 확인
  const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));

  if (validTokens.length === 0) {
    console.warn('[푸시 알림] 유효한 Expo Push Token이 없습니다.');
    return [];
  }

  // 푸시 메시지 생성
  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    sound: payload.sound !== null ? payload.sound : 'default',
    title: payload.title,
    body: payload.body,
    data: payload.data || {},
    badge: payload.badge,
    channelId: payload.channelId || 'default',
    priority: payload.priority || 'high',
  }));

  // 메시지를 청크로 나눠서 전송 (Expo 권장)
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  try {
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
      console.log('[푸시 알림] ✅ 전송 완료:', ticketChunk.length, '개');
    }
  } catch (error) {
    console.error('[푸시 알림] ❌ 전송 실패:', error);
    throw error;
  }

  return tickets;
}

/**
 * 여러 사용자에게 푸시 알림 전송
 * @param tokens - Expo Push Token 배열
 * @param title - 알림 제목
 * @param body - 알림 내용
 * @param data - 추가 데이터
 * @param options - 추가 옵션
 */
export async function sendPushNotificationToMany(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, any>,
  options?: {
    sound?: 'default' | null;
    badge?: number;
    channelId?: string;
    priority?: 'default' | 'normal' | 'high';
  }
): Promise<ExpoPushTicket[]> {
  return sendPushNotification({
    to: tokens,
    title,
    body,
    data,
    ...options,
  });
}

/**
 * 채팅 메시지 푸시 알림 전송
 */
export async function sendChatNotification(
  token: string,
  senderName: string,
  message: string,
  chatRoomId: string,
  communityId: string
): Promise<ExpoPushTicket[]> {
  return sendPushNotification({
    to: token,
    title: `${senderName}님의 메시지`,
    body: message,
    data: {
      type: 'chat',
      chatRoomId,
      communityId,
    },
    sound: 'default',
    channelId: 'chat',
    priority: 'high',
  });
}

/**
 * 가입 신청 승인/거절 푸시 알림 전송
 */
export async function sendJoinRequestNotification(
  token: string,
  communityName: string,
  status: 'approved' | 'rejected',
  communityId: string
): Promise<ExpoPushTicket[]> {
  const title = status === 'approved'
    ? `${communityName} 가입 승인됨 🎉`
    : `${communityName} 가입 거절됨`;

  const body = status === 'approved'
    ? '모임에 가입되었습니다. 활동을 시작해보세요!'
    : '아쉽게도 가입이 거절되었습니다.';

  return sendPushNotification({
    to: token,
    title,
    body,
    data: {
      type: 'join_request',
      communityId,
      status,
    },
    sound: 'default',
    channelId: 'community',
  });
}

/**
 * 댓글 알림 전송
 */
export async function sendCommentNotification(
  token: string,
  commenterName: string,
  comment: string,
  contentType: 'post' | 'gallery',
  contentId: string
): Promise<ExpoPushTicket[]> {
  return sendPushNotification({
    to: token,
    title: `${commenterName}님이 댓글을 남겼습니다`,
    body: comment.length > 100 ? comment.substring(0, 100) + '...' : comment,
    data: {
      type: 'comment',
      contentType,
      [contentType === 'post' ? 'postId' : 'galleryId']: contentId,
    },
    sound: 'default',
  });
}

/**
 * 좋아요 알림 전송
 */
export async function sendLikeNotification(
  token: string,
  likerName: string,
  contentType: 'post' | 'gallery',
  contentId: string
): Promise<ExpoPushTicket[]> {
  return sendPushNotification({
    to: token,
    title: `${likerName}님이 좋아요를 눌렀습니다 ❤️`,
    body: `회원님의 ${contentType === 'post' ? '게시글' : '작품'}을 좋아합니다.`,
    data: {
      type: 'like',
      contentType,
      [contentType === 'post' ? 'postId' : 'galleryId']: contentId,
    },
    sound: 'default',
  });
}

/**
 * 일정 리마인더 알림 전송
 */
export async function sendScheduleReminder(
  token: string,
  scheduleTitle: string,
  scheduleDate: string,
  scheduleId: string
): Promise<ExpoPushTicket[]> {
  return sendPushNotification({
    to: token,
    title: `일정 알림: ${scheduleTitle}`,
    body: `${scheduleDate}에 예정된 일정이 있습니다.`,
    data: {
      type: 'schedule',
      scheduleId,
      screen: '/my-page', // 마이페이지 일정 탭으로 이동
    },
    sound: 'default',
  });
}
