import Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import type { RefObject } from "react";
import type { ShapeType } from "../types";

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

export function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>, mainLayer: RefObject<Konva.Layer | null>, tool: string, prevShape: RefObject<Konva.Shape | null>, setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>) {
  if (tool === "eraser") return;
  const shape = e.target;
  const stage = shape.getStage();
  const pointerPos = stage?.getPointerPosition();
  const shapeOnPointer = mainLayer.current?.getIntersection(pointerPos as Vector2d);

  if (shapeOnPointer && !shapeOnPointer.getAttr("temporary")) {
    prevShape.current?.fire("drop", { evt: e.evt, source: e.target }, true);
  }
  shape.moveTo(mainLayer.current);
  prevShape.current = null;

  const id = e.target.id();
  setShapes(prevShapes => {
    const newShapes = [...prevShapes];
    const index = newShapes.findIndex(r => "group-" + r.id === id);
    if (index !== -1 && newShapes[index].behavior === "node") {
      newShapes[index] = {
        ...newShapes[index],
        x: e.target.x(),
        y: e.target.y()
      };
    } else if (index !== -1 && newShapes[index].shape === "line") {
      const lines = e.target as Konva.Line;

      const dx = lines.x();
      const dy = lines.y();
      newShapes[index] = {
        ...newShapes[index], points: newShapes[index].points.map((p: number, i: number) => (i % 2 === 0 ? p + dx : p + dy))
      };

      lines.x(0); lines.y(0);
    }
    return newShapes;
  })
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
