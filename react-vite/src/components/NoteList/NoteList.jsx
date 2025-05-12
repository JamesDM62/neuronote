import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkFetchNotes } from "../../redux/notes";

export default function NoteList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notebookId = useSelector((state) => state.filters.notebookId);
  const rawNotes = useSelector((state) => state.notes);

  // ✅ Memoize notes list to prevent re-renders and selector warnings
  const notes = useMemo(() => {
    return Object.values(rawNotes).filter(
      (note) => note.notebook_id === notebookId
    );
  }, [rawNotes, notebookId]);

  useEffect(() => {
    if (notebookId) dispatch(thunkFetchNotes(notebookId));
  }, [dispatch, notebookId]);

  const handleClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  if (!notebookId) {
    return <p>Select a notebook to view notes.</p>;
  }

  return (
    <div>
      <h3>Notes</h3>
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




