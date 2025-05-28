import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkFetchTasks,
  thunkUpdateTask,
  thunkDeleteTask,
} from "../../redux/tasks";
import OpenModalButton from "../OpenModalButton";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";

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
    <div className="min-h-screen bg-gradient-to-br from-[#41E296]/30 via-white to-[#00C4EE]/30 p-6">
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

        <OpenModalButton
          buttonText="+ New Task"
          modalComponent={<CreateTaskForm />}
          className="mb-6 bg-[#41E296] text-white px-4 py-2 rounded shadow-md hover:bg-[#3ad18a] hover:shadow-lg transition-shadow"
        />

        {taskList.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {taskList.map((task) => {
              const isEditing = editingTaskId === task.id;
              return (
                <li
                  key={task.id}
                  className="border border-gray-300 p-4 rounded-lg shadow-md bg-white"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.isComplete}
                      onChange={() => handleToggleComplete(task)}
                      id={`complete-${task.id}`}
                    />
                    <label htmlFor={`complete-${task.id}`} className="text-sm">
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
                        className="flex-grow px-2 py-1 border rounded"
                      />
                    ) : (
                      <h3
                        onClick={() => handleEditClick(task)}
                        className="cursor-pointer flex-grow font-semibold"
                      >
                        {task.title}
                      </h3>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete task"
                    >
                      🗑
                    </button>
                  </div>

                  <div className="mt-2">
                    {isEditing ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full border p-2 rounded"
                      />
                    ) : task.description ? (
                      <p
                        onClick={() => handleEditClick(task)}
                        className="cursor-pointer mt-1 text-sm"
                      >
                        {task.description}
                      </p>
                    ) : null}
                  </div>

                  {isEditing && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleSave(task.id)}
                        className="bg-[#41E296] text-white px-3 py-1 rounded shadow-md hover:bg-[#3ad18a] hover:shadow-lg transition-shadow"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}




