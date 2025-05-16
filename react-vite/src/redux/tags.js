// Action Types
const SET_NOTE_TAGS = "tags/setNoteTags";

// Action Creator
export const setNoteTags = (tags) => ({
    type: SET_NOTE_TAGS,
    payload: tags,
});


// Thunk: Fetch all tags
export const thunkFetchTags = () => async (dispatch) => {
    const res = await fetch("/api/tags");
    if (res.ok) {
        const data = await res.json();
        dispatch(setNoteTags(data.tags));
    } else {
        console.error("Failed to fetch tags");
    }
};

export const thunkFetchNoteTags = (noteId) => async (dispatch) => {
  const res = await fetch(`/api/notes/${noteId}/tags`);
  if (res.ok) {
    const data = await res.json(); // { tags: [...] }
    dispatch(setNoteTags(data.tags)); 
  } else {
    console.error("Failed to fetch tags for note", res.status);
  }
};

export const thunkCreateTag = (noteId, name) => async (dispatch) => {
    const res = await fetch(`/api/notes/${noteId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    if (res.ok) {
        const newTag = await res.json();
        dispatch({ type: "tags/add", payload: newTag });
        return newTag;
    } else {
        const error = await res.json();
        throw error;
    }
};

export const thunkDeleteTag = (noteId, tagId) => async (dispatch) => {
    const res = await fetch(`/api/notes/${noteId}/tags/${tagId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        dispatch({ type: "tags/remove", payload: tagId });
    } else {
        const error = await res.json();
        throw error;
    }
};

// Reducer
const initialState = {};

export default function tagsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_NOTE_TAGS: {
            const newState = {};
            action.payload.forEach((tag) => {
                newState[tag.id] = tag;
            });
            return newState;
        }
        case "tags/add": {
            return { ...state, [action.payload.id]: action.payload };
        }
        case "tags/remove": {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
}
