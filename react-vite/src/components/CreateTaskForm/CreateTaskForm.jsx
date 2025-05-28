import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateTask } from "../../redux/tasks";
import { useModal } from "../../context/Modal";
import './CreateTaskForm.css';  // Import the CSS file

export default function CreateTaskForm() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newTask = {
      title: title.trim(),
      description: description.trim(),
    };

    try {
      await dispatch(thunkCreateTask(newTask));
      closeModal();
    } catch (err) {
      const data = await err.json?.();
      setErrors(data?.errors || { general: "Something went wrong." });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full"
    >
      <h2 className="text-xl font-semibold">Create Task</h2>

      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title}</p>
      )}

      <input
        type="text"
        value={title}
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#41E296]"
      />

      <textarea
        value={description}
        placeholder="Description (optional)"
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#41E296] resize-none"
      />

      <button
        type="submit"
        className="w-full bg-[#41E296] text-white py-2 rounded shadow-md hover:bg-[#3ad18a] hover:shadow-lg transition-shadow"
      >
        Create Task
      </button>
    </form>
  );
}

