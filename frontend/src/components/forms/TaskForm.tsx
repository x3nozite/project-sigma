import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(100, "Description must be at most 100 characters"),
  color: z.string(),
  date: z.string(),
  time: z.string(),
});

type taskFields = z.infer<typeof schema>;

interface Props {
  onAddTask: (task: taskFields) => void;
  onCloseForm: () => void;
}

export default function TaskForm({ onAddTask, onCloseForm }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<taskFields>({
    defaultValues: {
      title: "abc",
      description: "abcedfghijkl",
      date: "2025-10-11",
      time: "06:07",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<taskFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onAddTask(data);
      onCloseForm();
    } catch (error) {
      setError("root", {
        message: "This Task already exists!",
      });
    }
  };

  return (
    <div className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-10 inset-0 flex flex-col gap-4 items-center justify-center w-fit h-fit border-px rounded-lg shadow-2xl z-100">
      <div className="flex flex-row justify-between w-full h-full">
        <span className="text-2xl font-bold text-left">Create New Task</span>
        <button onClick={onCloseForm} className="hover:cursor-pointer">
          X
        </button>
      </div>
      <hr className="h-px w-full my-2 bg-gray-200 border-0" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex flex-col gap-1">
          <label className="text-lg font-semibold">Task Title</label>
          <input
            {...register("title")}
            type="text"
            id="title"
            placeholder="My New Task"
            className="border border-gray-100 bg-gray-50 rounded-lg p-2 shadow-xs"
          />
          {errors.title && (
            <div className="text-red-500">{errors.title?.message}</div>
          )}
        </div>
        <div className="mb-5 flex flex-col gap-1">
          <div className="inline-flex ">
            <label className="text-lg font-semibold">Description</label>
          </div>
          <input
            {...register("description")}
            type="text"
            placeholder="This is the description for my task!"
            className="border border-gray-100 bg-gray-50 rounded-lg p-2 shadow-xs"
          />
          {errors.description && (
            <div className="text-red-500">{errors.description?.message}</div>
          )}
        </div>
        <hr className="h-px w-full my-2 bg-gray-200 border-0" />
        <div className="flex flex-row flex-auto gap-10">
          <div className="mb-5 flex flex-col gap-1">
            <label className="text-lg font-semibold">Date</label>
            <input
              {...register("date")}
              type="date"
              name="date"
              className="border border-gray-300 bg-gray-100 rounded-lg p-2 shadow-xs hover:cursor-pointer"
            />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="text-lg font-semibold">Due Time</label>
            <input
              {...register("time")}
              type="time"
              name="time"
              className="border border-gray-300 bg-gray-100 rounded-lg p-2 shadow-xs hover:cursor-pointer"
            />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="text-lg font-semibold">Color</label>
            <select
              {...register("color")}
              name="color"
              className="border border-gray-300 bg-gray-100 rounded-lg p-2 shadow-xs hover:cursor-pointer"
            >
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
            </select>
          </div>
        </div>

        <div className="flex flex-row justify-start gap-2 w-full h-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 px-5 text-md font-semibold rounded-lg text-white bg-amber-500 hover:bg-amber-600 hover:cursor-pointer"
          >
            {isSubmitting ? "Loading..." : "Create New Task"}
          </button>
          <button
            className="border border-red-500 font-medium text-red-500 bg-red-50 px-5 rounded-lg hover:bg-red-500 hover:text-white hover:cursor-pointer"
            onClick={onCloseForm}
          >
            Cancel
          </button>
        </div>
        {errors.root && (
          <div className="text-red-500">{errors.root?.message}</div>
        )}
      </form>
    </div>
  );
}
