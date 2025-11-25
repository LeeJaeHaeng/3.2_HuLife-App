import { NextRequest, NextResponse } from 'next/server';
import { Server as NetServer } from 'http';

export const dynamic = 'force-dynamic';

// This endpoint initializes the Socket.IO server
export async function GET(request: NextRequest) {
  // Socket.IO is not compatible with Vercel's serverless environment
  // Returning a message indicating Socket.IO is disabled on Vercel
  if (process.env.VERCEL) {
    return NextResponse.json({
      message: 'Socket.IO is not available on Vercel serverless. Using polling fallback.',
      socketIOEnabled: false
    }, { status: 200 });
  }

  // For local development with custom server (server.js)
  try {
    const res = request as any;

    if (!res.socket?.server) {
      return NextResponse.json({
        message: 'Socket.IO requires custom server. Run with: npm run dev:socket',
        socketIOEnabled: false
      }, { status: 200 });
    }

    if (!res.socket.server.io) {
      console.log('[API] Initializing Socket.IO server...');
      const { initSocketIO } = await import('@/lib/socket');
      const httpServer: NetServer = res.socket.server;
      initSocketIO(httpServer);
    } else {
      console.log('[API] Socket.IO server already initialized');
    }

    return NextResponse.json({
      message: 'Socket.IO server is running',
      socketIOEnabled: true
    }, { status: 200 });
  } catch (error) {
    console.error('[API] Socket.IO initialization error:', error);
    return NextResponse.json({
      message: 'Socket.IO initialization failed. Using polling fallback.',
      socketIOEnabled: false
    }, { status: 200 });
  }
}
