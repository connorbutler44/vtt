import { Server, Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";

export interface Token {
  id: string;
  x: number;
  y: number;
}

export interface GameState {
  tokens: Token[];
}

export const gameState: GameState = {
  tokens: [
    { id: "t1", x: 0, y: 0 },
    { id: "t2", x: 2, y: 3 },
    { id: "t2", x: 2, y: 3 },
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
