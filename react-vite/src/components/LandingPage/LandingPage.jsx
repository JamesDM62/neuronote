import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source
          src="/20250526_2007_Vibrant Brain Signals_simple_compose_01jw7mfvc2er29xee6x14r0scn.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay with darkened background */}
      <div className="relative z-10 bg-black/70 backdrop-blur-sm">
        {/* Hero Section */}
        <section
          id="hero"
          className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-12 text-white"
        >
          <h1 className="text-5xl font-bold text-primary">Neuronote</h1>
          <p className="text-xl text-secondary mt-4">
            Your thoughts, organized and accessible anywhere.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-6 px-6 py-3 bg-primary hover:bg-secondary text-black font-semibold rounded shadow"
          >
            Get Neuronote
          </button>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white text-center"
        >
          <h2 className="text-3xl font-semibold text-primary mb-4">About</h2>
          <p className="max-w-3xl">
            Neuronote is a powerful note-taking platform designed for clarity,
            speed, and structure. Create notebooks, tag your ideas, and check
            off tasks — all in one place.
          </p>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white text-center"
        >
          <h2 className="text-3xl font-semibold text-primary mb-4">Features</h2>
          <ul className="space-y-2">
            <li>✔ Organize notes by notebooks and tags</li>
            <li>✔ Rich-text editing</li>
            <li>✔ Add tasks directly inside notes</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white text-center"
        >
          <h2 className="text-3xl font-semibold text-primary mb-4">Contact</h2>
          <p className="max-w-xl">
            Have questions or feedback? Reach out at{" "}
            <a
              href="mailto:james.d.mclain62@gmail.com"
              className="underline text-secondary"
            >
              support@neuronote.app
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

