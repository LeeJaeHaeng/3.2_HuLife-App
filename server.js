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
const port = process.env.PORT || 3000;

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
    path: '/api/socketio',
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

        // Send recent messages in chronological order (Drizzle already returns camelCase)
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
        console.log('[Socket.IO] Received send-message event:', {
          chatRoomId: data?.chatRoomId,
          userId: data?.userId,
          userName: data?.userName,
          hasMessage: !!data?.message,
          messageLength: data?.message?.length,
        });

        const { chatRoomId, userId, userName, userImage, message } = data;

        if (!message || message.trim().length === 0) {
          console.error('[Socket.IO] Empty message');
          socket.emit('error', { message: '메시지 내용이 비어있습니다.' });
          return;
        }

        // Verify user is a member
        console.log('[Socket.IO] Looking for chat room:', chatRoomId);
        const chatRoom = await db.query.chatRooms.findFirst({
          where: eq(chatRooms.id, chatRoomId),
        });

        if (!chatRoom) {
          console.error('[Socket.IO] Chat room not found:', chatRoomId);
          socket.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
          return;
        }

        console.log('[Socket.IO] Chat room found, checking membership for user:', userId);
        const isMember = await db.query.communityMembers.findFirst({
          where: and(
            eq(communityMembers.communityId, chatRoom.communityId),
            eq(communityMembers.userId, userId)
          ),
        });

        if (!isMember) {
          console.error('[Socket.IO] User is not a member:', userId);
          socket.emit('error', { message: '커뮤니티 멤버만 메시지를 보낼 수 있습니다.' });
          return;
        }

        // Save message to database
        // ⚠️ IMPORTANT: Drizzle uses camelCase field names (defined in schema.ts)
        // ⚠️ CRITICAL: Don't save userImage to DB - it's too large (Base64 encoded)
        //              userImage is VARCHAR(255) but Base64 images are 10k+ chars
        const messageId = uuidv4();
        const newMessage = {
          id: messageId,
          chatRoomId: chatRoomId,
          userId: userId,
          userName: userName,
          userImage: null, // Don't save Base64 image to DB
          message: message.trim(),
          // Don't set createdAt - let DB auto-generate it
        };

        console.log('[Socket.IO] Saving message to database...');
        await db.insert(chatMessages).values(newMessage);

        // Broadcast to all users in the room
        const messageForClient = {
          id: messageId,
          chatRoomId: chatRoomId,
          userId: userId,
          userName: userName,
          userImage: userImage || null,
          message: message.trim(),
          createdAt: new Date().toISOString(), // Send as ISO string for client
        };
        io.to(chatRoomId).emit('new-message', messageForClient);

        console.log(`[Socket.IO] ✅ Message sent successfully to room ${chatRoomId} by ${userName}`);
      } catch (error) {
        console.error('[Socket.IO] ❌ Error sending message:', error);
        console.error('[Socket.IO] Error stack:', error.stack);
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

  // Better error handling for port conflicts
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Set a different PORT env var or stop the process using that port.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('[Socket.IO] Server initialized successfully');
  });
});
