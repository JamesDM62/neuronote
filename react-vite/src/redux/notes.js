// Action Types
const SET_NOTES = "notes/set";
const SET_NOTE = "notes/setOne";

// Action Creators
const setNotes = (notes) => ({
  type: SET_NOTES,
  payload: notes,
});

const setNote = (note) => ({
  type: SET_NOTE,
  payload: note,
});

// Thunk: Fetch one note by ID
export const thunkFetchNote = (noteId) => async (dispatch) => {
  const res = await fetch(`/api/notes/${noteId}`);
  if (res.ok) {
    const note = await res.json();
    dispatch(setNote(note));
  }
};

// Thunk: Fetch all notes
export const thunkFetchNotes = () => async (dispatch) => {
    const res = await fetch("/api/notes");
    if (res.ok) {
      const data = await res.json();
      dispatch(setNotes(data.notes || [])); // adjust if needed
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
    console.error("Failed to update note");
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
    default:
      return state;
  }
}
