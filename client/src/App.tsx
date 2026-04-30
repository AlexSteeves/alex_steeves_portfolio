import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/nav/NavBar";
import Portfolio from "./pages/Portfolio";
import SenateWatch from "./pages/SenateWatch";
import Projects from "./pages/Projects";
import TorontoEvents from "./pages/TorontoEvents";
import "./App.css";

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/senate-watch" element={<SenateWatch />} />
        <Route path="/toronto-events" element={<TorontoEvents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
