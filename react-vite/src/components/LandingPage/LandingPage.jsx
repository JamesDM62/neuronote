import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section id="hero" className="landing-section">
        <h1>Neuronote</h1>
        <p className="motto">Your thoughts, organized and accessible anywhere.</p>
        <button onClick={() => navigate("/signup")}>Get Neuronote</button>
      </section>

      {/* About Section */}
      <section id="about" className="landing-section">
        <h2>About</h2>
        <p>
          Neuronote is a powerful note-taking platform designed for clarity, speed, and structure.
          Create notebooks, tag your ideas, and check off tasks — all in one place.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-section">
        <h2>Features</h2>
        <ul>
          <li>✔ Organize notes by notebooks and tags</li>
          <li>✔ Rich-text editing</li>
          <li>✔ Add tasks directly inside notes</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section id="contact" className="landing-section">
        <h2>Contact</h2>
        <p>
          Have questions or feedback? Reach out at <a href="mailto:james.d.mclain62@gmail.com">support@neuronote.app</a>
        </p>
      </section>
    </div>
  );
}

