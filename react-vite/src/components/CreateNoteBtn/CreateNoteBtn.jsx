import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkCreateNote } from "../../redux/notes";

export default function CreateNoteBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notebookId = useSelector((state) => state.filters.notebookId);

  const handleCreate = async () => {
    if (!notebookId) {
      alert("Select a notebook first.");
      return;
    }

    const newNote = await dispatch(thunkCreateNote(notebookId));
    if (newNote?.id) navigate(`/notes/${newNote.id}`);
  };

  return <button onClick={handleCreate}>+ New Note</button>;
}





  