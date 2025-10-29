import { NextRequest } from 'next/server';
import { Server as NetServer } from 'http';
import { initSocketIO } from '@/lib/socket';

// This endpoint initializes the Socket.IO server
export async function GET(request: NextRequest) {
  const res = request as any;

  if (!res.socket.server.io) {
    console.log('[API] Initializing Socket.IO server...');
    const httpServer: NetServer = res.socket.server;
    initSocketIO(httpServer);
  } else {
    console.log('[API] Socket.IO server already initialized');
  }

  return new Response('Socket.IO server is running', { status: 200 });
}
