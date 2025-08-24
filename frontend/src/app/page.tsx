"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../socket";
import { GameState } from "@vtt/shared/types";

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to backend:", socket.id);
      socket.emit("JOIN_GAME");
    });

    socket.on("GAME_STATE", (state) => {
      console.log("Received game state:", state);
      setGameState(state);
    });

    socket.on("TOKEN_MOVED", (data) => {
      console.log("Token moved:", data);
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tokens: prev.tokens.map((t) =>
            t.id === data.tokenId ? { ...t, ...data.to } : t
          ),
        };
      });
    });

    return () => {
      socket.off("connect");
      socket.off("GAME_STATE");
      socket.off("TOKEN_MOVED");
    };
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">VTT Client</h1>
      {gameState ? (
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      ) : (
        <p>Loading game state...</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          const socket = getSocket();
          socket.emit("MOVE_TOKEN", {
            tokenId: "t1",
            to: { x: 5, y: 7 },
          });
        }}
      >
        Move Token t1
      </button>
    </main>
  );
}
