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
  const res = await fetch("/api/tasks");
  if (res.ok) {
    const data = await res.json(); // expects { tasks: [...] }
    dispatch(setTasks(data.tasks));
  } else {
    console.error("Failed to fetch tasks");
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
    default:
      return state;
  }
};

export default tasksReducer;

