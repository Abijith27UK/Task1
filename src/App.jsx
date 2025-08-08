import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Chatbot from "./pages/Chatbot";
import Header from "./Header";
import "./index.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/task" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
