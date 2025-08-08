import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // we'll make this file for styles

export default function Header() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark-mode"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark-mode" ? "light-mode" : "dark-mode");
  };

  return (
    <header className="header">
      {/* Left: Brand */}
      <Link to="/" className="brand">
        Plivo
      </Link>

      {/* Right: Buttons */}
      <div className="header-actions">
        <Link to="/task" className="task-link">
          Task
        </Link>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark-mode" ? "🌞" : "🌙"}
        </button>
      </div>
    </header>
  );
}
