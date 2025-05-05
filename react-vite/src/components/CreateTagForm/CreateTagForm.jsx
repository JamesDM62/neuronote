import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateTag } from "../../redux/tags";

export default function CreateTagForm() {
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await dispatch(thunkCreateTag(name));
      setName("");
    } catch (err) {
      alert(err.error || "Failed to create tag");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New tag"
      />
      <button type="submit">Add</button>
    </form>
  );
}
