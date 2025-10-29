import Todo from "./Shapes/Todo";
import type { TodoType } from "./types"

interface Props {
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
}

const TodoLayer = ({ todos, setTodos }: Props) => {
  return (
    <>
      {todos.map(todo => (
        <Todo
        // Settings here
        />
      ))}
    </>
  )
}

export default TodoLayer
