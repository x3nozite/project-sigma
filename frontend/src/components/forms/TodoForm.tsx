import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import type { RectType, ShapeType } from "../types";

const schema = z.object({
  title: z.string(),
  // .min(3, "Title must be at least 3 characters")
  // .max(50, "Title must be at most 50 characters"),
  assignee: z.string(),
  date: z.string(),
  completed: z.boolean(),
  color: z.string(),
});

export type todoFields = z.infer<typeof schema>;

interface Props {
  onAddTodo: (field: todoFields, parent: RectType | null) => void;
  onUpdateTodo: (shape: ShapeType, newData: todoFields) => void;
  onCloseForm: () => void;
  parent: RectType | null;
  initialTodo: ShapeType | null;
}

export default function TodoForm({
  onAddTodo,
  onUpdateTodo,
  parent,
  onCloseForm,
  initialTodo,
}: Props) {
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const isEditing =
    initialTodo &&
    initialTodo.behavior === "node" &&
    initialTodo.shape === "todo";

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<todoFields>({
    defaultValues: isEditing
      ? {
          title: initialTodo.title,
          assignee: initialTodo.assignee,
          date: initialTodo.dueDate,
          completed: initialTodo.completed,
          color: initialTodo.color,
        }
      : {
          title: "My Newest Todo",
          assignee: "Guest",
          date: formattedToday,
          completed: false,
          color: parent?.color,
        },

    resolver: zodResolver(schema),
  });

  const [selCol, setSelCol] = useState(
    isEditing ? initialTodo.color : parent?.color ?? "#ff2056"
  );

  const onSubmit: SubmitHandler<todoFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isEditing) onUpdateTodo(initialTodo, data);
      else {
        console.log("init: " + initialTodo);
        onAddTodo(data, parent);
      }
      onCloseForm();
    } catch (error) {
      setError("root", {
        message: "This Todo already exists!: " + error,
      });
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseForm();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCloseForm]);

  return (
    <>
      <div className="absolute h-full w-full bg-black opacity-50 backdrop z-99"></div>
      <div className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-10 inset-0 flex flex-row justify-between w-150 h-fit max-h-200  items-start border-px rounded-lg shadow-2xl z-100">
        <div
          className="absolute top-0 left-0 rounded-l-lg w-8 h-full"
          style={{ backgroundColor: selCol }}
        ></div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
          <div className="mb-1 flex w-full h-fit">
            <input
              {...register("title")}
              type="text"
              id="title"
              placeholder="New To-Do"
              size={12}
              className="text-2xl w-full h-full p-2 font-bold rounded-lg focus:outline-none "
            />
          </div>
          <div className="mb-2 flex flex-col gap-1 w-full">
            <div className="w-full grid grid-cols-[6rem_1fr] gap-2 items-center ">
              <label className="text-sm px-2.5 py-2 text-start rounded-md">
                Subject
              </label>
              <div
                className="w-full h-full font-medium flex items-center justify-center px-2 rounded-md bg-red-200 "
                style={{
                  backgroundColor: parent ? parent.color : "#d1d5dc",
                  color: parent ? "#ffffff" : "#000000",
                }}
              >
                <span className="text-sm text-start  w-full ">
                  {parent ? parent.title : "Not Assigned"}
                </span>
              </div>
            </div>
            <div className="w-full grid grid-cols-[6rem_1fr] gap-2 items-center ">
              <label className="text-sm px-2.5 py-2 text-start rounded-md">
                Due Date
              </label>
              <input
                {...register("date")}
                type="date"
                className="w-full h-full hover:bg-gray-300 px-2 rounded-md text-sm"
              />
            </div>
            <div className="w-full grid grid-cols-[6rem_1fr] gap-2 items-center">
              <label className="text-sm px-2.5 py-2  text-start rounded-md">
                Assignee
              </label>
              <select
                {...register("assignee")}
                name="assignee"
                className="hover:bg-gray-300 w-full h-full px-2 rounded-md text-sm"
              >
                <option value="Guest">Guest</option>
                <option value="User1">User1</option>
                <option value="User2">User2</option>
                <option value="User3">User3</option>
                <option value="User4">User4</option>
              </select>
            </div>
            <div className="w-full grid grid-cols-[6rem_1fr] gap-2 items-center">
              <label className="text-sm px-2.5 py-2  text-start rounded-md">
                Color
              </label>
              <select
                {...register("color")}
                value={selCol}
                onChange={(e) => setSelCol(e.target.value)}
                name="color"
                className="hover:bg-gray-300 w-full h-full px-2 rounded-md text-sm"
              >
                <option value="#ff2056">Red</option>
                <option value="#2b7fff">Blue</option>
                <option value="#00bc7d">Green</option>
                <option value="#ad46ff">Purple</option>
                <option value="#ff6900">Orange</option>
              </select>
            </div>
            <div className="w-full grid grid-cols-[6rem_1fr] gap-2 items-center">
              <label className="text-sm px-2.5 py-2  rounded-md text-start">
                Status
              </label>
              <label className="flex items-center w-full h-full px-2 hover:bg-gray-300 rounded-md">
                <input
                  {...register("completed")}
                  type="checkbox"
                  className="w-4 h-4 rounded-xs bg-neutral-secondary-medium"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-row w-full justify-start gap-5 items-center h-fit">
            <button
              className="py-1 px-2 bg-red-200 border-2 rounded-md border-red-300"
              onClick={onCloseForm}
            >
              <span className="text-sm">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-1 px-2 bg-orange-200 border-2 rounded-md border-orange-300"
            >
              {isSubmitting ? (
                <span className="text-sm">Loading...</span>
              ) : (
                <span className="text-sm">Submit</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
