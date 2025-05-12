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
    navigate("/notes");
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
    <div style={{ padding: "1rem" }}>
      <h2>My Notebooks</h2>
      <OpenModalButton
        buttonText="+ Create Notebook"
        modalComponent={<CreateNotebookForm />}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            onClick={() => handleSelect(notebook.id)}
            style={{
              width: "300px",
              border: selectedNotebookId === notebook.id ? "2px solid #333" : "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              position: "relative"
            }}
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
                style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "0.5rem", borderRadius: "4px" }}
              />
            )}
            <h3 style={{ marginBottom: "0.5rem" }}>{notebook.title}</h3>
            <p style={{ color: "#555" }}>{notebook.description}</p>
            <div style={{ position: "absolute", top: "8px", right: "8px" }}>
              <OpenModalButton
                buttonText="✏️"
                onButtonClick={(e) => e.stopPropagation()}
                modalComponent={<EditNotebookModal notebook={notebook} />}
              />
              <button onClick={(e) => { e.stopPropagation(); handleDelete(notebook.id); }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







