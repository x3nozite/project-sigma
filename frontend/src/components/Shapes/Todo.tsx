import { Group, Rect, Text } from "react-konva";
import type { TodoType } from "../types";
import Konva from "konva";

interface Props {
  todo: TodoType;
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
}

const Todo = ({ todo, setTodos }: Props) => {
  const handleClick = (rectId: string) => {
    if (tool === "eraser") {
      setRects((prev) => prev.filter((r) => r.id !== rectId));
    }
  };

  return (
    <Group
      key={"todokey-" + todo.id}
      id={"todogroup-" + todo.id}
      x={todo.x}
      y={todo.y}
    >
      <Rect x={todo.x} y={todo.y} width={200} height={50} fill="green"></Rect>
    </Group>
  );
};

export default Todo;
