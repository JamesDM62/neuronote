// redux/tasks.js

// Action Types
const SET_TASKS = "tasks/setTasks";

// Action Creators
const setTasks = (tasks) => ({
  type: SET_TASKS,
  tasks,
});

// Thunk: Fetch all tasks
export const thunkFetchTasks = () => async (dispatch) => {
  const res = await fetch("/api/tasks", {
    method: "GET",
    credentials: "include", // ✅ this tells the browser to send cookies
  });

  if (res.ok) {
    const data = await res.json(); // expects { tasks: [...] }
    dispatch(setTasks(data.tasks));
  } else {
    console.error("Failed to fetch tasks");
  }
};

// Thunk: Create a new task
export const thunkCreateTask = (taskData) => async (dispatch) => {
  const res = await fetch("/api/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(taskData),
  });

  if (res.ok) {
    const newTask = await res.json();
    dispatch({ type: "tasks/add", task: newTask });
    return newTask;
  } else {
    const error = await res.json().catch(() => ({}));
    console.error("Failed to create task:", error);
    return null;
  }
};

export const thunkUpdateTask = (taskId, updateData) => async (dispatch) => {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  if (res.ok) {
    const updatedTask = await res.json();
    dispatch({ type: "tasks/update", task: updatedTask });
    return updatedTask;
  } else {
    console.error("Failed to update task");
  }
};

// Thunk: Delete a task
export const thunkDeleteTask = (taskId) => async (dispatch) => {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (res.ok) {
    dispatch({ type: "tasks/delete", taskId });
  } else {
    const err = await res.json().catch(() => ({}));
    console.error("Failed to delete task:", err);
  }
};

// Reducer
const tasksReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_TASKS: {
      const newState = {};
      action.tasks.forEach((task) => {
        newState[task.id] = task;
      });
      return newState;
    }
    case "tasks/add": {
      return { ...state, [action.task.id]: action.task };
    }
    case "tasks/update": {
      return { ...state, [action.task.id]: action.task };
    }
    case "tasks/delete": {
      const newState = { ...state };
      delete newState[action.taskId];
      return newState;
    }
    default:
      return state;
  }
};

export default tasksReducer;

