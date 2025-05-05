import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchTags } from "../../redux/tags";

export default function TagList() {
  const dispatch = useDispatch();
  const tags = useSelector((state) => Object.values(state.tags));

  useEffect(() => {
    dispatch(thunkFetchTags());
  }, [dispatch]);

  return (
    <div>
      <h3>Tags</h3>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>#{tag.name}</li>
        ))}
      </ul>
    </div>
  );
}

  