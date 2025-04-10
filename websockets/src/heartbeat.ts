import WebSocket from "ws";

const HEARTBEAT_INTERVAL = 30000;

export function setupHeartbeat(ws: WebSocket & { isAlive?: boolean }) {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });
}

export function startHeartbeat(wss: WebSocket.Server) {
  setInterval(() => {
    wss.clients.forEach((ws: WebSocket & { isAlive?: boolean }) => {
      if (ws.isAlive === false) {
        console.log("💔 Terminating dead connection");
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL);
}
