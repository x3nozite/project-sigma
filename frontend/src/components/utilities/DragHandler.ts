import Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import type { RefObject } from "react";

export function handleDragStart(e: Konva.KonvaEventObject<DragEvent>, tool: string, tempLayer: RefObject<Konva.Layer | null>) {
  if (tool === "eraser") return;
  const shape = e.target;
  shape.moveTo(tempLayer.current);
}

export function handleDragMove(e: Konva.KonvaEventObject<DragEvent>, mainLayer: RefObject<Konva.Layer | null>, prevShape: RefObject<Konva.Shape | null>, tool: string) {
  if (tool === "eraser") return;

  const stage = e.target.getStage();
  const pointerPos = stage?.getPointerPosition();
  const shape = mainLayer.current?.getIntersection(pointerPos as Vector2d);

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
    prevShape.current = null;
  }
}

export function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>, mainLayer: RefObject<Konva.Layer | null>, tool: string, prevShape: RefObject<Konva.Shape | null>) {
  if (tool === "eraser") return;
  const shape = e.target;
  const stage = shape.getStage();
  const pointerPos = stage?.getPointerPosition();
  const shapeOnPointer = mainLayer.current?.getIntersection(pointerPos as Vector2d);

  if (shapeOnPointer) {
    prevShape.current?.fire("drop", { evt: e.evt, source: e.target }, true);
  }
  shape.moveTo(mainLayer.current);
  prevShape.current = null;

}

export function handleStageDragStart(e: Konva.KonvaEventObject<DragEvent>, mainLayer: RefObject<Konva.Layer | null>, arrowLayer: RefObject<Konva.Layer | null>) {
  if (e.target !== e.target.getStage()) return;
  if (!mainLayer || !arrowLayer) return;
  // if (mainLayer) {
  //   mainLayer.current?.getChildren().forEach((child) => {
  //     child.cache();
  //   })
  //   //mainLayer.current?.cache({ width: stage?.width(), height: stage?.height() });
  // }
  // if (arrowLayer) {
  //   arrowLayer.current?.getChildren().forEach((child) => {
  //     child.cache();
  //   })
  //   //arrowLayer.current?.cache({ width: stage?.width(), height: stage?.height() });
  // }
}
export function handleStageDragEnd(e: Konva.KonvaEventObject<DragEvent>, mainLayer: RefObject<Konva.Layer | null>, arrowLayer: RefObject<Konva.Layer | null>) {
  if (e.target !== e.target.getStage()) return;
  if (!mainLayer || !arrowLayer) return;
  // if (mainLayer) {
  //   mainLayer.current?.getChildren().forEach(child => {
  //     child.clearCache();
  //   })
  //   mainLayer.current?.batchDraw();
  // }
  // if (arrowLayer) {
  //   arrowLayer.current?.getChildren().forEach(child => {
  //     child.clearCache()
  //   })
  //   arrowLayer.current?.batchDraw();
  // }
}
