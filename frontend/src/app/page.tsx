"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { getSocket } from "../socket";
import { GameState, GridPosition, Token } from "@vtt/shared/types";
import { CharacterListCard } from "../components/CharacterListCard";
import { CameraState, draw } from "../gameBoard/draw";
import { StatusWidget } from "../components/StatusWidget";
import * as boardUtils from "../gameBoard/util";
import { ZOOM_FACTOR } from "../gameBoard/constants";

export default function HomePage() {
  const socket = getSocket();
  const [connectionStatus, setConnectionStatus] = useState<
    "DISCONNECTED" | "CONNECTED"
  >("DISCONNECTED");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({
    x: 0,
    y: 0,
    zoom: 1,
  });
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedCell, setHighlightedCell] = useState<GridPosition | null>(
    null
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to backend:", socket.id);
      setConnectionStatus("CONNECTED");
      socket.emit("JOIN_GAME");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
      setConnectionStatus("DISCONNECTED");
      setGameState(null);
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
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    draw(
      canvas,
      gameState,
      cameraState,
      selectedToken,
      isDragging,
      highlightedCell
    );
  }, [canvasRef, gameState, cameraState, selectedToken, highlightedCell]);

  const handleMouseMoveWithLeftClick = (e: MouseEvent) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const worldPos = boardUtils.screenToWorldPosition(
        e.clientX,
        e.clientY,
        cameraState
      );
      const gridPos = boardUtils.worldToGridCoordinates(worldPos.x, worldPos.y);

      setSelectedToken((prev) => {
        if (prev) {
          return {
            ...prev,
            x: gridPos.x,
            y: gridPos.y,
          };
        }

        return null;
      });
    } else {
      // pan camera
      setCameraState((prev) => ({
        ...prev,
        x: prev.x - e.movementX / prev.zoom,
        y: prev.y - e.movementY / prev.zoom,
      }));
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMouseMoveWithLeftClick(e);
    }
    const worldPos = boardUtils.screenToWorldPosition(
      e.clientX,
      e.clientY,
      cameraState
    );
    const gridPos = boardUtils.worldToGridCoordinates(worldPos.x, worldPos.y);

    setHighlightedCell(gridPos);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setCameraState((prev) => ({
      ...prev,
      zoom: prev.zoom * (e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR),
    }));
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    if (!gameState) return;

    const worldPos = boardUtils.screenToWorldPosition(
      e.clientX,
      e.clientY,
      cameraState
    );
    const gridPos = boardUtils.worldToGridCoordinates(worldPos.x, worldPos.y);

    const tokens = gameState.tokens;

    for (const token of tokens) {
      if (token.x === gridPos.x && token.y === gridPos.y) {
        setSelectedToken(token);
        setIsDragging(true);
        break;
      }
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (selectedToken && isDragging) {
      const worldPos = boardUtils.screenToWorldPosition(
        e.clientX,
        e.clientY,
        cameraState
      );
      const gridPos = boardUtils.worldToGridCoordinates(worldPos.x, worldPos.y);

      socket.emit("MOVE_TOKEN", { tokenId: selectedToken.id, to: gridPos });
    }

    setIsDragging(false);
    setSelectedToken(null);
  };

  return (
    <main className="w-full h-full">
      <header className="z-1 h-10 bg-gray-900 text-white flex items-center px-4 opacity-90">
        <h1 className="text-xl font-bold">VTT Client</h1>
      </header>
      <aside className="z-1 fixed left-0 h-full w-64 bg-[#CBB994] text-white flex flex-col p-2 opacity-90 gap-2">
        {gameState?.tokens.map((token) => (
          <CharacterListCard
            key={token.id}
            src={token.src}
            name={token.name}
            currentHealth={10}
            maxHealth={16}
            ac={16}
          />
        ))}
      </aside>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-[-1]"
        style={{ display: "block" }}
        onWheel={onWheel}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
      <aside className="fixed bottom-2 right-2 flex gap-1">
        <StatusWidget className="text-white">
          XY: {cameraState.x.toFixed(0)}, {cameraState.y.toFixed(0)}
        </StatusWidget>
        <StatusWidget className="text-white">
          Z: {cameraState.zoom.toFixed(2)}
        </StatusWidget>
        <StatusWidget
          className={
            connectionStatus === "CONNECTED" ? "text-green-300" : "text-red-300"
          }
        >
          {connectionStatus}
        </StatusWidget>
      </aside>
    </main>
  );
}
