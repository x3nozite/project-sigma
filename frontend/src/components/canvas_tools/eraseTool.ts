import Konva from "konva";
import type { ShapeType, ToolType } from "../types";
import type { RefObject } from "react";
import type { Vector2d } from "konva/lib/types";
import { getRelativePointerPosition } from "./drawTool";

const ERASE_RADIUS = 20;

export function handleEraseLinesMouseDown(setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>) {
  setIsDrawing(true);
}

function isLineNearPointer(points: number[], pointer: Vector2d, radius: number) {
  for (let i = 0; i < points.length - 2; i += 2) {
    const x1 = points[i], y1 = points[i + 1];
    const x2 = points[i + 2], y2 = points[i + 3];
    const dist = pointToSegmentDistance(pointer.x, pointer.y, x1, y1, x2, y2);
    if (dist < radius) return true;
  }
  return false;
}

function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

export function handleEraseLinesMouseMove(stage: RefObject<Konva.Stage | null>, tool: ToolType, layer: RefObject<Konva.Layer | null>, setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>, isDeleting: boolean) {
  if (tool !== "eraser" || !isDeleting) return;

  //find lines in intersection with mouse, then remove it
  const pos = getRelativePointerPosition(stage.current);
  if (!pos) return;

  setShapes(prev => prev.filter(ln => {
    if (ln.shape === "line") return !isLineNearPointer(ln.points, pos, ERASE_RADIUS);
    return true;
  }))
}

export function handleEraseLinesMouseUp(setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>) {
  setIsDrawing(false);
}
