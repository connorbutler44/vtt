import { Server } from "socket.io";
import { gameState } from "@vtt/shared/types";
import { VttServerSocket } from "@vtt/shared/util/socket";

export default function registerSocketHandlers(
  io: Server,
  socket: VttServerSocket
) {
  socket.on("JOIN_GAME", () => {
    socket.emit("GAME_STATE", gameState);
  });

  socket.on("MOVE_TOKEN", ({ tokenId, to }) => {
    const token = gameState.tokens.find((t) => t.id === tokenId);
    if (!token) return;

    token.x = to.x;
    token.y = to.y;

    io.emit("TOKEN_MOVED", { tokenId, to });
  });
}
