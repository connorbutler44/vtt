import { CELL_HEIGHT, CELL_WIDTH } from "./constants";
import { CameraState } from "./draw";

/**
 * Converts screen coordinates to world coordinates based on camera state
 */
export function screenToWorldPosition(
  clientX: number,
  clientY: number,
  camera: CameraState
) {
  return {
    x: clientX / camera.zoom + camera.x,
    y: clientY / camera.zoom + camera.y,
  };
}

/**
 * Converts world coordinates to grid coordinates
 */
export function worldToGridCoordinates(x: number, y: number) {
  return {
    x: Math.floor(x / CELL_WIDTH),
    y: Math.floor(y / CELL_HEIGHT),
  };
}
