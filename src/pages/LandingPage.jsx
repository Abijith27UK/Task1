import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>AskMe Bot</h1>
      <p>
        This is a minimal AI-powered chatbot built for the Plivo assignment.
        Click below to try it out!
      </p>
      <button onClick={() => navigate("/task")}>Go to Task</button>
    </div>
  );
}
