import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdateTask } from "../../redux/tasks";
import { useModal } from "../../context/Modal";

export default function EditTaskForm({ task }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [isComplete, setIsComplete] = useState(task.isComplete);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await dispatch(
      thunkUpdateTask(task.id, { title, description, isComplete })
    );
    if (updated) closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Task</h2>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        <input
          type="checkbox"
          checked={isComplete}
          onChange={(e) => setIsComplete(e.target.checked)}
        />
        Completed
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
