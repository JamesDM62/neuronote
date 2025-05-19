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

  const reduxNotebookId = useSelector((state) => state.filters.notebookId);
  const notebookId = reduxNotebookId || location.state?.notebookId;
  const rawNotes = useSelector((state) => state.notes);

  const notes = useMemo(() => {
    return Object.values(rawNotes).filter(
      (note) => note.notebookId === notebookId 
    );
  }, [rawNotes, notebookId]);

  useEffect(() => {
    if (notebookId) dispatch(thunkFetchNotes(notebookId));
  }, [dispatch, notebookId]);

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
            <li key={note.id} onClick={() => handleClick(note.id)}>
              {note.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}





