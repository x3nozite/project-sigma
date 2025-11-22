import type Konva from "konva/lib/_CoreInternals";
import Todo from "./Shapes/Todo";
import type { ShapeType, TodoType, ToolType } from "./types"

interface Props {
  todos: TodoType[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  tool: ToolType;
  handleEraserClick: (todoId: string) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const TodoLayer = ({ todos, setShapes, onDragStart, onDragMove, onDragEnd, tool, handleEraserClick, onTransformEnd }: Props) => {
  return (
    <>
      {todos.map(todo => (
        <Todo
          todo={todo}
          key={"key-" + todo.id}
          setShapes={setShapes}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          tool={tool}
          handleEraserClick={handleEraserClick}
          onTransformEnd={onTransformEnd}
        />
      ))}
    </>
  )
}

export default TodoLayer
