import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchTags, thunkDeleteTag } from "../../redux/tags";
import { thunkFetchNotes } from "../../redux/notes";
import { setTagFilter, clearFilters } from "../../redux/noteFilters";
import CreateTagForm from "../CreateTagForm/CreateTagForm";

export default function TagList() {
  const dispatch = useDispatch();
  const tags = useSelector((state) => Object.values(state.tags));
  const selectedTagId = useSelector((state) => state.filters.tagId);

  useEffect(() => {
    dispatch(thunkFetchTags());
  }, [dispatch]);

  const handleTagSelect = (tagId) => {
    dispatch(setTagFilter(tagId));
    dispatch(thunkFetchNotes(null, tagId));
  };

  const handleClear = () => {
    dispatch(clearFilters());
    dispatch(thunkFetchNotes());
  };

  const handleDelete = async (tagId) => {
    const confirmed = confirm("Delete this tag?");
    if (!confirmed) return;

    try {
      await dispatch(thunkDeleteTag(tagId));
    } catch (err) {
      const error = await err.json?.();
      alert(error?.error || "Failed to delete tag");
    }
  };

  return (
    <div>
      <h3>Tags</h3>
      <CreateTagForm />
      <ul>
        <li
          onClick={handleClear}
          style={{
            fontWeight: selectedTagId === null ? "bold" : "normal",
            cursor: "pointer"
          }}
        >
          All Notes
        </li>
        {tags.map((tag) => (
          <li
            key={tag.id}
            style={{
              fontWeight: selectedTagId === tag.id ? "bold" : "normal",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span
              onClick={() => handleTagSelect(tag.id)}
              style={{ cursor: "pointer" }}
            >
              #{tag.name}
            </span>
            <button onClick={() => handleDelete(tag.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}



  