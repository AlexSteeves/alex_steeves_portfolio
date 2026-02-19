import type React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
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
          Home
        </NavLink>
        <NavLink
          to="/stocks"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Stocks
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
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
