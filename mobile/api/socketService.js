import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';

// Socket.IO configuration
const SOCKET_URL = API_CONFIG.SOCKET_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  /**
   * Initialize and connect to Socket.IO server
   */
  connect() {
    if (this.socket && this.connected) {
      console.log('[Socket Service] Already connected');
      return this.socket;
    }

    console.log('[Socket Service] Connecting to:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      path: '/api/socketio',  // Socket.IO 서버 경로
      transports: ['websocket', 'polling'],  // polling 추가 (fallback)
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 10000,  // 10초 타임아웃
    });

    this.socket.on('connect', () => {
      console.log('[Socket Service] Connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket Service] Disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket Service] Connection error:', error.message);
    });

    return this.socket;
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect() {
    if (this.socket) {
      console.log('[Socket Service] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Join a chat room
   * @param {string} chatRoomId - Chat room ID
   * @param {string} userId - User ID
   */
  joinRoom(chatRoomId, userId) {
    if (!this.socket) {
      console.error('[Socket Service] Socket not initialized');
      return;
    }

    console.log('[Socket Service] Joining room:', chatRoomId);
    this.socket.emit('join-room', { chatRoomId, userId });
  }

  /**
   * Leave a chat room
   * @param {string} chatRoomId - Chat room ID
   */
  leaveRoom(chatRoomId) {
    if (!this.socket) return;

    console.log('[Socket Service] Leaving room:', chatRoomId);
    this.socket.emit('leave-room', { chatRoomId });
  }

  /**
   * Send a message
   * @param {Object} data - Message data
   * @param {string} data.chatRoomId - Chat room ID
   * @param {string} data.userId - User ID
   * @param {string} data.userName - User name
   * @param {string|null} data.userImage - User image URL
   * @param {string} data.message - Message content
   */
  sendMessage(data) {
    if (!this.socket) {
      console.error('[Socket Service] Socket not initialized');
      return;
    }

    console.log('[Socket Service] Sending message...');
    this.socket.emit('send-message', data);
  }

  /**
   * Notify that user is typing
   * @param {string} chatRoomId - Chat room ID
   * @param {string} userName - User name
   */
  userTyping(chatRoomId, userName) {
    if (!this.socket) return;
    this.socket.emit('typing', { chatRoomId, userName });
  }

  /**
   * Notify that user stopped typing
   * @param {string} chatRoomId - Chat room ID
   */
  userStoppedTyping(chatRoomId) {
    if (!this.socket) return;
    this.socket.emit('stop-typing', { chatRoomId });
  }

  /**
   * Listen for new messages
   * @param {Function} callback - Callback function
   */
  onNewMessage(callback) {
    if (!this.socket) return;
    this.socket.on('new-message', callback);
  }

  /**
   * Listen for messages loaded event
   * @param {Function} callback - Callback function
   */
  onMessagesLoaded(callback) {
    if (!this.socket) return;
    this.socket.on('messages-loaded', callback);
  }

  /**
   * Listen for user typing event
   * @param {Function} callback - Callback function
   */
  onUserTyping(callback) {
    if (!this.socket) return;
    this.socket.on('user-typing', callback);
  }

  /**
   * Listen for user stopped typing event
   * @param {Function} callback - Callback function
   */
  onUserStoppedTyping(callback) {
    if (!this.socket) return;
    this.socket.on('user-stopped-typing', callback);
  }

  /**
   * Listen for errors
   * @param {Function} callback - Callback function
   */
  onError(callback) {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (!this.socket) return;
    this.socket.removeAllListeners(event);
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
