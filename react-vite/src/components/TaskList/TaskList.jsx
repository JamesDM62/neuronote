import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkFetchTasks,
  thunkUpdateTask,
  thunkDeleteTask,
} from "../../redux/tasks";
import OpenModalButton from "../OpenModalButton";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import './TaskList.css'

export default function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks || {});
  const user = useSelector((state) => state.session.user);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  useEffect(() => {
    if (user) dispatch(thunkFetchTasks());
  }, [dispatch, user]);

  const taskList = Object.values(tasks);

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditData({ title: task.title, description: task.description });
  };

  const handleSave = (taskId) => {
    dispatch(thunkUpdateTask(taskId, editData));
    setEditingTaskId(null);
  };

  const handleToggleComplete = (task) => {
    dispatch(
      thunkUpdateTask(task.id, {
        isComplete: !task.isComplete,
        title: task.title,
        description: task.description,
      })
    );
  };

  const handleDelete = (taskId) => {
    if (confirm("Delete this task?")) {
      dispatch(thunkDeleteTask(taskId));
    }
  };

  return (
    <div className="task-list" style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "8rem", }}>
      <h1>My Tasks</h1>
      <OpenModalButton
        buttonText="+ New Task"
        modalComponent={<CreateTaskForm />}
      />

      {taskList.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {taskList.map((task) => {
            const isEditing = editingTaskId === task.id;
            return (
              <li
                key={task.id}
                style={{
                  listStyle: "none",
                  marginBottom: "1.5rem",
                  border: "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={task.isComplete}
                    onChange={() => handleToggleComplete(task)}
                    id={`complete-${task.id}`}
                  />
                  <label htmlFor={`complete-${task.id}`}>
                    {task.isComplete ? "Complete" : "Incomplete"}
                  </label>
                  {isEditing ? (
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      style={{ flexGrow: 1 }}
                    />
                  ) : (
                    <h3
                      onClick={() => handleEditClick(task)}
                      style={{ margin: 0, cursor: "pointer", flexGrow: 1 }}
                    >
                      {task.title}
                    </h3>
                  )}
                  <button onClick={() => handleDelete(task.id)}>🗑</button>
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  {isEditing ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      style={{ width: "100%" }}
                    />
                  ) : task.description ? (
                    <p
                      onClick={() => handleEditClick(task)}
                      style={{ cursor: "pointer", marginTop: "0.5rem" }}
                    >
                      {task.description}
                    </p>
                  ) : null}
                </div>

                {isEditing && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <button onClick={() => handleSave(task.id)}>💾 Save</button>{" "}
                    <button onClick={() => setEditingTaskId(null)}>❌ Cancel</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}



