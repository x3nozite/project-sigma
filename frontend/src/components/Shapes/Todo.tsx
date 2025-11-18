import { Path, Circle, Group, Rect, Text } from "react-konva";
import type { ShapeType, TodoType } from "../types";
import { useState } from "react";
import { check } from "zod";

interface Props {
  todo: TodoType;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
}

const Todo = ({ todo, setShapes }: Props) => {
  // For the checkbox
  const [isHovered, setisHovered] = useState(false);

  // Const Colors
  const inner = "#FDF6B2";
  const bColor = "#6B7280";

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
      key={"todokey-" + todo.id}
      id={"todogroup-" + todo.id}
      x={todo.x}
      y={todo.y}
      scaleX={todo.scaleX ?? 1}
      scaley={todo.scaleY ?? 1}
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
    >
      <Group visible={!todo.isCollapsed}>
        <Rect
          x={0}
          y={0}
          width={400}
          height={75}
          fill="white"
          shadowBlur={4}
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
              <Text x={60} y={54} text="User Avatar Here" />
              <Text x={280} y={54} text={todo.description} />
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
