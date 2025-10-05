import { Stage, Layer } from "react-konva";
import Rectangle from "./Rectangle";
import { useEffect, useRef, useState } from "react";
import type { RectType, ArrowType } from "./types";
import ArrowShape from "./ArrowShape";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  tool: "select" | "eraser";
}

const ShapeCanvas = ({ rects, setRects, tool }: Props) => {
  const mainLayer = useRef(null);
  const prevShape = useRef(null);
  const tempLayer = useRef(null);
  const arrowLayer = useRef(null);

  const [connectors, setConnectors] = useState<ArrowType[]>([]);

  const addConnector = (from, to) => {
    setConnectors([
      ...connectors,
      { id: "connector-" + connectors.length, from: from.id(), to: to.id() },
    ]);
  };

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
        if (!sourceRect) return;
        if (rectGroup === sourceRect) return;
        if (rect.fill() === "green") return;

        if (
          r.children.includes(sourceRect.id()) ||
          r.parents.includes(sourceRect.id())
        )
          return;

        rect.fill("green");
      });
      rectGroup.on("dragleave", (e) => {
        const sourceRect = e.source;
        if (rectGroup === sourceRect) return;
        rect.fill("white");
      });

      rectGroup.on("drop", (e) => {
        const sourceRect = e.source;
        if (!sourceRect) return;
        if (
          r.children.includes(sourceRect.id()) ||
          r.parents.includes(sourceRect.id())
        )
          return;

        addConnector(e.source, rectGroup);
        rect.fill("white");

        setRects((prev) => {
          return prev.map((rectangle) => {
            if ("group-" + rectangle.id === e.source.id()) {
              return {
                ...rectangle,
                parents: [...rectangle.parents, rectGroup.id()],
              };
            }
            if ("group-" + rectangle.id === rectGroup.id()) {
              return {
                ...rectangle,
                children: [...rectangle.children, e.source.id()],
              };
            }
            return rectangle;
          });
        });
      });
    });
  });

  const handleDragStart = (e) => {
    if (tool === "eraser") return;
    const shape = e.target;
    shape.moveTo(tempLayer.current);
  };

  const handleDragMove = (e) => {
    if (tool === "eraser") return;

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

    if (shapeOnPointer) {
      prevShape.current.fire("drop", { evt: e.evt, source: e.target }, true);
    }
    shape.moveTo(mainLayer.current);
    prevShape.current = undefined;
  };

  const arrowMovement = () => {
    connectors.forEach((connector) => {
      if (!mainLayer.current || !tempLayer.current) return;

      const fromNode =
        tempLayer.current.findOne(`#${connector.from}`) ||
        mainLayer.current.findOne(`#${connector.from}`);
      const toNode =
        tempLayer.current.findOne(`#${connector.to}`) ||
        mainLayer.current.findOne(`#${connector.to}`);
      const arrowNode = arrowLayer.current.findOne(`#${connector.id}`);

      const fromShape =
        mainLayer.current.findOne(
          `#${connector.from.replace(/^group-/, "")}`
        ) ||
        tempLayer.current.findOne(`#${connector.from.replace(/^group-/, "")}`);
      const toShape =
        mainLayer.current.findOne(`#${connector.to.replace(/^group-/, "")}`) ||
        tempLayer.current.findOne(`#${connector.to.replace(/^group-/, "")}`);

      if (!fromNode || !toNode || !arrowNode || !fromShape || !toShape) return;

      const dx = toNode.x() - fromNode.x();
      const dy = toNode.y() - fromNode.y();
      const angle = Math.atan2(-dy, dx);

      const radius = 80;


      arrowNode.points([
        fromNode.x() + fromShape.width() / 2 + -radius * Math.cos(angle + Math.PI),
        fromNode.y() + fromShape.height() / 2 + radius * Math.sin(angle + Math.PI),
        toNode.x() + toShape.width() / 2 - radius * Math.cos(angle),
        toNode.y() + toShape.height() / 2 + radius * Math.sin(angle)
      ]);
    });
  };

  return (
    <>
      <div className="canvas">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer ref={arrowLayer}>
            <ArrowShape connectors={connectors} mainLayer={mainLayer} />
          </Layer>

          <Layer ref={mainLayer}>
            <Rectangle
              rects={rects}
              setRects={setRects}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={(e) => {
                setRects(
                  rects.map((rect) =>
                    "group-" + rect.id === e.target.id()
                      ? { ...rect, x: e.target.x(), y: e.target.y() }
                      : rect
                  )
                );

                handleDragEnd(e);
              }}
              tool={tool}
            />
          </Layer>
          <Layer ref={tempLayer} />
        </Stage>
      </div>
    </>
  );
};

export default ShapeCanvas;
