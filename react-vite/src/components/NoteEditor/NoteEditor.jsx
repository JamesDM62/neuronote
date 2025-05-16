import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkFetchNote,
  thunkUpdateNote,
  thunkCreateAndAssignTag,
  thunkDeleteTagFromNote,
  thunkDeleteNote,
} from "../../redux/notes";

import { thunkFetchNoteTags } from "../../redux/tags";
import "./NoteEditor.css";

export default function NoteEditor() {
  const { noteId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newTagName, setNewTagName] = useState("");

  const note = useSelector((state) => state.notes[noteId]);
  // const allTagsObj = useSelector((state) => state.tags);
  // const tagList = useMemo(() => Object.values(allTagsObj), [allTagsObj]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const autosaveTimeout = useRef(null);

  // Fetch the note and all tags when the component mounts
  useEffect(() => {
    dispatch(thunkFetchNote(noteId));
    dispatch(thunkFetchNoteTags(noteId));
  }, [dispatch, noteId]);

  // Populate title/content when note is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  // Autosave note when title/content change
  useEffect(() => {
    if (!note) return;

    if (autosaveTimeout.current) {
      clearTimeout(autosaveTimeout.current);
    }

    if (title !== note.title || content !== note.content) {
      autosaveTimeout.current = setTimeout(() => {
        dispatch(thunkUpdateNote(noteId, { title, content }));
        console.log("Autosaved note");
      }, 1000);
    }

    return () => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    };
  }, [title, content, dispatch, noteId, note]);



  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    await dispatch(thunkDeleteNote(noteId));
    navigate("/notes");
  };

  // const handleToggleTag = (tag) => {
  //   const isAssigned = note?.tags?.some((t) => t.id === tag.id);
  //   if (isAssigned) {
  //     dispatch(thunkDeleteTagFromNote(note.id, tag.id));
  //   }
  // };

  if (!note) return <p>Loading note...</p>;

  return (
    <div className="note-editor">
      <div className="note-editor-controls" style={{ marginBottom: "0.5rem" }}>
        <button onClick={handleDelete}>🗑 Delete Note</button>
      </div>

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
        {note.tags?.length > 0 ? (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {note.tags.map((tag) => (
              <li key={tag.id}>
                {tag.name}
                <button
                  onClick={() => dispatch(thunkDeleteTagFromNote(note.id, tag.id))}
                  style={{ color: "red", marginLeft: "0.5rem" }}
                  title="Delete tag"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tags on this note.</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTagName.trim()) return;
            dispatch(thunkCreateAndAssignTag(note.id, newTagName.trim()));
            setNewTagName("");
          }}
          style={{ marginTop: "1rem" }}
        >
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            style={{ marginRight: "0.5rem" }}
          />
          <button type="submit">Add Tag</button>
        </form>

      </div>
    </div>
  );
}




