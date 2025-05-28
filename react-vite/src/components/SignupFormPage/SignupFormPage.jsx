import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

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

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
      >
        <source
          src="/20250526_2207_Vibrant Brain Waves_simple_compose_01jw7vb9j6fmway0436rb2pjqb.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-[-1]" />

      {/* Centered Form */}
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-white/90 rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>

          {errors.server && <p className="text-red-600 text-sm mb-4">{errors.server}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-black rounded-md"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-black rounded-md"
              />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-black rounded-md"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-black rounded-md"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-[#41E296] text-white font-semibold py-2 px-4 rounded-md shadow-xl hover:bg-[#32c283] border-2 border-black transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;

