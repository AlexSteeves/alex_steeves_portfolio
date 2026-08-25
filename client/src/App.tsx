import type React from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import NavBar from "./components/nav/NavBar";
import Portfolio from "./pages/Portfolio";
import SmoothScroll from "./components/SmoothScroll";
import ThemeProvider from "./components/ThemeProvider";
import "./App.css";

const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));

function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <SmoothScroll>
            <NavBar />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/projects" element={<ProjectsPage />} />
              </Routes>
            </Suspense>
          </SmoothScroll>
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
