import { Path, Circle, Group, Rect, Text } from "react-konva";
import type { ShapeType, TodoType, ToolType } from "../types";
import { useState } from "react";
import Konva from "konva";

interface Props {
  todo: TodoType;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  tool: ToolType;
  handleEraserClick: (todoId: string) => void;
  onTransformEnd: (e) => void;
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
}: Props) => {
  // For the checkbox
  const [isHovered, setisHovered] = useState(false);

  // For useravatar

  // Const Colors
  const inner = "#FDF6B2";
  const bColor = "#008236";
  const red = "#e7000b";

  // Change color to parent
  //

  // Setting checkbox
  const handleCheck = (id: string) => {
    setShapes((prevShapes) =>
      prevShapes.map((todo) => {
        if (todo.id === id && todo.shape === "todo") {
          const updated = { ...todo, completed: !todo.completed };
          console.log(updated);
          return updated;
        }
        return todo;
      })
    );
  };

  return (
    <Group
      key={"key-" + todo.id}
      id={"group-" + todo.id}
      shapeId={todo.id}
      x={todo.x}
      y={todo.y}
      name="shape"
      scalingX={todo.scaleX ?? 1}
      scalingY={todo.scaleY ?? 1}
      scaleX={todo.scaleX ?? 1}
      scaley={todo.scaleY ?? 1}
      onMouseEnter={() => {
        if (tool === "hand") setisHovered(true);
      }}
      onMouseLeave={() => {
        if (tool === "hand") setisHovered(false);
      }}
      draggable={tool != "eraser"}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onClick={() => {
        handleEraserClick(todo.id);
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
          shadowBlur={10}
          shadowOpacity={0.5}
          shadowColor="black"
          cornerRadius={[8, 8, 8, 8]}
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
              fontSize={20}
              fontStyle="bold"
            />
            <Text x={60} y={32} text={todo.dueDate} />
            <Group>
              <Text x={60} y={54} text={todo.owner} />
              {todo.completed ? (
                <Group x={280} y={50}>
                  <Rect
                    width={110}
                    height={18}
                    fill="green"
                    cornerRadius={[4, 4, 4, 4]}
                  />
                  <Text
                    x={26}
                    y={3}
                    text="Completed"
                    fill="white"
                    fontSize={12}
                  />
                </Group>
              ) : (
                <Group x={280} y={50}>
                  <Rect
                    width={110}
                    height={18}
                    fill={red}
                    cornerRadius={[4, 4, 4, 4]}
                  />
                  <Text
                    x={26}
                    y={3}
                    text="Not Started"
                    fill="white"
                    fontSize={12}
                  />
                </Group>
              )}
            </Group>
            {(isHovered || todo.completed) && (
              <Group x={26} y={36}>
                <Circle
                  radius={16}
                  fill={inner}
                  stroke={bColor}
                  strokeWidth={1.5}
                  onClick={() => handleCheck(todo.id)}
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
