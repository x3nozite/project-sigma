import Konva from "konva";
import type { LineType, ToolType } from "../types";
import type { RefObject } from "react";
import type { Vector2d } from "konva/lib/types";
import { getRelativePointerPosition } from "./drawTool";

export function handleEraseLinesMouseDown(setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>) {
  setIsDrawing(true);
}

export function handleEraseLinesMouseMove(stage: RefObject<Konva.Stage | null>, tool: ToolType, layer: RefObject<Konva.Layer | null>, setLines: React.Dispatch<React.SetStateAction<LineType[]>>, isDeleting: boolean) {
  if (tool !== "eraser" || !isDeleting) return;

  //find lines in intersection with mouse, then remove it
  const pos = getRelativePointerPosition(stage.current);
  if (!pos) return;
  const line = layer.current?.getIntersection(pos as Vector2d);
  if (!line) return;

  console.log(line.id());

  setLines(prev => prev.filter(ln => ln.id !== line.id()))
}

export function handleEraseLinesMouseUp(setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>) {
  setIsDrawing(false);
}
