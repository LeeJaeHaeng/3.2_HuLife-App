import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser } from '../../../api/authService';
import { getCommunityChatRoomAPI } from '../../../api/communityService';
import socketService from '../../../api/socketService';

export default function CommunityChatScreen() {
  const router = useRouter();
  const { id: communityId } = useLocalSearchParams(); // Community ID
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    initializeChat();

    return () => {
      // Cleanup on unmount
      if (chatRoomId && currentUser) {
        socketService.leaveRoom(chatRoomId);
      }
      socketService.removeAllListeners('new-message');
      socketService.removeAllListeners('messages-loaded');
      socketService.removeAllListeners('user-typing');
      socketService.removeAllListeners('user-stopped-typing');
      socketService.removeAllListeners('error');
    };
  }, [communityId]);

  const initializeChat = async () => {
    try {
      // Get current user
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Get or create chat room for this community
      console.log('[Chat] Getting chat room for community:', communityId);
      const chatRoom = await getCommunityChatRoomAPI(communityId);
      setChatRoomId(chatRoom.id);
      console.log('[Chat] Chat room ID:', chatRoom.id);

      // Connect to Socket.IO server
      socketService.connect();

      // Wait for connection
      const checkConnection = setInterval(() => {
        if (socketService.isConnected()) {
          clearInterval(checkConnection);
          setupSocketListeners(user);
          socketService.joinRoom(chatRoom.id, user.id);
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkConnection);
        if (!socketService.isConnected()) {
          Alert.alert('오류', '채팅 서버에 연결할 수 없습니다.');
          router.back();
        }
      }, 5000);
    } catch (error) {
      console.error('[Chat] Initialization error:', error);
      Alert.alert('오류', error.message || '채팅을 시작할 수 없습니다.');
      router.back();
    }
  };

  const setupSocketListeners = (user) => {
    // When messages are loaded
    socketService.onMessagesLoaded((loadedMessages) => {
      console.log('[Chat] Messages loaded:', loadedMessages.length);
      setMessages(loadedMessages);
      setLoading(false);
      scrollToBottom();
    });

    // When a new message arrives
    socketService.onNewMessage((message) => {
      console.log('[Chat] New message received:', message.userName);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // When someone is typing
    socketService.onUserTyping((data) => {
      if (data.userName !== user.name) {
        setTypingUsers((prev) => [...new Set([...prev, data.userName])]);

        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter(name => name !== data.userName));
        }, 3000);
      }
    });

    // When someone stopped typing
    socketService.onUserStoppedTyping(() => {
      setTypingUsers([]);
    });

    // Error handling
    socketService.onError((data) => {
      console.error('[Chat] Socket error:', data.message);
      Alert.alert('오류', data.message);
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !currentUser) return;

    // Check if chatRoomId is available
    if (!chatRoomId) {
      console.error('[Chat] Cannot send message: chatRoomId is null');
      Alert.alert('오류', '채팅방 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setSending(true);

    try {
      console.log('[Chat] Sending message:', {
        chatRoomId,
        userId: currentUser.id,
        userName: currentUser.name,
        message: newMessage.trim().substring(0, 20) + '...',
      });

      socketService.sendMessage({
        chatRoomId,
        userId: currentUser.id,
        userName: currentUser.name,
        userImage: currentUser.profileImage || null,
        message: newMessage.trim(),
      });

      setNewMessage('');
      socketService.userStoppedTyping(chatRoomId);
    } catch (error) {
      console.error('[Chat] Send message error:', error);
      Alert.alert('오류', '메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (text) => {
    setNewMessage(text);

    if (!currentUser) return;

    // Notify others that user is typing
    if (text.trim().length > 0) {
      socketService.userTyping(chatRoomId, currentUser.name);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing notification
      typingTimeoutRef.current = setTimeout(() => {
        socketService.userStoppedTyping(chatRoomId);
      }, 1000);
    } else {
      socketService.userStoppedTyping(chatRoomId);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Helper function to format date in Korean (like KakaoTalk)
  const formatDateSeparator = (date) => {
    const d = new Date(date);
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dayOfWeek = days[d.getDay()];

    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
  };

  // Helper function to check if two dates are on the same day
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const renderMessage = ({ item, index }) => {
    const isOwnMessage = currentUser && item.userId === currentUser.id;
    // Show date separator if this is the first message or if the day changed
    const showDateSeparator = index === 0 || !isSameDay(messages[index - 1].createdAt, item.createdAt);

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparatorContainer}>
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>
                {formatDateSeparator(item.createdAt)}
              </Text>
            </View>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
        ]}>
          {!isOwnMessage && (
            <View style={styles.messageHeader}>
              <Text style={styles.messageSender}>{item.userName}</Text>
            </View>
          )}
          <View style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              isOwnMessage && styles.ownMessageText
            ]}>
              {item.message}
            </Text>
          </View>
          <Text style={[
            styles.messageTime,
            isOwnMessage && styles.ownMessageTime
          ]}>
            {new Date(item.createdAt).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>채팅</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A5C" />
          <Text style={styles.loadingText}>채팅방에 입장하는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>모임 채팅</Text>
          <Text style={styles.headerSubtitle}>실시간 채팅</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToBottom}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>첫 메시지를 보내보세요!</Text>
            </View>
          }
        />

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>
              {typingUsers.join(', ')}님이 입력 중...
            </Text>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={handleTyping}
            placeholder="메시지를 입력하세요..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!newMessage.trim() || !chatRoomId) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending || !chatRoomId}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  ownMessageBubble: {
    backgroundColor: '#FF7A5C',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  ownMessageTime: {
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
