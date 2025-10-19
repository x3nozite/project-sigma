import { Stage, Layer, Line } from "react-konva";
import { useEffect, useRef, useState } from "react";
import type { RectType, ArrowType, ToolType, ShapeType } from "./types";
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
import { changeCursor } from "./utilities/ChangeCursor.ts";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  connectors: ArrowType[];
  setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>;
  tool: ToolType;
  zoom: number;
  setZoomValue: React.Dispatch<React.SetStateAction<number>>;
  strokeColor?: string;
  onShapeClick: (shape: ShapeType | null) => void;
}

const ShapeCanvas = ({ rects, setRects, tool, setZoomValue, zoom, connectors, setConnectors, strokeColor = "#000", onShapeClick }: Props) => {
  const mainLayer = useRef<Konva.Layer | null>(null!);
  const prevShape = useRef<Konva.Shape | null>(null!);
  const tempLayer = useRef<Konva.Layer | null>(null!);
  const arrowLayer = useRef<Konva.Layer | null>(null!);
  const stageRef = useRef<Konva.Stage | null>(null!);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawLines, setDrawLines] = useState<{ id: string; points: number[]; stroke?: string; strokeWidth?: number }[]>([]);

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

        const sourceRectInArray = rects.find(rectToFind => ("group-" + rectToFind.id === sourceRect.id()));
        if (sourceRectInArray?.parents !== "") return;

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
        console.log(connectors.length);
        const sourceRect = (e as DragEventWithSource).source;
        if (!sourceRect) return;
        if (
          r.children.includes(sourceRect.id()) ||
          r.parents.includes(sourceRect.id())
        )
          return;
        const sourceRectInArray = rects.find(rectToFind => ("group-" + rectToFind.id === sourceRect.id()));
        if (sourceRectInArray?.parents !== "") return;

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
                parents: rectGroup.id(),
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

  const checkParentVisible = (rect: RectType) => {
    //find parent
    const parentInArray = rects.find(r => ("group-" + r.id) === rect.parents);
    const parentNode = mainLayer.current?.findOne(`#${rect.parents}`);
    if (!parentNode || !parentInArray) return false;

    return ((parentNode as Konva.Group).getChildren()[0].visible());
  }

  const collapseChild = (rect: RectType, currentlyCollapsed: boolean) => {
    if (rect.children.length === 0) return;
    rect.children.forEach((child) => {
      const childInArray = rects.find(r => ("group-" + r.id) === child);
      if (!childInArray) return;

      const rectGroup = mainLayer.current?.findOne(`#${child}`);
      if (!rectGroup) return;
      rectGroup.visible(currentlyCollapsed);

      // set arrow's visibility
      const connectorReact = connectors.find(connector => {
        if (connector.from === child) return connector;
      });
      if (!connectorReact) return;

      // find the node
      const connectorNode = arrowLayer.current?.findOne(`#${connectorReact.id}`);
      if (!connectorNode) return;
      connectorNode.visible(currentlyCollapsed);

      if (!checkParentVisible(childInArray)) return;
      collapseChild(childInArray, currentlyCollapsed);
    })
  }

  const changeChildToOrphan = (rectId: string) => {
    const rectInArray = rects.find(r => r.id === rectId);

    rectInArray?.children.forEach(child => {
      const childInArray = rects.find(r => "group-" + r.id === child);
      console.log(childInArray);
      if (!childInArray) return;
      childInArray.parents = "";
    })
  }

  const getRelativePointerPosition = (stage: Konva.Stage | null) => {
    if (!stage) return null;
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;

    //convert cursor coordinates to stage coordinates 
    const transform = stage.getAbsoluteTransform().copy().invert();
    return transform.point(pointer);
  }

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool !== "pencil") return;
    const pos = getRelativePointerPosition(stageRef.current);
    if (!pos) return;
    setIsDrawing(true);
    const newLine = {
      id: "line-" + drawLines.length,
      points: [pos.x, pos.y],
      stroke: strokeColor,
      strokeWidth: 2,
    };
    setDrawLines((prev) => [...prev, newLine]);
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || tool !== "pencil") return;
    const pos = getRelativePointerPosition(stageRef.current);
    if (!pos) return;
    setDrawLines((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];

      /* LINES ARE REPRESENTED AS POINTS, POINTS[0, 2, 4, 6, etc] = Xi, POINTS[1, 3, 5, 7] = Yi */
      const updatedLast = { ...last, points: [...last.points, pos.x, pos.y] };


      return [...prev.slice(0, -1), updatedLast];
    });
  };

  const handleStageMouseUp = () => {
    if (isDrawing) setIsDrawing(false);
  };

  // TODO
  // Change cursor based on tool
  const handleEraserClick = (rectId: string) => {
    if (tool === "eraser") {
      connectors.forEach((connector) => {
        if (connector.to === "group-" + rectId || connector.from === "group-" + rectId) {
          setConnectors((prev) => prev.filter(c => c.id !== connector.id));
        }
      })
      changeChildToOrphan(rectId);
      setRects((prev) => prev.filter((r) => r.id !== rectId))
    }
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        draggable={tool !== "pencil"}
        onDragStart={(e) => handleStageDragStart(e, mainLayer, arrowLayer)}
        onDragEnd={(e) => handleStageDragEnd(e, mainLayer, arrowLayer)}
        onWheel={(e) => handleZoomWithScroll(stageRef, e, setZoomValue)}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        scaleX={zoom / 100}
        scaleY={zoom / 100}
        style={{ cursor: changeCursor(tool) }}
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
            collapseChild={collapseChild}
            handleEraserClick={handleEraserClick}
            onShapeClick={onShapeClick}
          />
        </Layer>
        <Layer ref={tempLayer}>
          {drawLines.map((ln) => (
            <Line
              key={ln.id}
              points={ln.points}
              stroke={ln.stroke}
              strokeWidth={ln.strokeWidth}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default ShapeCanvas;
