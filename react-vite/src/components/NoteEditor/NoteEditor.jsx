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

export default function NoteEditor() {
  const { noteId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newTagName, setNewTagName] = useState("");

  const note = useSelector((state) => state.notes[noteId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const autosaveTimeout = useRef(null);

  useEffect(() => {
    dispatch(thunkFetchNote(noteId));
    dispatch(thunkFetchNoteTags(noteId));
  }, [dispatch, noteId]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  useEffect(() => {
    if (!note) return;

    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);

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

  if (!note) return <p>Loading note...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#41E296]/30 via-white to-[#00C4EE]/30 p-6">
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={() => navigate("/notes")}
            className="bg-[#41E296] text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition-shadow"
          >
            ✅ Done
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition-shadow"
          >
            🗑 Delete
          </button>
        </div>

        <input
          className="w-full text-2xl font-semibold mb-4 border-b border-gray-300 bg-transparent focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />

        <textarea
          className="w-full h-64 p-2 border rounded bg-white focus:outline-none resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note..."
        />

        <div className="mt-6">
          <h4 className="font-semibold">Tags</h4>
          {note.tags?.length > 0 ? (
            <ul className="list-none pl-0 mt-2">
              {note.tags.map((tag) => (
                <li key={tag.id} className="flex items-center">
                  {tag.name}
                  <button
                    onClick={() =>
                      dispatch(thunkDeleteTagFromNote(note.id, tag.id))
                    }
                    className="ml-2 text-red-500"
                    title="Delete tag"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm mt-2">No tags on this note.</p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTagName.trim()) return;
              dispatch(thunkCreateAndAssignTag(note.id, newTagName.trim()));
              setNewTagName("");
            }}
            className="mt-4 flex gap-2"
          >
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag name"
              className="flex-1 border p-1 rounded"
            />
            <button
              type="submit"
              className="bg-[#41E296] text-white px-3 py-1 rounded shadow md hover:shadow-lg transition-shadow bg-[#3ad18a]"
            >
              Add Tag
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}




