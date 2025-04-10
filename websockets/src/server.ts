import WebSocket, { WebSocketServer } from 'ws';
import { handleMessage } from './messageHandler';
import { removeClient } from './clients';
import { setupHeartbeat, startHeartbeat } from './heartbeat';

export function createWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    const roleRef = { role: null as string | null };

    setupHeartbeat(ws);

    ws.on('message', (msg) => {      
      handleMessage(ws, msg.toString(), roleRef);
    });

    ws.on('close', () => {
      removeClient(ws);
      console.log(`🚫 ${roleRef.role ?? 'Unknown'} disconnected`);
    });
  });

  startHeartbeat(wss);
  console.log(`🚀 WebSocket server running on ws://localhost:${port}`);
}
