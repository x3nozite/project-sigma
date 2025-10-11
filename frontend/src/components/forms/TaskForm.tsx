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
});

type taskFields = z.infer<typeof schema>;

interface Props {
  onAddTask: () => void;
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
      title: "My New Task",
      description: "This is a description about my task!",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<taskFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error();
      console.log(data);
    } catch (error) {
      setError("root", {
        message: "This Task already exists!",
      });
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();SubmitHandler
  //   const newTask = {
  //     title: formData.title,
  //     description: formData.description,
  //     dueDate: formData.date,
  //     color: formData.color,
  //   };

  //   onAddTask(newTask);ContentVisibilityAutoStateChangeEvent.
  // };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label>Task Title</label>
          <input {...register("title")} type="text" id="title" />
          {errors.title && (
            <div className="text-red-500">{errors.title?.message}</div>
          )}
        </div>
        <div className="mb-5">
          <label>Description</label>
          <input {...register("description")} type="text" />
          {errors.description && (
            <div className="text-red-500">{errors.description?.message}</div>
          )}
        </div>
        <div className="mb-5">
          <label>Date</label>
          <input {...register("date")} type="date" name="date" />
        </div>
        <div className="mb-5">
          <label>Color</label>
          <select {...register("color")} name="color">
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Create New Task"}
        </button>
        {errors.root && (
          <div className="text-red-500">{errors.root?.message}</div>
        )}
      </form>
    </>
  );
}
