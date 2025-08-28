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
export function worldToGridCoordinates(worldX: number, worldY: number) {
  return {
    x: Math.floor(worldX / CELL_WIDTH),
    y: Math.floor(worldY / CELL_HEIGHT),
  };
}
