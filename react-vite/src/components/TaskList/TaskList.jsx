import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchTasks } from "../../redux/tasks";

export default function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks || {});

  useEffect(() => {
    dispatch(thunkFetchTasks());
  }, [dispatch]);

  const taskList = Object.values(tasks);

  return (
    <div className="task-list">
      <h1>My Tasks</h1>
      {taskList.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {taskList.map((task) => (
            <li key={task.id} style={{ marginBottom: "1rem" }}>
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <p>Status: {task.isComplete ? "✅ Complete" : "⬜ Incomplete"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
