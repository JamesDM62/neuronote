import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchTags, thunkDeleteTag } from "../../redux/tags";
import CreateTagForm from "../CreateTagForm/CreateTagForm";

export default function TagList() {
  const dispatch = useDispatch();
  const tags = useSelector((state) => Object.values(state.tags));

  useEffect(() => {
    dispatch(thunkFetchTags());
  }, [dispatch]);

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
        {tags.map((tag) => (
          <li
            key={tag.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "default"
            }}
          >
            <span>#{tag.name}</span>
            <button onClick={() => handleDelete(tag.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}




  