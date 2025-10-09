import { Stage, Layer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import type { RectType, ArrowType } from "./types";
import ArrowShape from "./ArrowShape";
import { handleDragStart, handleDragMove, handleDragEnd } from "./utilities/DragHandler";
import { arrowMovement } from "./ArrowShape";
import RectLayer from "./RectLayer";
import Konva from "konva";

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
      const rectGroup = mainLayer.current?.findOne(`#group-${r.id}`);
      const rect = mainLayer.current?.findOne(`#${r.id}`);
      if (!rectGroup || !rect) return;

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

      rectGroup.on("dragmove", (e) => {
        const sourceRect = e.source;
        if (!sourceRect || rectGroup === sourceRect || rect.fill() === "green") return;

        rect.fill("green");
      })

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

        rect.fill("white");

        const dx = rectGroup.x() - sourceRect.x();
        const dy = rectGroup.y() - sourceRect.y();
        const dist = Math.sqrt(dx * dx + dy * dy);
        const vectorX = dx / dist;
        const vectorY = dy / dist;
        const offset = 100;

        setRects((prev) => {
          return prev.map((rectangle) => {
            if ("group-" + rectangle.id === e.source.id()) {
              return {
                ...rectangle,
                parents: [...rectangle.parents, rectGroup.id()], x: rectangle.x + -offset * vectorX, y: rectangle.y + -offset * vectorY
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
        addConnector(e.source, rectGroup);
      });
    });
  });

  return (
    <>
      <div className="canvas">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer ref={arrowLayer}>
            <ArrowShape connectors={connectors} mainLayer={mainLayer} />
          </Layer>

          <Layer ref={mainLayer}>
            <RectLayer
              rects={rects}
              setRects={setRects}
              onDragStart={(e) => handleDragStart(e, tool, tempLayer)}
              onDragMove={(e) => {
                handleDragMove(e, mainLayer, prevShape, tool)
                arrowMovement(connectors, mainLayer, tempLayer, arrowLayer);
              }}
              onDragEnd={(e) => {
                setRects(
                  rects.map((rect) =>
                    "group-" + rect.id === e.target.id()
                      ? { ...rect, x: e.target.x(), y: e.target.y() }
                      : rect
                  )
                );

                handleDragEnd(e, mainLayer, tool, prevShape);
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
