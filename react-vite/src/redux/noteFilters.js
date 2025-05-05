// Action types
const SET_NOTEBOOK_FILTER = "filters/setNotebookFilter";

// Action creator
export const setNotebookFilter = (notebookId) => ({
  type: SET_NOTEBOOK_FILTER,
  payload: notebookId,
});

// Reducer
export default function filtersReducer(state = { notebookId: null }, action) {
  switch (action.type) {
    case SET_NOTEBOOK_FILTER:
      return { notebookId: action.payload };
    default:
      return state;
  }
}
