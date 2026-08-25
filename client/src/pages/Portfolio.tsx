import type React from "react";
import { useEffect } from "react";
import Hero from "../components/portfolio/Hero";
import About from "../components/portfolio/About";
import Experience from "../components/portfolio/Experience";
import Skills from "../components/portfolio/Skills";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import Contact from "../components/portfolio/Contact";

const Portfolio: React.FC = () => {
  useEffect(() => {
    // Prevent the browser from restoring the previous scroll position on
    // refresh — if it does, Hero's scroll-linked parallax (useScroll) reads
    // a non-zero scroll and applies a partial y-transform to the noise layer
    // before the page snaps back to the top, making it look like the height changes.
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  return (
    <main>
      {/* Hero is full viewport width — owns its own content margin */}
      <Hero />

      {/* Rest of page is constrained to page max-width */}
      <div className="page portfolio-page">
        <About />
        <Experience />
        <Skills />
        <ProjectsSection />
        <Contact />
      </div>
    </main>
  );
};

export default Portfolio;
