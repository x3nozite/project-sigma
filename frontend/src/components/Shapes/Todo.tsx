import { Group, Rect, Text } from "react-konva";
import type { ShapeType, TodoType } from "../types";

interface Props {
  todo: TodoType;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
}

const Todo = ({ todo, setShapes }: Props) => {

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
