import type { TodoType } from "./types"

interface Props {
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
}

const TodoLayer = ({ todos, setTodos }: Props) => {
  return (
    <div></div>
  )
}

export default TodoLayer
