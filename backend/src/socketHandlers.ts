import { gameState, VttServer, VttServerSocket } from "@vtt/shared/types";

export default function registerSocketHandlers(
  io: VttServer,
  socket: VttServerSocket
) {
  socket.on("JOIN_GAME", () => {
    socket.emit("GAME_STATE", gameState);
  });

  socket.on("MOVE_TOKEN", ({ to, tokenId }) => {
    const token = gameState.tokens.find((t) => t.id === tokenId);
    if (!token) return;

    token.x = to.x;
    token.y = to.y;

    io.emit("TOKEN_MOVED", { tokenId, to });
  });
}
