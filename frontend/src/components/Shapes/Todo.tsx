import { Path, Circle, Group, Rect, Text } from "react-konva";
import type { ShapeType, TodoType, ToolType, RectType } from "../types";
import { useEffect, useRef, useState, type RefObject } from "react";
import Konva from "konva";

interface Props {
  todo: TodoType;
  shapes: ShapeType[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  tool: ToolType;
  handleEraserClick: (todoId: string) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  getBorder: (color: string) => string | undefined;
  onTodoClick: (parent: RectType | null, currTodo: TodoType | null) => void;
  nodeMap: RefObject<Map<string, Konva.Node>>;
  isDraggable: boolean;
}

const Todo = ({
  todo,
  setShapes,
  onDragStart,
  onDragMove,
  onDragEnd,
  tool,
  onTransformEnd,
  handleEraserClick,
  onTodoClick,
  shapes,
  nodeMap,
  isDraggable
}: Props) => {
  // For the checkbox
  const [isHovered, setisHovered] = useState(false);

  // For useravatar

  // Const Colors
  const inner = "#FDF6B2";
  // const bColor = "#008236";
  // const red = "#e7000b";

  // Change color to parent
  const borderColor = todo.color;

  // For showing due date
  const due = new Date(todo.dueDate);
  const formatted = due
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .replace(/, (?=\d{4})/, " ");

  // For calculating date difference
  const now = new Date();
  const diffMs = due.getTime() - now.getTime(); // miliseconds
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  // maybe i can use useMemo for optimization, but it depends if its worth it or not
  const getStatusinfo = () => {
    if (todo.completed)
      return {
        statusColor: "#00bc7d",
        statusText: "Completed",
        statusTextColor: "white",
      };
    else if (diffMonths >= 1)
      return {
        statusColor: "#2b7fff",
        statusText: `${diffMonths} Month${diffMonths > 1 ? "s" : ""} left`,
        statusTextColor: "white",
      };
    else if (diffWeeks >= 1)
      return {
        statusColor: "#2b7fff",
        statusText: `${diffWeeks} Week${diffWeeks > 1 ? "s" : ""} left`,
        statusTextColor: "white",
      };
    else if (diffDays >= 2)
      return {
        statusColor: "#2b7fff",
        statusText: `${diffDays} Day${diffDays > 1 ? "s" : ""} left`,
        statusTextColor: "white",
      };
    else if (diffDays === 1)
      return {
        statusColor: "#ff6900",
        statusText: "Due Tomorrow!!!",
        statusTextColor: "white",
      };
    else if (diffDays === 0)
      return {
        statusColor: "#ff2056",
        statusText: "Due Today!!!",
        statusTextColor: "white",
      };
    else
      return {
        statusColor: "purple",
        statusText: "Overdue",
        statusTextColor: "white",
      };
  };

  const { statusColor, statusText, statusTextColor } = getStatusinfo();

  const showAlways =
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || // touch-first devices
      window.innerWidth < 724);

  // phones + tablets
  // const isMobile = typeof window !== "undefined" && window.innerWidth < 724;
  // const showCircle = isMobile || isHovered || todo.completed;
  const showCircle = showAlways || isHovered;

  // Setting checkbox
  const handleCheck = (id: string) => {
    setShapes((prevShapes) =>
      prevShapes.map((todo) => {
        if (todo.id === id && todo.shape === "todo") {
          const updated = { ...todo, completed: !todo.completed };
          return updated;
        }
        return todo;
      })
    );
  };

  const ref = useRef<Konva.Group>(null);

  useEffect(() => {
    if (ref.current && nodeMap && nodeMap.current) {
      nodeMap.current.set("group-" + todo.id, ref.current);
    }
  });

  return (
    <Group
      key={"key-" + todo.id}
      id={"group-" + todo.id}
      ref={ref}
      shapeId={todo.id}
      x={todo.x}
      y={todo.y}
      mainWidth={todo.width}
      mainHeight={todo.height}
      name="shape"
      scalingX={todo.scaleX ?? 1}
      scalingY={todo.scaleY ?? 1}
      scaleX={todo.scaleX ?? 1}
      scaleY={todo.scaleY ?? 1}
      onMouseEnter={() => {
        if (tool === "hand") setisHovered(true);
      }}
      onMouseLeave={() => {
        if (tool === "hand") setisHovered(false);
      }}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onClick={() => {
        handleEraserClick(todo.id);
      }}
      onTap={() => {
        handleEraserClick(todo.id);
      }}
      onDblClick={() => {
        if (tool === "hand") {
          if (!shapes) return;
          let parent: RectType | null = null;
          if (todo.parents) {
            const parentId = todo.parents?.startsWith("group-")
              ? todo.parents.replace("group-", "")
              : todo.parents;
            const found = shapes.find((s) => s.id === parentId);
            if (found && found?.shape === "rect") {
              parent = found as RectType;
            }
          }
          onTodoClick(parent, todo);
        }
      }}
      onDblTap={() => {
        if (tool === "hand") {
          if (!shapes) return;
          let parent: RectType | null = null;
          if (todo.parents) {
            const parentId = todo.parents?.startsWith("group-")
              ? todo.parents.replace("group-", "")
              : todo.parents;
            const found = shapes.find((s) => s.id === parentId);
            if (found && found?.shape === "rect") {
              parent = found as RectType;
            }
          }
          onTodoClick(parent, todo);
        }
      }}
    >
      <Group visible={!todo.isCollapsed}>
        <Rect
          x={0}
          y={0}
          id={todo.id}
          width={todo.width}
          height={todo.height}
          fill="white"
          shadowBlur={4}
          shadowOpacity={0.5}
          shadowColor="black"
          cornerRadius={[8, 8, 8, 8]}
          stroke={borderColor}
          strokeWidth={1}
          shadowForStrokeEnabled={false}
        />
        <Group>
          <Rect
            x={0}
            y={0}
            width={50}
            height={75}
            fill={todo.color}
            cornerRadius={[8, 0, 0, 8]}
          />
          <Group>
            <Text
              x={60}
              y={8}
              text={todo.title}
              ellipsis={true}
              width={todo.width - 70}
              height={30}
              fontSize={20}
              fontStyle="bold"
            />
            <Text x={60} y={32} text={formatted} />
            <Group>
              <Text x={60} y={54} text={"Assigned: " + todo.assignee} />
              <Group x={280} y={50}>
                <Rect
                  width={110}
                  height={18}
                  fill={statusColor}
                  cornerRadius={[4, 4, 4, 4]}
                />
                <Text
                  x={0}
                  y={3}
                  width={110}
                  height={18}
                  text={statusText}
                  fill={statusTextColor}
                  align="center"
                  fontStyle="bold"
                  fontSize={12}
                />
              </Group>
            </Group>
            {showCircle && (
              <Group x={26} y={36}>
                <Circle
                  radius={16}
                  fill={inner}
                  stroke={borderColor}
                  strokeWidth={1.5}
                  onClick={() => handleCheck(todo.id)}
                  onTap={() => handleCheck(todo.id)}
                />
                {todo.completed && (
                  <Path
                    x={-7}
                    y={-8}
                    data="M2 8 L6 12 L14 2"
                    stroke="green"
                    strokeWidth={2}
                  />
                )}
              </Group>
            )}
          </Group>
        </Group>
      </Group>
    </Group>
  );
};

export default Todo;
