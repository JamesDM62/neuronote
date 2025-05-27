import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { thunkFetchNotes } from "../../redux/notes";
import CreateNoteBtn from "../CreateNoteBtn/CreateNoteBtn";
import './NoteList.css'

export default function NoteList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionUser = useSelector((state) => state.session.user);  // Access sessionUser from Redux store
  const reduxNotebookId = useSelector((state) => state.filters.notebookId);
  const notebookId = reduxNotebookId || location.state?.notebookId;
  const rawNotes = useSelector((state) => state.notes);

  const notes = useMemo(() => {
    return Object.values(rawNotes).filter(
      (note) => note.notebookId === notebookId
    );
  }, [rawNotes, notebookId]);

  useEffect(() => {
    if (notebookId && sessionUser?.id) {
      dispatch(thunkFetchNotes(notebookId, sessionUser.id));  // Pass sessionUser.id to fetch notes
    }
  }, [dispatch, notebookId, sessionUser?.id]);  // Only depend on notebookId and sessionUser.id

  const handleClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  if (!notebookId) {
    return (
      <div className="notes-page-container">
        <h3>Notes</h3>
        <p>No notebook selected. Please choose one from My Notebooks.</p>
      </div>
    );
  }

  return (
    <div className="notes-page-container">
      <h3>Notes</h3>
      <CreateNoteBtn />
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <span
                onClick={() => handleClick(note.id)}
                className="note-link"
              >
                {note.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}





