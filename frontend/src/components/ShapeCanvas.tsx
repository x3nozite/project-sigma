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
import { handleSelectMouseDown, handleSelectMouseMove, handleSelectMouseUp, handleStageSelectClick, handleTransfromEnd } from "./canvas_tools/selectTool.ts";
import type { KonvaEventObject } from "konva/lib/Node";

interface Props {
  shapes: ShapeType[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  connectors: ArrowType[];
  setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>;
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
  zoom: number;
  setZoomValue: React.Dispatch<React.SetStateAction<number>>;
  strokeColor?: string;
  onShapeClick: (shape: ShapeType | null) => void;
}

const ShapeCanvas = ({ shapes = [], setShapes, tool, setTool, setZoomValue, zoom, connectors = [], setConnectors, strokeColor = "#000", onShapeClick }: Props) => {
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

  const addConnector = (from: Konva.Node, to: Konva.Node) => {
    setConnectors([
      ...connectors,
      { id: "connector-" + connectors.length, from: from.id(), to: to.id() },
    ]);
  };
  useEffect(() => {
    if (!mainLayer.current) return;

    shapes.forEach((s) => {
      if (s.behavior !== "node") return;
      const shapeGroup = mainLayer.current?.findOne(`#group-${s.id}`);
      const shape = mainLayer.current?.findOne(`#${s.id}`) as Konva.Shape;
      const shapeInArray = shapes.find(s => s.id === shape.id());
      if (!shapeGroup || !shape || !shapeInArray) return;

      shapeGroup.off("drop");
      shapeGroup.off("dragenter");
      shapeGroup.off("dragleave");

      shapeGroup.on("dragenter", (e) => {
        const sourceShape = (e as DragEventWithSource).source;
        if (!sourceShape || shapeGroup === sourceShape || shape.fill() === "green" || shapeInArray.shape === "todo") return;

        console.log(sourceShape.id());
        if (
          (s.shape !== "todo" && s.children.includes(sourceShape.id())) ||
          s.parents.includes(sourceShape.id())
        )
          return;

        const sourceShapeInArray = shapes.find(rectToFind => ("group-" + rectToFind.id === sourceShape.id()));
        if (sourceShapeInArray?.behavior !== "node" || sourceShapeInArray?.parents !== "") return;

        shape.fill("#b9f8cf");
      });

      shapeGroup.on("dragmove", (e) => {
        const sourceShape = (e as DragEventWithSource).source;
        if (!sourceShape || shapeGroup === sourceShape || shape.fill() === "#b9f8cf")
          return;

        shape.fill("#b9f8cf");
      });

      shapeGroup.on("dragleave", (e) => {
        const sourceShape = (e as DragEventWithSource).source;
        if (shapeGroup === sourceShape) return;
        shape.fill("white");
      });

      shapeGroup.on("drop", (e) => {
        const sourceShape = (e as DragEventWithSource).source;
        if (s.behavior !== "node" || (s.shape !== "todo" && s.children.includes(sourceShape.id())) || !sourceShape || s.parents.includes(sourceShape.id())) return;
        const sourceShapeInArray = shapes.find(rectToFind => ("group-" + rectToFind.id === sourceShape.id()));
        if (sourceShapeInArray?.behavior !== "node" || sourceShapeInArray?.parents !== "" || shapeInArray.shape === "todo") return;

        shape.fill("white");

        const dx = shapeGroup.x() - sourceShape.x();
        const dy = shapeGroup.y() - sourceShape.y();
        const dist = Math.sqrt(dx * dx + dy * dy);
        const vectorX = dx / dist;
        const vectorY = dy / dist;
        const offset = 100;

        setShapes((prev: ShapeType[]) => {
          return prev.map((shape) => {
            if (shape.behavior === "node" && "group-" + shape.id === (e as DragEventWithSource).source.id()) {
              return {
                ...shape,
                parents: shapeGroup.id(),
                x: shape.x + -offset * vectorX,
                y: shape.y + -offset * vectorY,
              };
            }
            if (shape.behavior === "node" && shape.shape != "todo" && "group-" + shape.id === shapeGroup.id()) {
              return {
                ...shape,
                children: [
                  ...shape.children,
                  (e as DragEventWithSource).source.id(),
                ],
              };
            }
            return shape;
          });
        });
        addConnector((e as DragEventWithSource).source, shapeGroup);
      });
    });

    //update transformer when selection changes
    if (selectedIds.length && transformerRef.current) {
      const nodes = selectedIds.map(id => stageRef.current?.findOne<Konva.Shape>(`#group-${id}`)).filter(Boolean) as Konva.Rect[];

      transformerRef.current.nodes(nodes);
    } else if (transformerRef.current) transformerRef.current.nodes([]);

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "1":
          setTool("hand");
          break;
        case "2":
          setTool((tool === "select") ? "hand" : "select");
          break;
        case "3":
          setTool((tool === "draw") ? "hand" : "draw");
          break;
        case "4":
          setTool((tool === "eraser") ? "hand" : "eraser");
          break;
        case "p":
          setTool((tool === "draw") ? "hand" : "draw");
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const checkParentVisible = (shape: ShapeType) => {
    if (shape.behavior !== "node") return;
    //find parent
    const parentInArray = shapes.find(s => ("group-" + s.id) === shape.parents);
    const parentNode = mainLayer.current?.findOne(`#${shape.parents}`);
    if (!parentNode || !parentInArray) return false;

    return ((parentNode as Konva.Group).getChildren()[0].visible());
  }

  const collapseChild = (shape: ShapeType, currentlyCollapsed: boolean) => {
    if (shape.behavior !== "node" || shape.shape === "todo") return;

    if (shape.children.length === 0) return;
    shape.children.forEach((child) => {
      const childInArray = shapes.find(s => ("group-" + s.id) === child);
      if (!childInArray) return;

      const shapeGroup = mainLayer.current?.findOne(`#${child}`);
      if (!shapeGroup) return;
      shapeGroup.visible(currentlyCollapsed);

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

  const changeChildToOrphan = (shapeId: string) => {
    const shapeInArray = shapes.find(s => s.id === shapeId);

    if (shapeInArray?.behavior !== "node" || shapeInArray?.shape === "todo") return;

    shapeInArray?.children.forEach(child => {
      const childInArray = shapes.find(r => "group-" + r.id === child);
      if (!childInArray || childInArray.behavior !== "node") return;
      childInArray.parents = "";
    })
  }

  const handleEraserClick = (shapeId: string) => {
    if (tool === "eraser") {
      connectors.forEach((connector) => {
        if (connector.to === "group-" + shapeId || connector.from === "group-" + shapeId) {
          setConnectors((prev) => prev.filter(c => c.id !== connector.id));
        }
      })
      changeChildToOrphan(shapeId);
      setShapes((prev: ShapeType[]) => prev.filter((r) => r.id !== shapeId))
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
          if (tool === "draw") handleStageMouseDown(stageRef.current, tool, strokeColor, setShapes, setMouseHeldDown, idCounter);
          if (tool === "eraser") handleEraseLinesMouseDown(setMouseHeldDown);
          if (tool === "select") handleSelectMouseDown(e, stageRef, isSelecting, setSelectionRectangle);
        }}
        onMouseMove={() => {
          if (tool === "draw") handleStageMouseMove(stageRef.current, tool, setShapes, mouseHeldDown);
          if (tool === "eraser") handleEraseLinesMouseMove(stageRef, tool, lineLayer, setShapes, mouseHeldDown);
          if (tool === "select") handleSelectMouseMove(stageRef, isSelecting, selectionRectangle, setSelectionRectangle);
        }}
        onMouseUp={() => {
          if (tool === "draw") handleStageMouseUp(mouseHeldDown, setMouseHeldDown);
          if (tool === "eraser") handleEraseLinesMouseUp(setMouseHeldDown);
          if (tool === "select") handleSelectMouseUp(isSelecting, selectionRectangle, setSelectionRectangle, setSelectedIds, shapes);
        }}
        onClick={(e) => {
          if (tool === "select") handleStageSelectClick(e, selectionRectangle, selectedIds, setSelectedIds);
        }}
        scaleX={zoom / 100}
        scaleY={zoom / 100}
        style={{ cursor: changeCursor(tool) }}
      >
        <Layer ref={arrowLayer}>
          <ArrowShape connectors={connectors} mainLayer={mainLayer} />
        </Layer>

        <LineLayer
          lines={shapes.filter((s: ShapeType): s is LineType => s.shape === "line")}
          ref={lineLayer}
        />

        <Layer ref={mainLayer}>
          <RectLayer
            shapes={shapes.filter((s: ShapeType): s is RectType => s.shape === "rect")}
            setShapes={setShapes}
            onDragStart={(e) => handleDragStart(e, tool, tempLayer)}
            onDragMove={(e) => {
              handleDragMove(e, mainLayer, prevShape, tool);
              arrowMovement(connectors, mainLayer, tempLayer, arrowLayer);
            }}
            onDragEnd={(e) => {
              handleDragEnd(e, mainLayer, tool, prevShape, setShapes);
            }}
            onTransformEnd={(e) => { handleTransfromEnd(e, setShapes) }}
            tool={tool}
            collapseChild={collapseChild}
            handleEraserClick={handleEraserClick}
            onShapeClick={onShapeClick}
          />
          <TodoLayer
            todos={shapes.filter((s: ShapeType): s is TodoType => s.shape === "todo")}
            setShapes={setShapes}
            tool={tool}
            onDragStart={(e) => handleDragStart(e, tool, tempLayer)}
            onDragMove={(e) => {
              handleDragMove(e, mainLayer, prevShape, tool);
              arrowMovement(connectors, mainLayer, tempLayer, arrowLayer);
            }}
            onDragEnd={(e) => {
              handleDragEnd(e, mainLayer, tool, prevShape, setShapes);
            }}
            onTransformEnd={(e) => { handleTransfromEnd(e, setShapes) }}
            handleEraserClick={handleEraserClick}
          />
        </Layer>
        <Layer ref={tempLayer}>
        </Layer>
        <Layer>
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
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
