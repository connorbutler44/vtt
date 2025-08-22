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
