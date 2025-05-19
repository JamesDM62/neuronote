import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchNotes } from "../../redux/notes";
import { useNavigate } from "react-router-dom";
import {
  thunkDeleteNotebook,
  thunkFetchNotebooks,
} from "../../redux/notebooks";
import { setNotebookFilter } from "../../redux/noteFilters";
import CreateNotebookForm from "../CreateNotebookForm/CreateNotebookForm";
import OpenModalButton from "../OpenModalButton";
import EditNotebookModal from "../EditNotebookModal/EditNotebookModal";
import './NotebookList.css'; // Ensure the CSS file is correctly linked

export default function NotebookList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const notebookObj = useSelector((state) => state.notebooks);
  const notebooks = useMemo(() => Object.values(notebookObj), [notebookObj]);
  const selectedNotebookId = useSelector((state) => state.filters.notebookId);

  useEffect(() => {
    if (!user) return;
    dispatch(thunkFetchNotebooks());
  }, [dispatch, user]);

  const handleSelect = (notebookId) => {
    dispatch(setNotebookFilter(notebookId));
    dispatch(thunkFetchNotes(notebookId));
    navigate("/notes", { state: { notebookId } });
  };

  const handleDelete = async (notebookId) => {
    const confirmed = confirm("Delete this notebook?");
    if (!confirmed) return;

    await dispatch(thunkDeleteNotebook(notebookId));

    const fallback = notebooks.find((n) => n.id !== notebookId);
    if (fallback) {
      dispatch(setNotebookFilter(fallback.id));
      dispatch(thunkFetchNotes(fallback.id));
    }
  };

  return (
    <div className="notebook-list-container">
      <h2>My Notebooks</h2>
      <OpenModalButton
        buttonText="+ Create Notebook"
        modalComponent={<CreateNotebookForm />}
      />

      <div className="notebook-list">
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            onClick={() => handleSelect(notebook.id)}
            className={`notebook-card ${selectedNotebookId === notebook.id ? "selected" : ""}`}
          >
            {notebook.imageUrl && (
              <img
                src={notebook.imageUrl || "/default-notebook.jpg"}
                alt={notebook.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-notebook.jpg";
                }}
                className="notebook-image"
              />
            )}
            <h3>{notebook.title}</h3>
            <p>{notebook.description}</p>
            <div className="actions">
              <OpenModalButton
                buttonText="✏️"
                modalComponent={<EditNotebookModal notebook={notebook} />}
              />
              <button onClick={() => handleDelete(notebook.id)} className="delete-button">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
