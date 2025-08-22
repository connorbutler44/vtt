import { Socket, connect } from "socket.io-client";

let socket: typeof Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = connect("http://localhost:8080", {
      transports: ["websocket"],
    });
  }
  return socket;
}
