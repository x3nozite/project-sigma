import type { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import type React from "react";
import type { RefObject } from "react";
import type { SelectionRectType, ShapeType } from "../types";
import { getRelativePointerPosition } from "./drawTool";
import { lineIntersectsRect } from "../utilities/lineIntersect";

// function getCorner(pivotX: number, pivotY: number, diffX: number, diffY: number, angle: number) {
//   const distance = Math.sqrt(diffX * diffX + diffY * diffY);
//   angle += Math.atan2(diffY, diffX);
//   const x = pivotX + distance * Math.cos(angle);
//   const y = pivotY + distance * Math.sin(angle);
//   return { x, y };
// };

// const degToRad = (angle: number) => (angle / 180) * Math.PI;

// const getClientRect = (shape: ShapeType) => {
//   if (shape.behavior !== "node") return;
//   const x = shape.x; const y = shape.y;
//   const width = shape.width * (shape.scaleX ?? 1); const height = shape.height * (shape.scaleY ?? 1);
//
//   const rotation = 0;
//   const rad = degToRad(rotation);
//
//   const p1 = getCorner(x, y, 0, 0, rad);
//   const p2 = getCorner(x, y, width, 0, rad);
//   const p3 = getCorner(x, y, width, height, rad);
//   const p4 = getCorner(x, y, 0, height, rad);
//
//   const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
//   const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
//   const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
//   const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);
//
//   return {
//     x: minX,
//     y: minY,
//     width: maxX - minX,
//     height: maxY - minY,
//   };
// }

export const handleSelectMouseDown = (e: KonvaEventObject<MouseEvent>, stageRef: RefObject<Konva.Stage | null>, isSelecting: RefObject<boolean>, setSelectionRectangle: React.Dispatch<React.SetStateAction<SelectionRectType>>,) => {
  if (e.target !== e.target.getStage()) return;

  isSelecting.current = true;
  const pos = getRelativePointerPosition(stageRef.current);
  if (!pos) return;
  setSelectionRectangle({
    visible: true,
    x1: pos.x,
    y1: pos.y,
    x2: pos.x,
    y2: pos.y,
  })
};

export const handleSelectMouseMove = (stageRef: RefObject<Konva.Stage | null>, isSelecting: RefObject<boolean>, selectionRectangle: SelectionRectType, setSelectionRectangle: React.Dispatch<React.SetStateAction<SelectionRectType>>) => {
  if (!isSelecting.current) return;

  const pos = getRelativePointerPosition(stageRef.current);
  if (!pos) return;
  setSelectionRectangle({
    ...selectionRectangle,
    x2: pos.x,
    y2: pos.y
  })
};

export const handleSelectMouseUp = (isSelecting: RefObject<boolean>, selectionRectangle: SelectionRectType, setSelectionRectangle: React.Dispatch<React.SetStateAction<SelectionRectType>>, setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>, shapes: ShapeType[], mainLayer: RefObject<Konva.Layer | null>) => {
  if (!isSelecting.current) return;
  isSelecting.current = false;

  // update visibility timeout
  setTimeout(() => {
    setSelectionRectangle({
      ...selectionRectangle, visible: false
    });
  });

  const selBox = {
    x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
    y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
    width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
    height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
  };

  const selected = shapes.filter(shape => {
    if (shape.shape === "line") {
      const points = shape.points;
      return lineIntersectsRect(points, selBox);
    }

    if (!mainLayer.current) return;
    const node = mainLayer.current.findOne(`#${shape.id}`);
    if (!node) return;


    const s = node?.getClientRect();
    if (!s) return;
    return Konva.Util.haveIntersection(selBox, s);
  });

  setSelectedIds(selected.map(r => r.id));
}

export const handleStageSelectClick = (e: KonvaEventObject<MouseEvent>, selectionRectangle: SelectionRectType, selectedIds: string[], setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>) => {
  if (selectionRectangle.visible) return;

  //if clicked on empty area
  if (e.target === e.target.getStage()) {
    setSelectedIds([]);
    return;
  }

  // if clicked not our rectangle
  const group = e.target.findAncestor(".shape", true);
  if (!group || !group.hasName("shape")) return;

  const clickedId = group.attrs.shapeId;
  if (!clickedId) return;

  // is shift or ctrl pressed
  const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  const isSelected = selectedIds.includes(clickedId);

  if (!metaPressed && !isSelected) setSelectedIds([clickedId]);
  else if (metaPressed && isSelected) setSelectedIds(selectedIds.filter(id => id !== clickedId));
  else if (metaPressed && !isSelected) setSelectedIds([...selectedIds, clickedId]);
};

export const handleTransfromEnd = (e: Konva.KonvaEventObject<DragEvent>, setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>) => {
  const id = e.target.id();
  const node = e.target;

  setShapes(prevShapes => {
    const newShapes = [...prevShapes];

    const index = newShapes.findIndex(r => "group-" + r.id === id);

    if (index !== -1 && newShapes[index].behavior === "node") {
      newShapes[index] = {
        ...newShapes[index],
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      }
    }
    return newShapes;
  })
}
