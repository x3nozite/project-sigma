import Konva from "konva";
import type { LineType, ShapeType, ToolType } from "../types";
import { simplifyLine } from "../utilities/simplifyLine";

export const drawingLineRef = {
  current: null as Konva.Line | null
};

export function getRelativePointerPosition(stage: Konva.Stage | null) {
  if (!stage) return null;
  const pointer = stage.getPointerPosition();
  if (!pointer) return null;

  const transform = stage.getAbsoluteTransform().copy().invert();
  return transform.point(pointer);
}

export function handleStageMouseDown(
  stage: Konva.Stage | null,
  tool: ToolType,
  strokeColor: string
) {
  if (tool !== "draw" || !stage) return;

  const pos = getRelativePointerPosition(stage);
  if (!pos) return;

  const layer = stage.findOne("Layer") as Konva.Layer;

  const line = new Konva.Line({
    points: [pos.x, pos.y],
    stroke: strokeColor,
    strokeWidth: 4,
    lineCap: "round",
    lineJoin: "round",
    listening: false,
  });

  layer.add(line);
  drawingLineRef.current = line;
}

export function handleStageMouseMove(
  stage: Konva.Stage | null,
  tool: ToolType
) {
  if (tool !== "draw") return;
  if (!drawingLineRef.current || !stage) return;

  const pos = getRelativePointerPosition(stage);
  if (!pos) return;

  const line = drawingLineRef.current;
  const points = line.points();

  line.points([...points, pos.x, pos.y]);
  line.getLayer()?.batchDraw();
}

export function handleStageMouseUp(
  strokeColor: string,
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>
) {
  const line = drawingLineRef.current;
  if (!line) return;

  const rawPoints = line.points();
  const simplifiedPoints = simplifyLine(rawPoints, 1.5);

  const newLine: LineType = {
    shape: "line",
    behavior: "decor",
    id: "line-" + Date.now(),
    color: "black",
    points: simplifiedPoints,
    stroke: strokeColor,
    strokeWidth: 4,
    scaleX: 1,
    scaleY: 1,
  };

  setShapes((prev) => [...prev, newLine]);

  line.destroy();
  drawingLineRef.current = null;
}
