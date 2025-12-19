import type Konva from "konva/lib/_CoreInternals";
import Todo from "./Shapes/Todo";
import type { ShapeType, TodoType, ToolType, RectType } from "./types";
import type { RefObject } from "react";

interface Props {
  todos: TodoType[];
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

const TodoLayer = ({
  todos,
  setShapes,
  onDragStart,
  onDragMove,
  onDragEnd,
  tool,
  handleEraserClick,
  onTransformEnd,
  getBorder,
  onTodoClick,
  shapes,
  nodeMap,
  isDraggable
}: Props) => {
  return (
    <>
      {todos.map((todo) => (
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
          getBorder={getBorder}
          onTodoClick={onTodoClick}
          shapes={shapes}
          nodeMap={nodeMap}
          isDraggable={isDraggable}
        />
      ))}
    </>
  );
};

export default TodoLayer;
