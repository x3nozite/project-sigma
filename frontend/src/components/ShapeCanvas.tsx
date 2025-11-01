import { Stage, Layer, Rect, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import type { RectType, ArrowType, ToolType, ShapeType, TodoType, LineType, SelectionRectType } from "./types";
import type { DragEventWithSource } from "./eventTypes";
import ArrowShape from "./ArrowShape";
import { handleDragStart, handleDragMove, handleDragEnd, handleStageDragStart, handleStageDragEnd }
  from "./utilities/DragHandler";
import { arrowMovement } from "./utilities/ArrowFunction.ts";
import RectLayer from "./RectLayer";
import Konva from "konva";
import { handleZoomWithScroll } from "./utilities/zoom.ts";
import { changeCursor } from "./utilities/ChangeCursor.ts";
import TodoLayer from "./TodoLayer.tsx";
import { handleStageMouseDown, handleStageMouseMove, handleStageMouseUp } from "./canvas_tools/drawTool.ts";
import LineLayer from "./LineLayer.tsx";
import { handleEraseLinesMouseMove, handleEraseLinesMouseDown, handleEraseLinesMouseUp } from "./canvas_tools/eraseTool.ts";
import { handleSelectMouseDown, handleSelectMouseMove, handleSelectMouseUp } from "./canvas_tools/selectTool.ts";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  connectors: ArrowType[];
  setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>;
  lines: LineType[];
  setLines: React.Dispatch<React.SetStateAction<LineType[]>>;
  tool: ToolType;
  zoom: number;
  setZoomValue: React.Dispatch<React.SetStateAction<number>>;
  strokeColor?: string;
  onShapeClick: (shape: ShapeType | null) => void;
}

const ShapeCanvas = ({ rects, setRects, todos, setTodos, tool, setZoomValue, zoom, connectors, setConnectors, lines, setLines, strokeColor = "#000", onShapeClick }: Props) => {
  const mainLayer = useRef<Konva.Layer | null>(null!);
  const prevShape = useRef<Konva.Shape | null>(null!);
  const tempLayer = useRef<Konva.Layer | null>(null!);
  const arrowLayer = useRef<Konva.Layer | null>(null!);
  const lineLayer = useRef<Konva.Layer | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null!);

  const [mouseHeldDown, setMouseHeldDown] = useState<boolean>(false);
  const idCounter = useRef(1);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionRectangle, setSelectionRectangle] = useState<SelectionRectType>({
    visible: false, x1: 0, x2: 0, y1: 0, y2: 0
  })
  const isSelecting = useRef(false);
  const transformerRef = useRef<Konva.Transformer>(null);
  const rectRefs = useRef(new Map());

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
        if (!sourceRect || rectGroup === sourceRect || rect.fill() === "green") return;

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
        if (!sourceRect || rectGroup === sourceRect || rect.fill() === "#b9f8cf")
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
        if (!sourceRect || r.children.includes(sourceRect.id()) || r.parents.includes(sourceRect.id())) return;
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

    //update transformer when selection changes
    if (selectedIds.length && transformerRef.current) {
      const nodes = selectedIds.map(id => rectRefs.current.get(id)).filter(node => node);

      transformerRef.current.nodes(nodes);
    } else if (transformerRef.current) transformerRef.current.nodes([]);
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
      if (!childInArray) return;
      childInArray.parents = "";
    })
  }

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
        draggable={tool === "hand"}
        onDragStart={(e) => handleStageDragStart(e, mainLayer, arrowLayer)}
        onDragEnd={(e) => handleStageDragEnd(e, mainLayer, arrowLayer)}
        onWheel={(e) => handleZoomWithScroll(stageRef, e, setZoomValue)}
        onMouseDown={(e) => {
          if (tool === "draw") handleStageMouseDown(stageRef.current, tool, strokeColor, setLines, setMouseHeldDown, idCounter);
          if (tool === "eraser") handleEraseLinesMouseDown(setMouseHeldDown);
          if (tool === "select") handleSelectMouseDown(e, stageRef, isSelecting, setSelectionRectangle);
        }}
        onMouseMove={() => {
          if (tool === "draw") handleStageMouseMove(stageRef.current, tool, setLines, mouseHeldDown);
          if (tool === "eraser") handleEraseLinesMouseMove(stageRef, tool, lineLayer, setLines, mouseHeldDown);
          if (tool === "select") handleSelectMouseMove(stageRef, isSelecting, selectionRectangle, setSelectionRectangle);
        }}
        onMouseUp={() => {
          if (tool === "draw") handleStageMouseUp(mouseHeldDown, setMouseHeldDown);
          if (tool === "eraser") handleEraseLinesMouseUp(setMouseHeldDown);
          if (tool === "select") handleSelectMouseUp(isSelecting, selectionRectangle, setSelectionRectangle, setSelectedIds, rects);
        }}
        scaleX={zoom / 100}
        scaleY={zoom / 100}
        style={{ cursor: changeCursor(tool) }}
      >
        <Layer ref={arrowLayer}>
          <ArrowShape connectors={connectors} mainLayer={mainLayer} />
        </Layer>

        <LineLayer
          lines={lines}
          ref={lineLayer}
        />

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
          <TodoLayer
            todos={todos}
            setTodos={setTodos}
          />
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}

          />
        </Layer>
        <Layer ref={tempLayer}>
          {selectionRectangle.visible && (
            <Rect
              x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
              y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
              width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
              height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
              fill="rgba(0,0,255,0.15)"
              stroke={"rgba(70,70,120,0.2)"}
              strokeWidth={2}
            />
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default ShapeCanvas;
