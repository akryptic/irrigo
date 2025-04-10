import WebSocket from "ws";

export let boardClient: WebSocket | null = null;
export const webClients = new Set<WebSocket>();

export function addClient(ws: WebSocket, role: "board" | "web-app") {
  if (role === "board") {
    boardClient = ws;
    broadcastToWebApps(
      JSON.stringify({
        type: "board-connection-update",
        payload: { connected: true },
      })
    );
  } else {
    webClients.add(ws);
  }
}

export function removeClient(ws: WebSocket) {
  if (boardClient === ws) {
    boardClient = null;
  } else {
    webClients.delete(ws);
  }
}

export function broadcastToWebApps(data: string) {
  for (const client of webClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

export function broadcastToBoard(data: string) {
  if (boardClient && boardClient.readyState === WebSocket.OPEN) {
    boardClient.send(data);
  }
}
