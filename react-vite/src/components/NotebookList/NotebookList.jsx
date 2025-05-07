import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchNotes } from "../../redux/notes";
import {
  thunkDeleteNotebook,
  thunkUpdateNotebook,
  thunkFetchNotebooks,
} from "../../redux/notebooks";
import { setNotebookFilter } from "../../redux/noteFilters";
import CreateNotebookForm from "../CreateNotebookForm/CreateNotebookForm";

export default function NotebookList() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const notebookObj = useSelector((state) => state.notebooks);
  const notebooks = useMemo(() => Object.values(notebookObj), [notebookObj]);
  const selectedNotebookId = useSelector((state) => state.filters.notebookId);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  

  useEffect(() => {
    if (!user) return;
    dispatch(thunkFetchNotebooks());
  }, [dispatch, user]);
  
  

  const handleSelect = (notebookId) => {
    dispatch(setNotebookFilter(notebookId));
    dispatch(thunkFetchNotes(notebookId));
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

  const startEdit = (notebook) => {
    setEditId(notebook.id);
    setEditTitle(notebook.title);
  };

  const saveEdit = async () => {
    if (editTitle.trim() === "") {
      alert("Notebook title cannot be empty");
      return;
    }

    await dispatch(thunkUpdateNotebook(editId, { title: editTitle }));
    setEditId(null);
    setEditTitle("");
  };

  return (
    <div>
      <h3>My Notebooks</h3>
      <CreateNotebookForm />
      <ul>
        {notebooks.map((notebook) => (
          <li
            key={notebook.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: selectedNotebookId === notebook.id ? "bold" : "normal",
            }}
          >
            {editId === notebook.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ marginRight: "4px" }}
                />
                <button onClick={saveEdit}>💾</button>
              </>
            ) : (
              <>
                <span onClick={() => handleSelect(notebook.id)}>
                  {notebook.title}
                </span>
                <div>
                  <button onClick={() => startEdit(notebook)}>✏️</button>
                  <button onClick={() => handleDelete(notebook.id)}>🗑</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}







