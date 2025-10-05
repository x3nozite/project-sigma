import Konva from "konva";

export function handleDragStart(e: Konva.KonvaEventObject<DragEvent>, tool: string, tempLayer: any) {
  if (tool === "eraser") return;
  const shape = e.target;
  shape.moveTo(tempLayer.current);
}

export function handleDragMove(e: Konva.KonvaEventObject<DragEvent>, mainLayer: any, prevShape: any, tool: string) {
  if (tool === "eraser") return;

  const stage = e.target.getStage();
  const pointerPos = stage?.getPointerPosition();
  const shape = mainLayer.current.getIntersection(pointerPos);

  if (!prevShape.current && shape) {
    // If there is a shape in the pointer postition
    // Just entered a new shape
    prevShape.current = shape;
    shape.fire("dragenter", { evt: e.evt, source: e.target }, true);
  } else if (prevShape.current && shape && prevShape.current !== shape) {
    // Leave the shape
    prevShape.current.fire(
      "dragleave",
      { evt: e.evt, source: e.target },
      true
    );
    shape.fire("dragenter", { evt: e.evt }, true);
    prevShape.current = shape;
  } else if (prevShape.current && !shape) {
    prevShape.current.fire(
      "dragleave",
      { evt: e.evt, source: e.target },
      true
    );
    prevShape.current = undefined;
  }
}

export function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>, mainLayer: any, tool: string, prevShape: any) {
  if (tool === "eraser") return;
  const shape = e.target;
  const stage = shape.getStage();
  const pointerPos = stage?.getPointerPosition();
  const shapeOnPointer = mainLayer.current.getIntersection(pointerPos);

  if (shapeOnPointer) {
    prevShape.current.fire("drop", { evt: e.evt, source: e.target }, true);
  }
  shape.moveTo(mainLayer.current);
  prevShape.current = undefined;

}
