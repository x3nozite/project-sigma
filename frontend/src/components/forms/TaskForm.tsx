import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

export type taskFields = z.infer<typeof schema>;

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
      title: "My New Subject",
      // description: "abcedfghijkl",
      date: "2025-10-11",
      time: "06:07",
    },
    resolver: zodResolver(schema),
  });

  const [selCol, setSelCol] = useState("#ff2056");

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
    <div>
      <div className="absolute h-full w-full bg-black opacity-50 backdrop z-99"></div>
      <div className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-10 inset-0 flex flex-col justify-between w-150 h-fit max-h-200  items-start border-px rounded-lg shadow-2xl z-100">
        <div
          className="absolute top-0 left-0 rounded-t-lg w-full h-5 "
          style={{ backgroundColor: selCol }}
        ></div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
          <div className="mb-2 flex flex-row items-end justify-between h-15  w-full">
            <input
              {...register("title")}
              type="text"
              id="title"
              size={11}
              placeholder="My New Subject"
              className="text-3xl h-full p-2 font-bold rounded-lg"
            ></input>
            {errors.title && (
              <div className="text-red-500">{errors.title?.message}</div>
            )}
            <button
              onClick={onCloseForm}
              className="hover:cursor-pointer p-2 h-full"
            >
              X
            </button>
          </div>
          <div className="mb-8 flex flex-col gap-5 w-full items-start">
            <div className="inline-flex gap-2">
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>

              <label className="text-md font-semibold">Description</label>
            </div>
            <textarea
              {...register("description")}
              placeholder="Add a detailed description for subject..."
              className="border border-gray-300 bg-gray-50 rounded-lg p-2 shadow-xs ml-8 w-[calc(100%-2rem)] items-start h-25 resize-none"
            ></textarea>
            {errors.description && (
              <div className="text-red-500">{errors.description?.message}</div>
            )}
          </div>
          <hr className="h-px w-full my-2 bg-gray-200 border-0" />
          <div className="flex flex-row flex-auto gap-10 w-full mt-5 mb-5">
            <div className="mb-5 flex flex-col gap-1 w-full">
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
                onChange={(e) => setSelCol(e.target.value)}
                name="color"
                className="border border-gray-300 bg-gray-100 rounded-lg p-2 shadow-xs hover:cursor-pointer"
              >
                <option value="#ff2056">Red</option>
                <option value="#2b7fff">Blue</option>
                <option value="#00bc7d">Green</option>
                <option value="#ad46ff">Purple</option>
                <option value="#ff6900">Orange</option>
              </select>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-2 w-full h-full">
            <button
              className="border py-2.5 px-5 h-fit border-red-500 font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-500 hover:text-white hover:cursor-pointer"
              onClick={onCloseForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 h-fit text-md font-semibold rounded-lg text-white bg-amber-500 hover:bg-amber-600 hover:cursor-pointer"
            >
              {isSubmitting ? "Loading..." : "Create New Task"}
            </button>
          </div>
          {errors.root && (
            <div className="text-red-500">{errors.root?.message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
