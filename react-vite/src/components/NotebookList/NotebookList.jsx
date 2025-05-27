import { useEffect, useState, useMemo } from "react";
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
import BackgroundMedia from "../BackgroundMedia/BackgroundMedia";
import './NotebookList.css'; // Ensure the CSS file is correctly linked

export default function NotebookList({ pageLayout = false, enableDoubleClickNav = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const notebookObj = useSelector((state) => state.notebooks);
  const notebooks = useMemo(() => Object.values(notebookObj), [notebookObj]);
  const selectedNotebookId = useSelector((state) => state.filters.notebookId);
  const [lastClickedId, setLastClickedId] = useState(null);

  useEffect(() => {
    if (!user) return;
    dispatch(thunkFetchNotebooks());
  }, [dispatch, user]);

  useEffect(() => {
    if (enableDoubleClickNav && selectedNotebookId !== lastClickedId) {
      setLastClickedId(null);
    }
  }, [selectedNotebookId, enableDoubleClickNav, lastClickedId]);

  const handleNotebookClick = (notebookId) => {
    if (enableDoubleClickNav && lastClickedId === notebookId) {
      navigate("/notes", { state: { notebookId } });
      return;
    }

    setLastClickedId(notebookId);
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

  const notebookListContent = (
    <>
      <h2 className="text-3xl font-bold text-primary mb-4">My Notebooks</h2>

      <OpenModalButton
        buttonText="+ Create Notebook"
        modalComponent={<CreateNotebookForm />}
        className="text-lg text-secondary hover:text-primary hover:underline font-semibold"
      />

      <div className="notebook-list">
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            onClick={() => handleNotebookClick(notebook.id)}
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
                onButtonClick={(e) => e?.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(notebook.id);
                }}
                className="delete-button"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (pageLayout) {
    return (
      <div className="relative min-h-screen">
        <BackgroundMedia
          src="/20250526_2007_Vibrant Brain Signals_simple_compose_01jw7mfvcged389phmbbecaz7g.mp4"
          type="video"
        />
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-[-5]" />
        <div className="notebook-list-container relative z-10">
          {notebookListContent}
        </div>
      </div>
    );
  }

  return <div className="notebook-list-container">{notebookListContent}</div>;
}

