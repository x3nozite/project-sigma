import Konva from "konva";
import type { LineType, ToolType } from "../types";
import type { RefObject, SetStateAction } from "react";

export function getRelativePointerPosition(stage: Konva.Stage | null) {
  if (!stage) return null;
  const pointer = stage.getPointerPosition();
  if (!pointer) return null;

  const transform = stage.getAbsoluteTransform().copy().invert();
  return transform.point(pointer);
}

export function handleStageMouseDown(stage: Konva.Stage | null, tool: ToolType, strokeColor: string, setLines: React.Dispatch<React.SetStateAction<LineType[]>>, setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>, idCounter: RefObject<number>) {
  if (tool !== "pencil") return;
  const pos = getRelativePointerPosition(stage);
  if (!pos) return;
  setIsDrawing(true);

  const newLine: LineType = {
    id: "line-" + idCounter.current,
    points: [pos.x, pos.y],
    stroke: strokeColor,
    strokeWidth: 2
  };
  idCounter.current++;
  setLines((prev) => [...prev, newLine]);
}

export function handleStageMouseMove(stage: Konva.Stage | null, tool: ToolType, setLines: React.Dispatch<React.SetStateAction<LineType[]>>, isDrawing: boolean) {
  if (!isDrawing || tool !== "pencil") return;
  const pos = getRelativePointerPosition(stage);
  if (!pos) return;

  setLines((prev) => {
    if (prev.length === 0) return prev;
    const last = prev[prev.length - 1];

    const updatedLast = { ...last, points: [...last.points, pos.x, pos.y] };

    return [...prev.slice(0, -1), updatedLast];
  });
}

export function handleStageMouseUp(isDrawing: boolean, setIsDrawing: React.Dispatch<SetStateAction<boolean>>) {
  if (isDrawing) setIsDrawing(false);
}
