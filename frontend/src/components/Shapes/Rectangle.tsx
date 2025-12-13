import { Circle, Group, Rect, Text } from "react-konva";
import type { RectType, ShapeType, TodoType, ToolType } from "../types";
import { useEffect, useRef, useState, type RefObject } from "react";
import Konva from "konva";

interface Props {
  rect: RectType;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  collapseChild: (rect: RectType, currentlyCollapsed: boolean) => void;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onShapeClick: (shape: ShapeType | null) => void;
  tool: ToolType;
  handleEraserClick: (rectId: string) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  getBorder: (color: string) => string | undefined;
  onAddTodo: (parent: RectType | null, currTodo: TodoType | null) => void;
  global_shape: ShapeType[];
  getChildCounts: (
    rect: RectType,
    shapes: ShapeType[]
  ) => { completed: number; not_completed: number };
  nodeMap: RefObject<Map<string, Konva.Node>>;
}

const Rectangle = ({
  rect,
  setShapes,
  onDragStart,
  onDragMove,
  onDragEnd,
  tool,
  collapseChild,
  handleEraserClick,
  onShapeClick,
  onTransformEnd,
  getBorder,
  onAddTodo,
  global_shape,
  getChildCounts,
  nodeMap
}: Props) => {
  // test
  const counts = getChildCounts(rect, global_shape);
  const total = counts.completed + counts.not_completed;

  // handle completed change
  if (counts.completed === total) {
    rect.completed = true;
  } else {
    rect.completed = false;
  }

  const getCompletionColor = () => {
    if (total === 0)
      return {
        completeColor: "purple",
        completeText: "No Task Yet",
      };
    else if (counts.completed === 0)
      return {
        completeColor: "#ff2056",
        completeText: "Not Started",
      };
    else if (counts.completed === total)
      return {
        completeColor: "#00bc7d",
        completeText: "Completed",
      };
    else
      return {
        completeColor: "#ff6900",
        completeText: "In Progress",
      };
  };

  const { completeColor, completeText } = getCompletionColor();
  // hover to show todo
  const [isHovered, setisHovered] = useState(false);

  // change border color
  const borderColor = getBorder(rect.color);

  // formatted date
  const due = new Date(rect.dueDate);
  const formatted = due
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .replace(/, (?=\d{4})/, " ");

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const showCircle = isMobile || isHovered;

  const ref = useRef<Konva.Group>(null)

  useEffect(() => {
    if (ref.current && nodeMap && nodeMap.current) {
      nodeMap.current.set("group-" + rect.id, ref.current);
    }
  });

  return (
    <Group
      key={"key-" + rect.id}
      ref={ref}
      id={"group-" + rect.id}
      shapeId={rect.id}
      x={rect.x}
      y={rect.y}
      name="shape"
      mainWidth={rect.width}
      mainHeight={rect.height}
      scalingX={rect.scaleX ?? 1}
      scalingY={rect.scaleY ?? 1}
      scaleX={rect.scaleX ?? 1}
      scaleY={rect.scaleY ?? 1}
      draggable={tool !== "eraser"}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onMouseEnter={() => {
        if (tool === "hand") setisHovered(true);
      }}
      onMouseLeave={() => {
        if (tool === "hand") setisHovered(false);
      }}
      onTap={() => {
        handleEraserClick(rect.id);
      }}
      onDblTap={() => {
        if (tool === "hand") {
          onShapeClick(rect);
        }
      }}
      onClick={() => {
        handleEraserClick(rect.id);
      }}
      onDblClick={() => {
        if (tool === "hand") {
          onShapeClick(rect);
        }
      }}

    >
      <Group visible={!rect.isCollapsed}>
        <Rect
          className="mainRect"
          id={rect.id}
          width={Math.round(rect.width)}
          height={Math.round(rect.height)}
          fill="white"
          shadowBlur={6}
          shadowOpacity={0.5}
          shadowColor="black"
          shadowOffset={{ x: 0, y: 4 }}
          cornerRadius={[16, 8, 8, 8]}
          stroke={borderColor}
          strokeWidth={2.5}
          shadowForStrokeEnabled={false}
        />
        <Text
          x={0}
          y={50}
          text={rect.description}
          fontSize={14}
          fontFamily="Inter"
          fontStyle="normal"
          fill="gray"
          align="justify"
          ellipsis={true}
          lineHeight={1.25}
          padding={10}
          width={rect.width}
          height={rect.height * 0.6}
          listening={false}
        />
        <Text
          text={formatted}
          x={150}
          y={170}
          width={150}
          fontFamily="Inter"
          fontSize={10}
          align="left"
          fill="black"
          opacity={0.8}
          listening={false}
        ></Text>
        <Group>
          <Rect
            fill={completeColor}
            width={100}
            height={30}
            x={10}
            y={160}
            cornerRadius={10}
          ></Rect>
          <Text
            text={completeText}
            width={100}
            height={30}
            fontFamily="Inter"
            align="center"
            fill="white"
            fontStyle="bold"
            x={10}
            y={158}
            padding={10}
          ></Text>
        </Group>
        {showCircle && (
          <Group
            x={rect.width + 5}
            y={rect.height / 2}
            onClick={(e) => {
              e.cancelBubble = true;
              onAddTodo(rect, null);
            }}
            onTap={(e) => {
              e.cancelBubble = true;
              onAddTodo(rect, null);
            }}
          >
            <Circle radius={16} fill="white" stroke={rect.color} />
            <Text
              x={-8}
              y={-13.5}
              text="+"
              fill="black"
              fontSize={24}
              fontFamily="Inter"
              align="left"
            />
          </Group>
        )}
      </Group>
      <Group>
        <Rect
          x={0}
          y={0}
          width={rect.width}
          height={rect.height * 0.25}
          cornerRadius={[16, 4, 4, 4]}
          fill={rect.color}
          shadowBlur={10}
          shadowOpacity={0.5}
          shadowColor="black"
          shadowOffset={{ x: 0, y: 4 }}
          visible={rect.isCollapsed}
        />
        <Rect
          x={0}
          y={0}
          width={rect.width}
          height={rect.height * 0.25}
          cornerRadius={[16, 4, 4, 4]}
          fill={rect.color}
        ></Rect>
        <Text
          x={10}
          y={15}
          text={rect.title}
          fontFamily="Inter"
          fill="white"
          fontStyle="bold"
          fontSize={16}
        ></Text>
        <Group x={260} y={7} width={20} height={40}
          onDblClick={(e) => { e.cancelBubble = true; }}
          onDblTap={(e) => { e.cancelBubble = true; }}
          onClick={(e) => {
            if (tool !== "eraser") {
              const isCurrentlyCollapsed = rect.isCollapsed;
              if (isCurrentlyCollapsed) {
                collapseChild(rect, true);
              } else {
                collapseChild(rect, false);
              }

              e.cancelBubble = true;
              setShapes((prev) => {
                return prev.map((r) => {
                  if (r.shape === "rect" && r.id === rect.id) {
                    return { ...r, isCollapsed: !r.isCollapsed };
                  } else {
                    return r;
                  }
                });
              });
            }
          }}
          onTap={(e) => {
            if (tool !== "eraser") {
              const isCurrentlyCollapsed = rect.isCollapsed;
              if (isCurrentlyCollapsed) {
                collapseChild(rect, true);
              } else {
                collapseChild(rect, false);
              }

              e.cancelBubble = true;
              setShapes((prev) => {
                return prev.map((r) => {
                  if (r.shape === "rect" && r.id === rect.id) {
                    return { ...r, isCollapsed: !r.isCollapsed };
                  } else {
                    return r;
                  }
                });
              });
            }
          }}>
          <Rect width={30} height={30} listening={true}>
          </Rect>
          <Text
            width={30}
            height={30}
            x={0}
            y={0}
            fill="white"
            text={rect.isCollapsed ? "+" : "-"}
            fontSize={32}
            align="center"

          ></Text>
        </Group>
      </Group>
    </Group>
  );
};

export default Rectangle;
