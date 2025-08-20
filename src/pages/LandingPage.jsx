import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Ask AI Bot</h1>
      <p>
        This is a minimal AI-powered chatbot built for the Plivo assignment.
        Click below to try it out!
      </p>

      {/* Animated bordered button */}
      <button
        className="cta-button"
        onClick={() => navigate("/task")}
        aria-label="Go to Task"
      >
        <span className="cta-inner">Go to Task</span>
      </button>

      {/* Author credit kept visible but subtle */}
      <div className="landing-credit">
        <span>Created by</span>
        <strong> Abijith U K</strong>
        <span className="year">{new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
