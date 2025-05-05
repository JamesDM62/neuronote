import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkFetchNote,
  thunkUpdateNote,
} from "../../redux/notes";
import "./NoteEditor.css";

export default function NoteEditor() {
  const { noteId } = useParams();
  const dispatch = useDispatch();
  const note = useSelector((state) => state.notes[noteId]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    dispatch(thunkFetchNote(noteId));
  }, [dispatch, noteId]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  const handleSave = () => {
    dispatch(thunkUpdateNote(noteId, { title, content }));
  };

  if (!note) return <p>Loading note...</p>;

  return (
    <div className="note-editor">
      <input
        className="note-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="note-body"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
