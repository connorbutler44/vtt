import { Server, Socket } from "socket.io";
import { gameState } from "@vtt/schema";

export default function registerSocketHandlers(io: Server, socket: Socket) {
  // Send full state when player joins
  socket.on("joinGame", () => {
    socket.emit("gameState", gameState);
  });

  // Handle token movement
  socket.on("moveToken", ({ tokenId, to }) => {
    const token = gameState.tokens.find((t) => t.id === tokenId);
    if (!token) return;

    // Simple validation: only grid bounds check
    if (to.x < 0 || to.y < 0) return;

    token.x = to.x;
    token.y = to.y;

    // Broadcast update
    io.emit("tokenMoved", { tokenId, to });
  });
}
