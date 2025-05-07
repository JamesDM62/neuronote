import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkFetchNote,
  thunkUpdateNote,
  thunkAssignTag,
  thunkUnassignTag,
} from "../../redux/notes";
import "./NoteEditor.css";

export default function NoteEditor() {
  const { noteId } = useParams();
  const dispatch = useDispatch();
  const note = useSelector((state) => state.notes[noteId]);
  const allTags = useSelector((state) => Object.values(state.tags));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const autosaveTimeout = useRef(null);

  // Initial fetch
  useEffect(() => {
    dispatch(thunkFetchNote(noteId));
  }, [dispatch, noteId]);

  // Populate title/content when note is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  // Autosave effect
  useEffect(() => {
    if (!note) return;

    // Cancel any existing autosave timeout
    if (autosaveTimeout.current) {
      clearTimeout(autosaveTimeout.current);
    }

    // Only autosave if data changed
    if (title !== note.title || content !== note.content) {
      autosaveTimeout.current = setTimeout(() => {
        dispatch(thunkUpdateNote(noteId, { title, content }));
        console.log("Autosaved note");
      }, 1000); // 1 second delay
    }

    // Clean up on unmount
    return () => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    };
  }, [title, content, dispatch, noteId, note]);

  if (!note) return <p>Loading note...</p>;

  return (
    <div className="note-editor">
      <input
        className="note-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
      />

      <textarea
        className="note-body"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note..."
      />

      <div className="note-tags">
        <h4>Tags</h4>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {allTags.map(tag => {
            const isAssigned = note?.tags?.some(t => t.id === tag.id);

            return (
              <li key={tag.id}>
                <button
                  onClick={() =>
                    isAssigned
                      ? dispatch(thunkUnassignTag(note.id, tag.id))
                      : dispatch(thunkAssignTag(note.id, tag.id))
                  }
                >
                  {isAssigned ? "✅ " : "⬜ "} {tag.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Manual save button is optional now, but you can keep it */}
      {/* <button onClick={() => dispatch(thunkUpdateNote(noteId, { title, content }))}>Save</button> */}
    </div>
  );
}



