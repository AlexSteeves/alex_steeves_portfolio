import type React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import SenateWatch from "./pages/SenateWatch";
import Projects from "./pages/Projects";
import "./App.css";

function NavBar(): React.ReactElement {
  return (
    <nav className="navbar">
      <span className="nav-brand">Alex Steeves</span>
      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/senate-watch"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Senate Watch
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Projects
        </NavLink>
      </div>
    </nav>
  );
}

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/senate-watch" element={<SenateWatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
