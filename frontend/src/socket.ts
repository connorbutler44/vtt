import { VttClientSocket } from "@vtt/shared/types";
import { connect } from "socket.io-client";

let socket: VttClientSocket | null = null;

export function getSocket() {
  if (!socket) {
    socket = connect(process.env.NEXT_PUBLIC_VTT_BACKEND_URL!, {
      transports: ["websocket"],
    });
  }
  return socket;
}
