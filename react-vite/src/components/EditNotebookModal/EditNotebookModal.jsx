import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdateNotebook } from "../../redux/notebooks";
import './EditNotebookModal.css'

export default function EditNotebookModal({ notebook }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [title, setTitle] = useState(notebook.title || "");
    const [description, setDescription] = useState(notebook.description || "");
    const [imageUrl, setImageUrl] = useState(notebook.imageUrl || "");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const updated = await dispatch(
            thunkUpdateNotebook(notebook.id, { title, description, imageUrl })
        );

        if (updated?.errors) {
            setErrors(updated.errors);
        } else {
            closeModal();
        }
    };

    return (
        <div className="edit-notebook-modal">
            <h2>Edit Notebook</h2>
            <form onSubmit={handleSubmit}>
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
                        rows={4}
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

                {errors.server && <p className="error">{errors.server}</p>}

                <div style={{ marginTop: "1rem" }}>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </div>
            </form>

        </div>
    );
}
