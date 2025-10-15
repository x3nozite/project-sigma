import { Stage, Layer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import type { RectType, ArrowType } from "./types";
import type { DragEventWithSource } from "./eventTypes";
import ArrowShape from "./ArrowShape";
import {
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  handleStageDragStart,
  handleStageDragEnd,
} from "./utilities/DragHandler";
import { arrowMovement } from "./utilities/ArrowFunction.ts";
import RectLayer from "./RectLayer";
import Konva from "konva";
import { handleZoomWithScroll } from "./utilities/zoom.ts";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  tool: "select" | "eraser";
  zoom: number;
  setZoomValue: React.Dispatch<React.SetStateAction<number>>;
}

const ShapeCanvas = ({ rects, setRects, tool, setZoomValue, zoom }: Props) => {
  const mainLayer = useRef<Konva.Layer | null>(null!);
  const prevShape = useRef<Konva.Shape | null>(null!);
  const tempLayer = useRef<Konva.Layer | null>(null!);
  const arrowLayer = useRef<Konva.Layer | null>(null!);
  const stageRef = useRef<Konva.Stage | null>(null!);
  const [connectors, setConnectors] = useState<ArrowType[]>([]);

  const addConnector = (from: Konva.Node, to: Konva.Node) => {
    setConnectors([
      ...connectors,
      { id: "connector-" + connectors.length, from: from.id(), to: to.id() },
    ]);
  };
  useEffect(() => {
    if (!mainLayer.current) return;

    rects.forEach((r) => {
      const rectGroup = mainLayer.current?.findOne(`#group-${r.id}`);
      const rect = mainLayer.current?.findOne(`#${r.id}`) as Konva.Rect;
      if (!rectGroup || !rect) return;

      rectGroup.off("drop");
      rectGroup.off("dragenter");
      rectGroup.off("dragleave");

      rectGroup.on("dragenter", (e) => {
        const sourceRect = (e as DragEventWithSource).source;
        if (!sourceRect) return;
        if (rectGroup === sourceRect) return;
        if (rect.fill() === "green") return;

        if (
          r.children.includes(sourceRect.id()) ||
          r.parents.includes(sourceRect.id())
        )
          return;

        rect.fill("#b9f8cf");
      });

      rectGroup.on("dragmove", (e) => {
        const sourceRect = (e as DragEventWithSource).source;
        if (
          !sourceRect ||
          rectGroup === sourceRect ||
          rect.fill() === "#b9f8cf"
        )
          return;

        rect.fill("#b9f8cf");
      });

      rectGroup.on("dragleave", (e) => {
        const sourceRect = (e as DragEventWithSource).source;
        if (rectGroup === sourceRect) return;
        rect.fill("white");
      });

      rectGroup.on("drop", (e) => {
        const sourceRect = (e as DragEventWithSource).source;
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
            if (
              "group-" + rectangle.id ===
              (e as DragEventWithSource).source.id()
            ) {
              return {
                ...rectangle,
                parents: [...rectangle.parents, rectGroup.id()],
                x: rectangle.x + -offset * vectorX,
                y: rectangle.y + -offset * vectorY,
              };
            }
            if ("group-" + rectangle.id === rectGroup.id()) {
              return {
                ...rectangle,
                children: [
                  ...rectangle.children,
                  (e as DragEventWithSource).source.id(),
                ],
              };
            }
            return rectangle;
          });
        });
        addConnector((e as DragEventWithSource).source, rectGroup);
      });
    });
  });

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        draggable
        onDragStart={(e) => handleStageDragStart(e, mainLayer, arrowLayer)}
        onDragEnd={(e) => handleStageDragEnd(e, mainLayer, arrowLayer)}
        onWheel={(e) => handleZoomWithScroll(stageRef, e, setZoomValue)}
        scaleX={zoom / 100}
        scaleY={zoom / 100}
      >
        <Layer ref={arrowLayer}>
          <ArrowShape connectors={connectors} mainLayer={mainLayer} />
        </Layer>

        <Layer ref={mainLayer}>
          <RectLayer
            rects={rects}
            setRects={setRects}
            onDragStart={(e) => handleDragStart(e, tool, tempLayer)}
            onDragMove={(e) => {
              handleDragMove(e, mainLayer, prevShape, tool);
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
    </>
  );
};

export default ShapeCanvas;
