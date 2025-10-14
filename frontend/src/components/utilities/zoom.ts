import type { RefObject } from "react";
import Konva from "konva";

export function handleZoomWithScroll(stageRef: RefObject<Konva.Stage | null>, e: Konva.KonvaEventObject<WheelEvent>, setZoomValue: React.Dispatch<React.SetStateAction<number>>) {
  if (!e.evt.ctrlKey) return;
  e.evt.preventDefault();
  const stage = stageRef.current;
  const pointer = stage?.getPointerPosition();
  if (!pointer || !stage) return;
  const oldScale = stage.scaleX();

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale
  }

  const direction = e.evt.deltaY > 0 ? -1 : 1;

  const scaleBy = 1.05;
  const newScale = direction > 0 ? Math.min(oldScale * scaleBy, 2) : Math.max(oldScale / scaleBy, 0.5);

  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale
  }
  stage.position(newPos);
  setZoomValue(Math.round(newScale * 100));
}
