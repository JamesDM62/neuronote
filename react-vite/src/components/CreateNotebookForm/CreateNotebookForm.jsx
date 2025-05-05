import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateNotebook } from "../../redux/notebooks";

export default function CreateNotebookForm() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await dispatch(thunkCreateNotebook(title));
      setTitle(""); // Clear input
    } catch (err) {
      alert(err.error || "Failed to create notebook");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New notebook"
      />
      <button type="submit">Add</button>
    </form>
  );
}
