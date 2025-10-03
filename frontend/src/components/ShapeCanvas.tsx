import { Stage, Layer } from "react-konva";
import Rectangle from "./Rectangle";
import { useEffect, useRef, useState } from "react";
import type { RectType, ArrowType } from "./types";
import ArrowShape from "./ArrowShape";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  tool: 'select' | 'eraser';
}

const ShapeCanvas = ({ rects, setRects, tool }: Props) => {
  const mainLayer = useRef(null);
  const prevShape = useRef(null);
  const tempLayer = useRef(null);
  const arrowLayer = useRef(null);

  const [connectors, setConnectors] = useState<ArrowType[]>([]);

  const addConnector = (from, to) => {
    setConnectors([...connectors, { id: "connector-" + connectors.length, from: from.id(), to: to.id() }])
  }

  useEffect(() => {
    if (!mainLayer.current) return;

    rects.forEach((r) => {
      const rectGroup = mainLayer.current.findOne(`#group-${r.id}`);
      const rect = mainLayer.current.findOne(`#${r.id}`);
      if (!rectGroup) return;

      rectGroup.off("drop");
      rectGroup.off("dragenter");
      rectGroup.off("dragleave");

      rectGroup.on("dragenter", (e) => {
        const sourceRect = e.source;
        if (rectGroup === sourceRect) return;
        rect.fill("green");
      });
      rectGroup.on("dragleave", (e) => {
        const sourceRect = e.source;
        if (rectGroup === sourceRect) return;
        rect.fill("white");
      });

      rectGroup.on("drop", (e) => {
        addConnector(e.source, rectGroup);
        rect.fill("white");
      })

    });
  });

  const handleDragStart = (e) => {
    if (tool === 'eraser') return;
    const shape = e.target;
    shape.moveTo(tempLayer.current);
  };

  const handleDragMove = (e) => {
    if (tool === 'eraser') return;

    arrowMovement();

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
    if (tool === "eraser") return;
    const shape = e.target;
    const stage = shape.getStage();
    const pointerPos = stage.getPointerPosition();
    const shapeOnPointer = mainLayer.current.getIntersection(pointerPos);

    if (shapeOnPointer)
      prevShape.current.fire("drop", { evt: e.evt, source: e.target }, true);

    shape.moveTo(mainLayer.current);
    prevShape.current = undefined;
  };

  const arrowMovement = () => {
    connectors.forEach(connector => {
      const fromNode = tempLayer.current.findOne(`#${connector.from}`);
      const toNode = mainLayer.current.findOne(`#${connector.to}`);
      const arrowNode = arrowLayer.current.findOne(`#${connector.id}`);


      if (!fromNode || !toNode || !arrowNode) return;

      arrowNode.points([
        fromNode.x() + fromNode.width() / 2,
        fromNode.y() + fromNode.height() / 2,
        toNode.x() + toNode.width() / 2,
        toNode.y() + toNode.height() / 2,
      ])

    })
  }

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
              onDragEnd={(e) => {
                setRects(rects.map(rect =>
                  ("group-" + rect.id) === e.target.id()
                    ? { ...rect, x: e.target.x(), y: e.target.y() }
                    : rect
                ))

                handleDragEnd(e);
              }}
              tool={tool}
            />


          </Layer>
          <Layer ref={arrowLayer}>
            <ArrowShape
              connectors={connectors}
              mainLayer={mainLayer}
            />

          </Layer>
          <Layer ref={tempLayer} />
        </Stage>
      </div>
    </>
  );
};

export default ShapeCanvas;
