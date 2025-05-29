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
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-black font-bold text-xl"
        >
          ×
        </button>
        <h1 className="text-2xl font-bold mb-4 text-primary">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or username"
              required
            />
          </label>
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <label className="block text-sm font-medium">
            Password
            <input
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-black font-semibold py-2 px-4 rounded shadow"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-secondary hover:bg-primary text-black font-semibold py-2 px-4 rounded shadow"
          >
            Demo Log In
          </button>
        </form>
      </div>
    </div>
  );

}

export default LoginFormModal;

