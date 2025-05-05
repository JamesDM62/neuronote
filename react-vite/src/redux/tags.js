// Action Types
const SET_TAGS = "tags/set";

// Action Creator
const setTags = (tags) => ({
  type: SET_TAGS,
  payload: tags,
});

// Thunk: Fetch all tags
export const thunkFetchTags = () => async (dispatch) => {
  const res = await fetch("/api/tags");
  if (res.ok) {
    const data = await res.json();
    dispatch(setTags(data.tags || [])); // adjust if response shape differs
  } else {
    console.error("Failed to fetch tags");
  }
};

// Reducer
const initialState = {};

export default function tagsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TAGS: {
      const newState = {};
      action.payload.forEach((tag) => {
        newState[tag.id] = tag;
      });
      return newState;
    }
    default:
      return state;
  }
}
