import Konva from "konva";
import type { LineType, ShapeType, ToolType } from "../types";
import type { SetStateAction } from "react";

export function getRelativePointerPosition(stage: Konva.Stage | null) {
  if (!stage) return null;
  const pointer = stage.getPointerPosition();
  if (!pointer) return null;

  const transform = stage.getAbsoluteTransform().copy().invert();
  return transform.point(pointer);
}

export function handleStageMouseDown(stage: Konva.Stage | null, tool: ToolType, strokeColor: string, setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>, setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>) {
  if (tool !== "draw") return;
  const pos = getRelativePointerPosition(stage);
  if (!pos) return;
  setIsDrawing(true);

  const newLine: LineType = {
    shape: "line",
    behavior: "decor",
    color: "black",
    id: "line-" + Date.now().toString(),
    points: [pos.x, pos.y],
    stroke: strokeColor,
    strokeWidth: 4
  };
  setShapes((prev) => [...prev, newLine]);
}

export function handleStageMouseMove(stage: Konva.Stage | null, tool: ToolType, setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>, isDrawing: boolean) {
  if (!isDrawing || tool !== "draw") return;
  const pos = getRelativePointerPosition(stage);
  if (!pos) return;

  setShapes((prev) => {
    if (prev.length === 0) return prev;
    const last = prev[prev.length - 1];

    if (last.behavior !== "decor") return prev;

    const updatedLast = { ...last, points: [...last.points, pos.x, pos.y] };

    return [...prev.slice(0, -1), updatedLast];
  });
}

export function handleStageMouseUp(isDrawing: boolean, setIsDrawing: React.Dispatch<SetStateAction<boolean>>) {
  if (isDrawing) setIsDrawing(false);
}
