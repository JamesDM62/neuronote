import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginFormModal.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        credential: email,
        password,
      })
    );
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal(); // Close modal on successful login
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        credential: "demo@aa.io",
        password: "password",
      })
    );
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal(); // Close modal on successful demo login
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={closeModal}>X</button>
        <h1 className="modal-header">Log In</h1>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-label">
            Email
            <input
              className="form-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or username"
              required
            />
          </label>
          {errors.email && <p className="error-message">{errors.email}</p>}
          
          <label className="form-label">
            Password
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>
          {errors.password && <p className="error-message">{errors.password}</p>}
          
          <button type="submit" className="login-button">Log In</button>
          <button type="button" className="demo-login-button" onClick={handleDemoLogin}>Demo Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginFormModal;

