// Action Types
const SET_NOTEBOOKS = "notebooks/set";
const ADD_NOTEBOOK = "notebooks/add";
const REMOVE_NOTEBOOK = "notebooks/remove";
const SET_NOTEBOOK = "notebooks/setOne"; // for updates

// Action Creators
const setNotebooks = (notebooks) => ({
  type: SET_NOTEBOOKS,
  payload: notebooks,
});

export const addNotebook = (notebook) => ({
  type: ADD_NOTEBOOK,
  payload: notebook,
});

export const removeNotebook = (notebookId) => ({
  type: REMOVE_NOTEBOOK,
  payload: notebookId,
});

const setNotebook = (notebook) => ({
  type: SET_NOTEBOOK,
  payload: notebook,
});

// Thunk: Fetch all notebooks
export const thunkFetchNotebooks = () => async (dispatch) => {
  const res = await fetch("/api/notebooks", {
    method: "GET",
    credentials: "include", // sends cookies/session
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setNotebooks(data.notebooks || []));
  } else {
    console.error("Failed to fetch notebooks");
  }
};


// Thunk: Create a notebook
export const thunkCreateNotebook = (title) => async (dispatch) => {
  const res = await fetch("/api/notebooks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (res.ok) {
    const newNotebook = await res.json();
    dispatch(addNotebook(newNotebook));
    return newNotebook;
  } else {
    const error = await res.json();
    throw error;
  }
};

// Thunk: Delete a notebook
export const thunkDeleteNotebook = (notebookId) => async (dispatch) => {
  const res = await fetch(`/api/notebooks/${notebookId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeNotebook(notebookId));
  } else {
    console.error("Failed to delete notebook");
  }
};

// Thunk: Update a notebook
export const thunkUpdateNotebook = (notebookId, updateData) => async (dispatch) => {
  const res = await fetch(`/api/notebooks/${notebookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  if (res.ok) {
    const updatedNotebook = await res.json();
    dispatch(setNotebook(updatedNotebook));
    return updatedNotebook;
  } else {
    const err = await res.json().catch(() => ({}));
    console.error("Failed to update notebook", err);
    return null;
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
    case SET_NOTEBOOK: {
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

