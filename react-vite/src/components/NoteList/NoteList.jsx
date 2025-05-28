import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { thunkFetchNotes } from "../../redux/notes";
import CreateNoteBtn from "../CreateNoteBtn/CreateNoteBtn";

export default function NoteList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionUser = useSelector((state) => state.session.user);
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
      dispatch(thunkFetchNotes(notebookId, sessionUser.id));
    }
  }, [dispatch, notebookId, sessionUser?.id]);

  // 🌟 This is the fix
  const isDashboard = location.pathname === "/dashboard";

  const WrapperClass = isDashboard
    ? "notes-page-container"
    : "min-h-screen bg-gradient-to-br from-[#41E296]/30 via-white to-[#00C4EE]/30 p-6";

  const InnerWrapperClass = isDashboard
    ? ""
    : "max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg";

  const handleClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  if (!notebookId) {
    return (
      <div className={WrapperClass}>
        <div className={InnerWrapperClass}>
          <h3 className="text-xl font-semibold mb-2">Notes</h3>
          <p>No notebook selected. Please choose one from My Notebooks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={WrapperClass}>
      <div className={InnerWrapperClass}>
        <h3 className="text-xl font-bold mb-4">Notes</h3>
        <CreateNoteBtn />
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {notes.map((note) => (
              <li key={note.id}>
                <span
                  onClick={() => handleClick(note.id)}
                  className="cursor-pointer text-blue-700 hover:underline"
                >
                  {note.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}







