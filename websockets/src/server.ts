import WebSocket, { WebSocketServer } from "ws";
import { broadcastToWebApps, removeClient } from "./clients";
import { setupHeartbeat, startHeartbeat } from "./heartbeat";
import { handleMessage } from "./messageHandler";

export function createWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    //@ts-ignore
    ws._socket.setKeepAlive(true, 8000);
    const roleRef = { role: null as string | null };

    setupHeartbeat(ws);

    ws.on("message", (msg) => {
      handleMessage(ws, msg.toString(), roleRef);
    });

    ws.on("close", () => {
      removeClient(ws);
      if (roleRef.role === "board") {
        broadcastToWebApps(
          JSON.stringify({
            type: "board-connection-update",
            payload: { connected: false },
          })
        );
      }
      console.log(`🚫 ${roleRef.role ?? "Unknown"} disconnected`);
    });
  });

  startHeartbeat(wss);
  console.log(`🚀 WebSocket server running on ws://localhost:${port}`);
}
