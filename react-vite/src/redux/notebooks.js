// Action Types
const SET_NOTEBOOKS = "notebooks/set";
const ADD_NOTEBOOK = "notebooks/add";
const REMOVE_NOTEBOOK = "notebooks/remove";

// Action Creators
const setNotebooks = (notebooks) => ({
  type: SET_NOTEBOOKS,
  payload: notebooks,
});

const addNotebook = (notebook) => ({
  type: ADD_NOTEBOOK,
  payload: notebook,
});

const removeNotebook = (notebookId) => ({
  type: REMOVE_NOTEBOOK,
  payload: notebookId,
});

// Thunk: Fetch all notebooks
export const thunkFetchNotebooks = () => async (dispatch) => {
  const res = await fetch("/api/notebooks");

  if (res.ok) {
    const data = await res.json();
    dispatch(setNotebooks(data.notebooks || [])); // or just data if response is flat
  } else {
    console.error("Failed to fetch notebooks");
  }
};

// Reducer
const initialState = {};

export default function notebooksReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTEBOOKS: {
      const newState = {};
      action.payload.forEach((notebook) => {
        newState[notebook.id] = notebook;
      });
      return newState;
    }
    case ADD_NOTEBOOK: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case REMOVE_NOTEBOOK: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
}
