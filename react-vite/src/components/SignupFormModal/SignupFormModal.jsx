import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse?.errors) {
      const formatted = {};
      serverResponse.errors.forEach((err) => {
        if (err.toLowerCase().includes("email")) formatted.email = err;
        else if (err.toLowerCase().includes("username")) formatted.username = err;
        else if (err.toLowerCase().includes("password") && !err.toLowerCase().includes("confirm"))
          formatted.password = err;
        else formatted.server = err;
      });
      setErrors(formatted);
    } else {
      closeModal();
    }

  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={closeModal}>X</button>
        <h1 className="modal-header">Sign Up</h1>
        {errors.server && <p className="error-message">{errors.server}</p>}
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-label">
            Email
            <input
              className="form-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="error-message">{errors.email}</p>}

          <label className="form-label">
            Username
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p className="error-message">{errors.username}</p>}

          <label className="form-label">
            Password
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="error-message">{errors.password}</p>}

          <label className="form-label">
            Confirm Password
            <input
              className="form-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

          <button
            type="submit"
            className="w-[80%] mx-auto block bg-[#41E296] text-white font-bold py-2 px-4 rounded-md shadow-xl hover:bg-[#32c283] border-2 border-black transition duration-300 mt-6"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;

