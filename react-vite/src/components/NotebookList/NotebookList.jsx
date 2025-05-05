import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchNotebooks } from "../../redux/notebooks";

export default function NotebookList() {
  const dispatch = useDispatch();
  const notebooks = useSelector((state) => Object.values(state.notebooks));

  useEffect(() => {
    dispatch(thunkFetchNotebooks());
  }, [dispatch]);

  return (
    <div>
      <h3>My Notebooks</h3>
      <ul>
        {notebooks.map((notebook) => (
          <li key={notebook.id}>{notebook.title}</li>
        ))}
      </ul>
    </div>
  );
}
