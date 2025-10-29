import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { db } from './db';
import { chatMessages, chatRooms, communityMembers } from './db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export type NextApiResponseServerIO = {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

/**
 * Initialize Socket.IO server
 */
export function initSocketIO(server: NetServer): ServerIO {
  if ((server as any).io) {
    console.log('[Socket.IO] Server already initialized');
    return (server as any).io;
  }

  const io = new ServerIO(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  (server as any).io = io;

  io.on('connection', (socket) => {
    console.log('[Socket.IO] Client connected:', socket.id);

    // Join a community chat room
    socket.on('join-room', async (data: { chatRoomId: string; userId: string }) => {
      try {
        const { chatRoomId, userId } = data;

        // Verify user is a member of the community
        const chatRoom = await db.query.chatRooms.findFirst({
          where: eq(chatRooms.id, chatRoomId),
        });

        if (!chatRoom) {
          socket.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
          return;
        }

        const isMember = await db.query.communityMembers.findFirst({
          where: and(
            eq(communityMembers.communityId, chatRoom.communityId),
            eq(communityMembers.userId, userId)
          ),
        });

        if (!isMember) {
          socket.emit('error', { message: '커뮤니티 멤버만 접근할 수 있습니다.' });
          return;
        }

        // Join the room
        socket.join(chatRoomId);
        console.log(`[Socket.IO] User ${userId} joined room ${chatRoomId}`);

        // Load recent messages (last 50)
        const recentMessages = await db.query.chatMessages.findMany({
          where: eq(chatMessages.chatRoomId, chatRoomId),
          orderBy: (messages, { desc }) => [desc(messages.createdAt)],
          limit: 50,
        });

        // Send recent messages in chronological order
        socket.emit('messages-loaded', recentMessages.reverse());
      } catch (error) {
        console.error('[Socket.IO] Error joining room:', error);
        socket.emit('error', { message: '채팅방 입장에 실패했습니다.' });
      }
    });

    // Leave a chat room
    socket.on('leave-room', (data: { chatRoomId: string }) => {
      const { chatRoomId } = data;
      socket.leave(chatRoomId);
      console.log(`[Socket.IO] Socket ${socket.id} left room ${chatRoomId}`);
    });

    // Send a message
    socket.on('send-message', async (data: {
      chatRoomId: string;
      userId: string;
      userName: string;
      userImage: string | null;
      message: string;
    }) => {
      try {
        const { chatRoomId, userId, userName, userImage, message } = data;

        if (!message || message.trim().length === 0) {
          socket.emit('error', { message: '메시지 내용이 비어있습니다.' });
          return;
        }

        // Verify user is a member
        const chatRoom = await db.query.chatRooms.findFirst({
          where: eq(chatRooms.id, chatRoomId),
        });

        if (!chatRoom) {
          socket.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
          return;
        }

        const isMember = await db.query.communityMembers.findFirst({
          where: and(
            eq(communityMembers.communityId, chatRoom.communityId),
            eq(communityMembers.userId, userId)
          ),
        });

        if (!isMember) {
          socket.emit('error', { message: '커뮤니티 멤버만 메시지를 보낼 수 있습니다.' });
          return;
        }

        // Save message to database
        const newMessage = {
          id: uuidv4(),
          chatRoomId,
          userId,
          userName,
          userImage,
          message: message.trim(),
          createdAt: new Date(),
        };

        await db.insert(chatMessages).values(newMessage);

        // Broadcast to all users in the room
        io.to(chatRoomId).emit('new-message', newMessage);

        console.log(`[Socket.IO] Message sent to room ${chatRoomId} by ${userName}`);
      } catch (error) {
        console.error('[Socket.IO] Error sending message:', error);
        socket.emit('error', { message: '메시지 전송에 실패했습니다.' });
      }
    });

    // User is typing
    socket.on('typing', (data: { chatRoomId: string; userName: string }) => {
      const { chatRoomId, userName } = data;
      socket.to(chatRoomId).emit('user-typing', { userName });
    });

    // User stopped typing
    socket.on('stop-typing', (data: { chatRoomId: string }) => {
      const { chatRoomId } = data;
      socket.to(chatRoomId).emit('user-stopped-typing');
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('[Socket.IO] Client disconnected:', socket.id);
    });
  });

  console.log('[Socket.IO] Server initialized successfully');
  return io;
}
