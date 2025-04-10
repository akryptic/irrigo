import WebSocket from "ws";
import { IncomingMessage } from "./types";
import { addClient, broadcastToBoard, broadcastToWebApps } from "./clients";

export function handleMessage(
  ws: WebSocket,
  message: string,
  roleRef: { role: string | null }
) {
  try {
    const data: IncomingMessage = JSON.parse(message);

    if (data.type === "init") {
      roleRef.role = data.role;
      addClient(ws, data.role);
      console.log(` 🌐 ${data.role} connected`);
      return;
    }

    if (roleRef.role === "board" && data.type === "sensor_data") {
      broadcastToWebApps(JSON.stringify(data));
    }

    if (roleRef.role === "board" && data.type === "cmd-res") {
      console.log(data);
      broadcastToWebApps(JSON.stringify(data));
    }

    if (roleRef.role === "web-app" && data.type === "command") {
      console.log(data);

      broadcastToBoard(JSON.stringify(data));
    }
  } catch (err) {
    console.error("Error handling message:", err);
  }
}
