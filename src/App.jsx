import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Chatbot from "./pages/Chatbot";
import History from "./pages/History";
import Header from "./Header";
import "./index.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/task" element={<Chatbot />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
