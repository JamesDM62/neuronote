import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkFetchNotes } from "../../redux/notes";

export default function NoteList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notes = useSelector((state) => Object.values(state.notes));

  useEffect(() => {
    dispatch(thunkFetchNotes());
  }, [dispatch]);

  const handleClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <div>
      <h3>Notes</h3>
      <ul>
        {notes.map((note) => (
          <li key={note.id} onClick={() => handleClick(note.id)}>
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
