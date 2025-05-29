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
  const response = await fetch('/api/session', {
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    if (data && data.id) {
      dispatch(setUser(data));
    } else {
      dispatch(removeUser()); // user is null or invalid
    }
  } else {
    dispatch(removeUser()); // request failed entirely
  }
};



export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return null;
  } else if (response.status < 500) {
    const errorMessages = await response.json(); // ⬅️ backend errors (e.g. { errors: [...] })
    return errorMessages;
  } else {
    return { errors: ["An error occurred. Please try again."] }; // ← generic fallback
  }
};


function getCSRFToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const thunkSignup = ({ email, username, password }) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    credentials: 'include',
    body: JSON.stringify({
      email,
      username,
      password,
      first_name: 'Test',
      last_name: 'User'
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return null;
  } else {
    const errorData = await response.json(); // { email: [...], password: [...], ... }

    const flatErrors = [];
    for (const field in errorData) {
      errorData[field].forEach((msg) => flatErrors.push(msg));
    }

    return { errors: flatErrors };
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
