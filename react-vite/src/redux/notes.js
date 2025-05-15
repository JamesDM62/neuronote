// Action Types
const SET_NOTES = "notes/set";
const SET_NOTE = "notes/setOne";
const REMOVE_NOTE = "notes/remove";

// Action Creators
const setNotes = (notes) => ({
    type: SET_NOTES,
    payload: notes,
});

const setNote = (note) => ({
    type: SET_NOTE,
    payload: note,
});

const removeNote = (noteId) => ({
    type: REMOVE_NOTE,
    payload: noteId,
});

// Thunk: Fetch one note by ID
export const thunkFetchNote = (noteId) => async (dispatch) => {
    const res = await fetch(`/api/notes/${noteId}`);
    if (res.ok) {
        const note = await res.json();
        dispatch(setNote(note));
    } else {
        console.error("Failed to fetch note", res.status);
    }
};

// Thunk: Fetch all notes for a specific notebook
export const thunkFetchNotes = (notebookId, tagId) => async (dispatch) => {
    let url;

    if (notebookId) {
        url = `/api/notebooks/${notebookId}/notes`;
    } else if (tagId) {
        url = `/api/notes/by-tag/${tagId}`;
    } else {
        console.error("thunkFetchNotes requires notebookId or tagId");
        return;
    }

    const res = await fetch(url);

    if (res.ok) {
        const data = await res.json();
        dispatch(setNotes(data.notes || []));
    } else {
        console.error("Failed to fetch notes from:", url, res.status);
    }
};


// Thunk: Create a new note in a notebook (default to first notebook)
export const thunkCreateNote = (notebookId) => async (dispatch) => {
    if (!notebookId) {
        console.error("thunkCreateNote requires a notebookId");
        return;
    }

    const res = await fetch(`/api/notebooks/${notebookId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
    });

    if (res.ok) {
        const newNote = await res.json();
        dispatch(setNote(newNote));
        return newNote;
    } else {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to create note:", err);
        return null;
    }
};

// Thunk: Update a note
export const thunkUpdateNote = (noteId, updateData) => async (dispatch) => {
    const res = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });

    if (res.ok) {
        const updatedNote = await res.json();
        dispatch(setNote(updatedNote));
    } else {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to update note:", err);
    }
};

// Thunk: Delete a note
export const thunkDeleteNote = (noteId) => async (dispatch) => {
    const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        dispatch(removeNote(noteId));
    } else {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to delete note:", err);
    }
};

// Thunk: Create and assign a new tag to a note
export const thunkCreateAndAssignTag = (noteId, name) => async (dispatch) => {
  const res = await fetch(`/api/notes/${noteId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (res.ok) {
    const updatedNote = await res.json();
    dispatch(setNote(updatedNote));
  } else {
    const error = await res.json().catch(() => ({}));
    console.error("Failed to create/assign tag:", error);
  }
};


// Thunk: Assign a tag to a note
export const thunkAssignTag = (noteId, tagId) => async (dispatch, getState) => {
  const tag = getState().tags[tagId];
  if (!tag) {
    console.error("Tag not found in state:", tagId);
    return;
  }

  const res = await fetch(`/api/notes/${noteId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: tag.name }), // backend expects a name
  });

  if (res.ok) {
    const updatedNote = await res.json();
    dispatch(setNote(updatedNote));
  } else {
    const error = await res.json().catch(() => ({}));
    console.error("Failed to assign tag:", error);
  }
};


// Thunk: Unassign a tag from a note
export const thunkUnassignTag = (noteId, tagId) => async (dispatch) => {
    const res = await fetch(`/api/notes/${noteId}/tags/${tagId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        const updatedNote = await res.json();
        dispatch(setNote(updatedNote));
    }
};

// Reducer
const initialState = {};

export default function notesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_NOTES: {
            const newState = {};
            action.payload.forEach((note) => {
                newState[note.id] = note;
            });
            return newState;
        }
        case SET_NOTE: {
            return { ...state, [action.payload.id]: action.payload };
        }
        case REMOVE_NOTE: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
}
