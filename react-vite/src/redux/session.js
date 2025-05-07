const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

// Action creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

// Thunk to restore user session (on app load)
export const thunkRestoreUser = () => async (dispatch) => {
  const response = await fetch('/api/session');
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else {
    dispatch(removeUser());
  }
};

// Thunk to log in
export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ✅ REQUIRED
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: 'Something went wrong. Please try again' };
  }
};

// Thunk to sign up
export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: 'Something went wrong. Please try again' };
  }
};

// Thunk to log out
export const thunkLogout = () => async (dispatch) => {
  const res = await fetch("/api/auth/logout", {
    method: "DELETE",
    credentials: "include", // REQUIRED
  });

  if (res.ok) {
    dispatch(removeUser()); // ⬅️ This removes user from Redux
  } else {
    console.error("❌ Logout failed");
  }
};


// Reducer
const initialState = { user: null };

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };
    case REMOVE_USER:
      return { user: null };
    default:
      return state;
  }
}
