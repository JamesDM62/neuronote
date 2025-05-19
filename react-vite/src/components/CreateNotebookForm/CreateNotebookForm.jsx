import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateNotebook } from "../../redux/notebooks";
import "./CreateNotebookForm.css"; // Import the CSS file for styling

export default function CreateNotebookForm() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newNotebook = { title, description, imageUrl };
    const created = await dispatch(thunkCreateNotebook(newNotebook));

    if (created?.errors) {
      setErrors(created.errors);
    } else {
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-notebook-form">
      <h3>Create a New Notebook</h3>
      {errors.title && <p className="error">{errors.title}</p>}
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <label>
        Image URL
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </label>

      <button type="submit">Create</button>
    </form>
  );
}

