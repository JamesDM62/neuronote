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
    <form onSubmit={handleSubmit} className="create-task-form">
      <h2>Create Task</h2>
      {errors.title && <p className="error">{errors.title}</p>}
      <input
        type="text"
        value={title}
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        value={description}
        placeholder="Description (optional)"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Create Task</button>
    </form>
  );
}

