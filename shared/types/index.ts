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

export interface ClientEventPayloads {
  JOIN_GAME: void;
  MOVE_TOKEN: {
    tokenId: string;
    to: { x: number; y: number };
  };
}

export interface ServerEventPayloads {
  GAME_STATE: typeof gameState;
  TOKEN_MOVED: {
    tokenId: string;
    to: { x: number; y: number };
  };
  connect: void;
}

export type ClientEvent = keyof ClientEventPayloads;
export type ServerEvent = keyof ServerEventPayloads;
