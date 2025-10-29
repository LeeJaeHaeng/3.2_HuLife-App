const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { db } = require('./lib/db/index');
const { chatMessages, chatRooms, communityMembers } = require('./lib/db/schema');
const { eq, and, desc } = require('drizzle-orm');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('[Socket.IO] Client connected:', socket.id);

    // Join a community chat room
    socket.on('join-room', async (data) => {
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
        const recentMessages = await db.select()
          .from(chatMessages)
          .where(eq(chatMessages.chatRoomId, chatRoomId))
          .orderBy(desc(chatMessages.createdAt))
          .limit(50);

        // Send recent messages in chronological order
        socket.emit('messages-loaded', recentMessages.reverse());
      } catch (error) {
        console.error('[Socket.IO] Error joining room:', error);
        socket.emit('error', { message: '채팅방 입장에 실패했습니다.' });
      }
    });

    // Leave a chat room
    socket.on('leave-room', (data) => {
      const { chatRoomId } = data;
      socket.leave(chatRoomId);
      console.log(`[Socket.IO] Socket ${socket.id} left room ${chatRoomId}`);
    });

    // Send a message
    socket.on('send-message', async (data) => {
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
          userImage: userImage || null,
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
    socket.on('typing', (data) => {
      const { chatRoomId, userName } = data;
      socket.to(chatRoomId).emit('user-typing', { userName });
    });

    // User stopped typing
    socket.on('stop-typing', (data) => {
      const { chatRoomId } = data;
      socket.to(chatRoomId).emit('user-stopped-typing');
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('[Socket.IO] Client disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('[Socket.IO] Server initialized successfully');
  });
});
