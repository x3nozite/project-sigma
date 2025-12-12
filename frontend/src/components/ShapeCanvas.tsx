import { Stage, Layer, Rect, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import type {
  RectType,
  ArrowType,
  ToolType,
  ShapeType,
  TodoType,
  LineType,
  SelectionRectType,
  TextType,
} from "./types";
import type { DragEventWithSource } from "./eventTypes";
import ArrowLayer from "./ArrowLayer";
import {
  handleDragStart,
  handleDragMove,
  handleDragEnd,
} from "./utilities/DragHandler";
import { arrowMovement } from "./utilities/ArrowFunction.ts";
import RectLayer from "./RectLayer";
import Konva from "konva";
import { handleZoomWithScroll } from "./utilities/zoom.ts";
import { changeCursor } from "./utilities/ChangeCursor.ts";
import TodoLayer from "./TodoLayer.tsx";
import {
  handleStageMouseDown,
  handleStageMouseMove,
  handleStageMouseUp,
} from "./canvas_tools/drawTool.ts";
import LineLayer from "./LineLayer.tsx";
import {
  handleEraseLinesMouseMove,
  handleEraseLinesMouseDown,
  handleEraseLinesMouseUp,
} from "./canvas_tools/eraseTool.ts";
import {
  handleSelectMouseDown,
  handleSelectMouseMove,
  handleSelectMouseUp,
  handleStageSelectClick,
  handleTransfromEnd,
} from "./canvas_tools/selectTool.ts";
import TextLayer from "./TextLayer.tsx";
import { countChildren } from "./utilities/countChild.ts";
import { useUndoRedo } from "../context/UndoRedo/UndoRedoHelper.tsx";

interface Props {
  shapes: ShapeType[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  connectors: ArrowType[];
  setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>;
  addConnector: (from: Konva.Node, to: Konva.Node) => void;
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
  zoom: number;
  setZoomValue: React.Dispatch<React.SetStateAction<number>>;
  strokeColor?: string;
  onShapeClick: (shape: ShapeType | null) => void;
  // add todo from rectangle
  onAddTodo: (parent: RectType | null, currTodo: TodoType | null) => void;
  stageCoor: { x: number; y: number };
  setStageCoor: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isFormOpen: boolean;
}

const bbox_id = "1234567890";

const ShapeCanvas = ({
  shapes = [],
  setShapes,
  tool,
  setTool,
  setZoomValue,
  zoom,
  connectors = [],
  setConnectors,
  addConnector,
  strokeColor = "#000",
  onShapeClick,
  onAddTodo,
  stageCoor,
  setStageCoor,
  isFormOpen,
}: Props) => {
  Konva.pixelRatio = window.devicePixelRatio || 1;
  const mainLayer = useRef<Konva.Layer | null>(null!);
  const prevShape = useRef<Konva.Shape | null>(null!);
  const tempLayer = useRef<Konva.Layer | null>(null!);
  const arrowLayer = useRef<Konva.Layer | null>(null!);
  const stageRef = useRef<Konva.Stage | null>(null!);

  const [mouseHeldDown, setMouseHeldDown] = useState<boolean>(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionRectangle, setSelectionRectangle] =
    useState<SelectionRectType>({
      visible: false,
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    });
  const isSelecting = useRef(false);
  const transformerRef = useRef<Konva.Transformer>(null);
  const boundBoxRef = useRef<Konva.Rect>(null);
  const { pushUndo, undo, redo } = useUndoRedo();
  const currentUndoGroup = useRef<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);

  useEffect(() => {
    if (!mainLayer.current) return;

    shapes.forEach((s) => {
      if (s.behavior !== "node") return;
      const shapeGroup = mainLayer.current?.findOne(`#group-${s.id}`);
      const shape = mainLayer.current?.findOne(`#${s.id}`) as Konva.Shape;
      const shapeInArray = shapes.find((s) => s.id === shape.id());
      if (!shapeGroup || !shape || !shapeInArray) return;

      shapeGroup.off("drop");
      shapeGroup.off("dragenter");
      shapeGroup.off("dragleave");

      shapeGroup.on("dragenter", (e) => {
        const sourceShape = (e as DragEventWithSource).source;
        if (
          !sourceShape ||
          shapeGroup === sourceShape ||
          shape.fill() === "green" ||
          shapeInArray.shape === "todo"
        )
          return;

        if (
          (s.shape !== "todo" && s.children.includes(sourceShape.id())) ||
          s.parents.includes(sourceShape.id())
        )
          return;

        const sourceShapeInArray = shapes.find(
          (rectToFind) => "group-" + rectToFind.id === sourceShape.id()
        );
        if (
          sourceShapeInArray?.behavior !== "node" ||
          sourceShapeInArray?.parents !== ""
        )
          return;

        shape.fill("#b9f8cf");
      });

      shapeGroup.on("dragmove", (e) => {
        const sourceShape = (e as DragEventWithSource).source;
        if (
          !sourceShape ||
          shapeGroup === sourceShape ||
          shape.fill() === "#b9f8cf"
        )
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
        if (
          s.behavior !== "node" ||
          (s.shape !== "todo" && s.children.includes(sourceShape.id())) ||
          !sourceShape ||
          s.parents.includes(sourceShape.id())
        )
          return;
        const sourceShapeInArray = shapes.find(
          (rectToFind) => "group-" + rectToFind.id === sourceShape.id()
        );
        if (
          sourceShapeInArray?.behavior !== "node" ||
          sourceShapeInArray?.parents !== "" ||
          shapeInArray.shape === "todo"
        )
          return;

        shape.fill("white");

        setShapes((prev: ShapeType[]) => {
          return prev.map((shape) => {
            if (
              shape.behavior === "node" &&
              "group-" + shape.id === (e as DragEventWithSource).source.id()
            ) {
              return {
                ...shape,
                parents: shapeGroup.id(),
              };
            }
            if (
              shape.behavior === "node" &&
              shape.shape != "todo" &&
              "group-" + shape.id === shapeGroup.id()
            ) {
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

    function handleKeyDown(e: KeyboardEvent) {
      if (isFormOpen || isEditingText) return;
      // Ctrl + Z
      if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        undo(setShapes, setConnectors); // or whatever your undo function is
        return;
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
        redo(setShapes, setConnectors);
        return;
      }
      switch (e.key) {
        case "1":
          setTool("hand");
          break;
        case "z":
          setTool("hand");
          break;
        case "2":
          setTool(tool === "select" ? "hand" : "select");
          break;
        case "x":
          setTool(tool === "select" ? "hand" : "select");
          break;
        case "3":
          setTool(tool === "draw" ? "hand" : "draw");
          break;
        case "c":
          setTool(tool === "draw" ? "hand" : "draw");
          break;
        case "4":
          setTool(tool === "eraser" ? "hand" : "eraser");
          break;
        case "v":
          setTool(tool === "eraser" ? "hand" : "eraser");
          break;
        case "p":
          setTool(tool === "draw" ? "hand" : "draw");
          break;
        case "q":
          onShapeClick(null);
          break;
        case "w":
          onAddTodo(null, null);
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

  useEffect(() => {
    //update transformer when selection changes
    if (selectedIds.length && transformerRef.current) {
      const nodes = selectedIds
        .map((id) => stageRef.current?.findOne<Konva.Shape>(`#group-${id}`))
        .filter(Boolean) as Konva.Shape[];

      transformerRef.current.nodes(nodes);

      currentUndoGroup.current = crypto.randomUUID();

      nodes.forEach((element) => {
        console.log(element.id());
      });

      requestAnimationFrame(() => {
        const bbox = boundBoxRef.current;
        if (!bbox || !stageRef.current || !transformerRef.current) return;

        const width =
          transformerRef.current.width() / stageRef.current.scaleX();
        const height =
          transformerRef.current.height() / stageRef.current.scaleY();
        const x =
          (transformerRef.current.x() - stageCoor.x) /
          stageRef.current.scaleX();
        const y =
          (transformerRef.current.y() - stageCoor.y) /
          stageRef.current.scaleY();

        bbox.show();
        bbox.x(x);
        bbox.y(y);
        bbox.width(width);
        bbox.height(height);

        bbox.scaleX(1);
        bbox.scaleY(1);

        const currentNodes = transformerRef.current.nodes();
        transformerRef.current.nodes([...currentNodes, bbox]);
      });
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      const bbox = boundBoxRef.current;
      currentUndoGroup.current = null;
      bbox?.hide();
    }

    if (tool !== "select") {
      transformerRef.current?.nodes([]);
      const bbox = boundBoxRef.current;
      currentUndoGroup.current = null;
      bbox?.hide();
    }
  }, [selectedIds, tool, stageCoor]);

  useEffect(() => {
    // When switching away from select → clear the selection
    if (tool !== "select") {
      setSelectedIds([]);
    }
  }, [tool]);

  useEffect(() => {
    arrowMovement(connectors, mainLayer, tempLayer, arrowLayer);
  }, [shapes, connectors]);

  useEffect(() => {
    const handleResize = () => {
      const stage = stageRef.current;
      if (!stage) return;
      stage.width(window.innerWidth);
      stage.height(window.innerHeight);
      stage.draw(); // important to update canvas pixels
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkParentVisible = (shape: ShapeType) => {
    if (shape.behavior !== "node") return;
    //find parent
    const parentInArray = shapes.find((s) => "group-" + s.id === shape.parents);
    const parentNode = mainLayer.current?.findOne(`#${shape.parents}`);
    if (!parentNode || !parentInArray) return false;

    return (parentNode as Konva.Group).getChildren()[0].visible();
  };

  const collapseChild = (shape: ShapeType, currentlyCollapsed: boolean) => {
    if (shape.behavior !== "node" || shape.shape === "todo") return;

    if (shape.children.length === 0) return;
    shape.children.forEach((child) => {
      const childInArray = shapes.find((s) => "group-" + s.id === child);
      if (!childInArray) return;

      const shapeGroup = mainLayer.current?.findOne(`#${child}`);
      if (!shapeGroup) return;
      shapeGroup.visible(currentlyCollapsed);

      // set arrow's visibility
      const connectorReact = connectors.find((connector) => {
        if (connector.from === child) return connector;
      });
      if (!connectorReact) return;

      // find the node
      const connectorNode = arrowLayer.current?.findOne(
        `#${connectorReact.id}`
      );
      if (!connectorNode) return;
      connectorNode.visible(currentlyCollapsed);

      if (!checkParentVisible(childInArray)) return;
      collapseChild(childInArray, currentlyCollapsed);
    });
  };

  const changeChildToOrphan = (shapeId: string) => {
    const shapeInArray = shapes.find((s) => s.id === shapeId);

    if (shapeInArray?.behavior !== "node" || shapeInArray?.shape === "todo")
      return;

    shapeInArray?.children.forEach((child) => {
      const childInArray = shapes.find((r) => "group-" + r.id === child);
      if (!childInArray || childInArray.behavior !== "node") return;
      childInArray.parents = "";
    });
  };

  const removeParentStatus = (shapeId: string) => {
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.shape === "rect" && shape.children.includes(shapeId)) {
          return {
            ...shape,
            children: shape.children.filter((c) => c !== "group-" + shapeId),
          };
        }
        return shape;
      })
    );
  };

  const handleEraserClick = (shapeId: string) => {
    if (tool === "eraser") {
      const groupId = crypto.randomUUID();
      connectors.forEach((connector) => {
        if (
          connector.to === "group-" + shapeId ||
          connector.from === "group-" + shapeId
        ) {
          const connectorToDelete = { ...connector };
          pushUndo({
            id: groupId,
            before: connectorToDelete,
            after: connectorToDelete,
            action: "delete",
          });
          setConnectors((prev) => prev.filter((c) => c.id !== connector.id));
        }
      });

      const shapeToDelete: ShapeType | undefined = shapes.find(
        (s) => s.id === shapeId
      );
      if (shapeToDelete)
        pushUndo({
          id: groupId,
          before: { ...shapeToDelete },
          after: { ...shapeToDelete },
          action: "delete",
        });

      changeChildToOrphan(shapeId);
      removeParentStatus(shapeId);
      setShapes((prev: ShapeType[]) => prev.filter((r) => r.id !== shapeId));
    }
  };

  const getBorder = (color: string) => {
    let border;

    if (color === "#ff2056") border = "#f6339a"; // rose-400
    else if (color === "#2b7fff") border = "#00a6f4"; // sky-500
    else if (color === "#00bc7d") border = "#00c951"; // emerald-600
    else if (color === "#ad46ff") border = "#8e51ff"; // violet-500
    else if (color === "#ff6900") border = "#fd9a00"; // orange-600

    return border;
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        x={stageCoor.x}
        y={stageCoor.y}
        ref={stageRef}
        draggable={tool === "hand"}
        onWheel={(e) => {
          handleZoomWithScroll(stageRef, e, setZoomValue);
          if (!stageRef.current) return;
          setStageCoor({ x: stageRef.current.x(), y: stageRef.current.y() });
        }}
        onPointerDown={(e) => {
          if (tool === "draw")
            handleStageMouseDown(
              stageRef.current,
              tool,
              strokeColor,
              setShapes,
              setMouseHeldDown
            );
          if (tool === "eraser") handleEraseLinesMouseDown(setMouseHeldDown);
          if (tool === "select")
            handleSelectMouseDown(
              e,
              stageRef,
              isSelecting,
              setSelectionRectangle
            );
        }}
        onPointerMove={() => {
          if (tool === "draw")
            handleStageMouseMove(
              stageRef.current,
              tool,
              setShapes,
              mouseHeldDown
            );
          if (tool === "eraser")
            handleEraseLinesMouseMove(
              stageRef,
              tool,
              setShapes,
              mouseHeldDown,
              shapes,
              pushUndo
            );
          if (tool === "select")
            handleSelectMouseMove(
              stageRef,
              isSelecting,
              selectionRectangle,
              setSelectionRectangle
            );
        }}
        onPointerUp={() => {
          if (tool === "draw") {
            handleStageMouseUp(mouseHeldDown, setMouseHeldDown);
            pushUndo({
              action: "add",
              before: shapes[shapes.length - 1],
              after: shapes[shapes.length - 1],
            });
          }
          if (tool === "eraser") handleEraseLinesMouseUp(setMouseHeldDown);
          if (tool === "select")
            handleSelectMouseUp(
              isSelecting,
              selectionRectangle,
              setSelectionRectangle,
              setSelectedIds,
              shapes,
              mainLayer,
              stageCoor
            );
        }}
        onClick={(e) => {
          if (tool === "select")
            handleStageSelectClick(
              e,
              selectionRectangle,
              selectedIds,
              setSelectedIds
            );
        }}
        scaleX={zoom / 100}
        scaleY={zoom / 100}
        style={{ cursor: changeCursor(tool) }}
        onDragEnd={() => {
          if (!stageRef.current) return;
          setStageCoor({ x: stageRef.current.x(), y: stageRef.current.y() });
        }}
      >
        <Layer ref={arrowLayer}>
          <ArrowLayer connectors={connectors} mainLayer={mainLayer} />
        </Layer>

        <Layer ref={mainLayer}>
          <Rect
            id={bbox_id}
            ref={boundBoxRef}
            fill="transparent"
            draggable={true}
            temporary={true}
          />
          <LineLayer
            lines={shapes.filter(
              (s: ShapeType): s is LineType => s.shape === "line"
            )}
            onDragEnd={(e) => {
              handleDragEnd(
                e,
                mainLayer,
                tool,
                prevShape,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
            onTransformEnd={(e) => {
              handleTransfromEnd(
                e,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
          />
          <TextLayer
            texts={shapes.filter(
              (s: ShapeType): s is TextType => s.shape === "text"
            )}
            onEraserClick={handleEraserClick}
            onDragEnd={(e) => {
              handleDragEnd(
                e,
                mainLayer,
                tool,
                prevShape,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
            onTransformEnd={(e) => {
              handleTransfromEnd(
                e,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
            setShapes={setShapes}
            isEditingText={isEditingText}
            setIsEditingText={setIsEditingText}
            tool={tool}
          />
          <RectLayer
            shapes={shapes.filter(
              (s: ShapeType): s is RectType => s.shape === "rect"
            )}
            allShapes={shapes}
            setShapes={setShapes}
            onDragStart={(e) => handleDragStart(e, tool, tempLayer)}
            onDragMove={(e) => {
              handleDragMove(e, mainLayer, prevShape, tool);
              arrowMovement(connectors, mainLayer, tempLayer, arrowLayer);
            }}
            onDragEnd={(e) => {
              handleDragEnd(
                e,
                mainLayer,
                tool,
                prevShape,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
            onTransformEnd={(e) => {
              handleTransfromEnd(
                e,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
            tool={tool}
            collapseChild={collapseChild}
            handleEraserClick={handleEraserClick}
            onShapeClick={onShapeClick}
            getBorder={getBorder}
            onAddTodo={onAddTodo}
            getChildCounts={countChildren}
          />
          <TodoLayer
            todos={shapes.filter(
              (s: ShapeType): s is TodoType => s.shape === "todo"
            )}
            setShapes={setShapes}
            tool={tool}
            onDragStart={(e) => handleDragStart(e, tool, tempLayer)}
            onDragMove={(e) => {
              handleDragMove(e, mainLayer, prevShape, tool);
              arrowMovement(connectors, mainLayer, tempLayer, arrowLayer);
            }}
            onDragEnd={(e) => {
              handleDragEnd(
                e,
                mainLayer,
                tool,
                prevShape,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
            onTransformEnd={(e) => {
              handleTransfromEnd(
                e,
                setShapes,
                shapes,
                pushUndo,
                currentUndoGroup.current
              );
            }}
            handleEraserClick={handleEraserClick}
            getBorder={getBorder}
            onTodoClick={onAddTodo}
            shapes={shapes}
          />
        </Layer>
        <Layer ref={tempLayer}></Layer>
        <Layer>
          <Transformer
            ref={transformerRef}
            id="transformer"
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
            ]}
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
