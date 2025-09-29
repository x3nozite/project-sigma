import { Stage, Layer } from "react-konva";
import Rectangle from "./Rectangle";
import { useEffect, useRef } from "react";
import type { RectType } from "./types";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
}

const ShapeCanvas = ({ rects, setRects }: Props) => {
  const mainLayer = useRef(null);
  const prevShape = useRef(null);
  const tempLayer = useRef(null);

  useEffect(() => {
    if (!mainLayer.current) return;

    rects.forEach((r) => {
      const rect = mainLayer.current.findOne(`#${r.id}`);
      if (!rect) return;

      rect.off("drop");
      rect.off("dragenter");
      rect.off("dragleave");

      rect.on("dragenter", (e) => {
        const sourceRect = e.source;
        if (rect === sourceRect) return;

        setRects(prev =>
          prev.map(r =>
            r.id === rect.id()
              ? { ...r, color: "green" }
              : r
          )
        )
      });
      rect.on("dragleave", (e) => {
        const sourceRect = e.source;
        if (rect === sourceRect) return;

        setRects(prev =>
          prev.map(r =>
            r.id === rect.id()
              ? { ...r, color: "white" }
              : r
          )
        )
      });

    });
  });

  const handleDragStart = (e) => {
    const shape = e.target;
    shape.moveTo(tempLayer.current);
  };

  const handleDragMove = (e) => {
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
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
  };

  const handleDragEnd = (e) => {
    const shape = e.target;
    const stage = shape.getStage();
    const pointerPos = stage.getPointerPosition();
    const shapeOnPointer = mainLayer.current.getIntersection(pointerPos);

    if (shapeOnPointer)
      prevShape.current.fire("drop", { evt: e.evt, source: e.target }, true);

    shape.moveTo(mainLayer.current);
    prevShape.current = undefined;
  };
  return (
    <>
      <div className="canvas">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer ref={mainLayer}>
            <Rectangle
              rects={rects}
              setRects={setRects}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          </Layer>
          <Layer ref={tempLayer} />
        </Stage>
      </div>
    </>
  );
};

export default ShapeCanvas;
