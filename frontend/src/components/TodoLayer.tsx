import Todo from "./Shapes/Todo";
import type { ShapeType, TodoType } from "./types"

interface Props {
  todos: TodoType[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
}

const TodoLayer = ({ todos, setShapes }: Props) => {
  return (
    <>
      {todos.map(todo => (
        <Todo
          todo={todo}
          setShapes={setShapes}
        />
      ))}
    </>
  )
}

export default TodoLayer
