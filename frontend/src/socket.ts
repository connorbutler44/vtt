import { VttClientSocket } from "@vtt/shared/util/socket";
import { connect } from "socket.io-client";

let socket: VttClientSocket | null = null;

export function getSocket() {
  if (!socket) {
    socket = new VttClientSocket(
      connect(process.env.NEXT_PUBLIC_VTT_BACKEND_URL!, {
        transports: ["websocket"],
      })
    );
  }
  return socket;
}
