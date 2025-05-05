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

export const thunkCreateTag = (name) => async (dispatch) => {
    const res = await fetch("/api/tags", {
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

export const thunkDeleteTag = (tagId) => async (dispatch) => {
    const res = await fetch(`/api/tags/${tagId}`, {
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
        case SET_TAGS: {
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
