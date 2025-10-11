interface Props {
  onAddTask: () => void;
  onCloseForm: () => void;
}

import { useState } from "react";

export default function TaskForm({ onAddTask, onCloseForm }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.date,
      color: formData.color,
    };

    onAddTask(newTask);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="desc">Description</label>
          <input
            type="text"
            id="desc"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="desc">Description</label>
          <input
            type="date"
            id="desc"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="color">Color</label>
          <select
            name="color"
            value={formData.color}
            id="color"
            onChange={handleChange}
          >
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </div>
        <button type="submit">Create New Task</button>
      </form>
    </>
  );
}
