import { GameState, GridPosition, Token } from "@vtt/shared/types";
import * as constants from "./constants";

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

export const draw = (
  canvas: HTMLCanvasElement,
  gameState: GameState,
  cameraState: CameraState,
  selectedToken: Token | null,
  isDragging: boolean,
  highlightedCell: GridPosition | null
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function renderFrame() {
    prepareCanvas(canvas, cameraState);

    drawBoard(canvas, highlightedCell);

    drawTokens(canvas, gameState, selectedToken, isDragging);
  }
  requestAnimationFrame(renderFrame);
};

const prepareCanvas = (canvas: HTMLCanvasElement, cameraState: CameraState) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(cameraState.zoom, cameraState.zoom);
  ctx.translate(-cameraState.x, -cameraState.y);
};

const drawBoard = (
  canvas: HTMLCanvasElement,
  highlightedCell: GridPosition | null
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  for (let i = 0; i < constants.COLS; i++) {
    for (let j = 0; j < constants.ROWS; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? "#e2e2e2" : "#b8b8b8";
      ctx.fillRect(
        i * constants.CELL_WIDTH,
        j * constants.CELL_HEIGHT,
        constants.CELL_WIDTH,
        constants.CELL_HEIGHT
      );

      if (
        highlightedCell &&
        highlightedCell.x === i &&
        highlightedCell.y === j
      ) {
        ctx.strokeStyle = "#eef362ff";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          i * constants.CELL_WIDTH,
          j * constants.CELL_HEIGHT,
          constants.CELL_WIDTH,
          constants.CELL_HEIGHT
        );
      }
    }
  }
};

const drawTokens = (
  canvas: HTMLCanvasElement,
  gameState: GameState,
  selectedToken: Token | null,
  isDragging: boolean
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  for (const token of gameState.tokens) {
    const tokenIsDragging =
      isDragging && selectedToken && selectedToken.id === token.id;

    ctx.globalAlpha = tokenIsDragging ? 0.5 : 1.0;

    const { id, x, y, name, src } = token;

    const img = loadImage(src);

    ctx.drawImage(
      img,
      x * constants.CELL_HEIGHT + constants.CELL_HEIGHT * 0.1,
      y * constants.CELL_HEIGHT + constants.CELL_HEIGHT * 0.1,
      constants.CELL_WIDTH * 0.8,
      constants.CELL_HEIGHT * 0.8
    );

    if (tokenIsDragging && selectedToken) {
      ctx.drawImage(
        img,
        selectedToken.x + constants.CELL_HEIGHT * 0.1,
        selectedToken.y + constants.CELL_HEIGHT * 0.1,
        constants.CELL_WIDTH * 0.8,
        constants.CELL_HEIGHT * 0.8
      );
    }
  }
};

const tokenImgCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): HTMLImageElement {
  if (tokenImgCache.has(src)) {
    return tokenImgCache.get(src)!;
  } else {
    const img = new Image();
    img.src = src;
    tokenImgCache.set(src, img);
    return img;
  }
}
