import { Server, Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";

export interface Token {
  id: string;
  x: number;
  y: number;
  src: string;
  name: string;
}

export interface GameState {
  tokens: Token[];
}

export const gameState: GameState = {
  tokens: [
    { id: "t1", x: 3, y: 3, src: "./barsik.png", name: "Barsik" },
    { id: "t2", x: 4, y: 4, src: "./shadowheart.png", name: "Shadowheart" },
    { id: "t3", x: 5, y: 5, src: "./Scratch.png", name: "Scratch" },
    { id: "t4", x: 7, y: 3, src: "./owlbearcub.png", name: "Owlbear Cub" },
  ],
};

export interface ClientToServerEvents {
  JOIN_GAME: () => void;
  MOVE_TOKEN: (data: { tokenId: string; to: { x: number; y: number } }) => void;
}

export interface ServerToClientEvents {
  GAME_STATE: (state: GameState) => void;
  TOKEN_MOVED: (data: {
    tokenId: string;
    to: { x: number; y: number };
  }) => void;
  connect: () => void;
}

export type ClientToServerEventKey = keyof ClientToServerEvents;
export type ServerToClientEventKey = keyof ServerToClientEvents;

export type VttServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  never,
  never
>;

export type VttServerSocket = ServerSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  never,
  never
>;
export type VttClientSocket = ClientSocket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export interface GridPosition {
  x: number;
  y: number;
}
