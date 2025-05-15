import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateTask } from "../../redux/tasks";
import { useModal } from "../../context/Modal";

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
      description: description.trim()
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
    <form onSubmit={handleSubmit}>
      <h2>Create Task</h2>
      {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
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
