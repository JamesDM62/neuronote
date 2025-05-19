import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateNotebook } from "../../redux/notebooks";
import "./CreateNotebookForm.css";

export default function CreateNotebookForm() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState([]); // use array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // reset error state

    const notebook = { title, description, imageUrl };
    const res = await dispatch(thunkCreateNotebook(notebook));

    if (res?.errors) {
      setErrors(res.errors); // guaranteed to be array from thunk
    } else {
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-notebook-form">
      <h3>Create a New Notebook</h3>

      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((err, i) => (
            <p key={i} className="error">{err}</p>
          ))}
        </div>
      )}

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

