import type React from "react";
import { useEffect } from "react";
import Hero from "../components/portfolio/Hero";
import About from "../components/portfolio/About";
import Experience from "../components/portfolio/Experience";
import Skills from "../components/portfolio/Skills";
import Projects from "../components/portfolio/Projects";
import Contact from "../components/portfolio/Contact";

const Portfolio: React.FC = () => {
  useEffect(() => {
    // Prevent the browser from restoring the previous scroll position on
    // refresh — if it does, GSAP ScrollTrigger initialises with a non-zero
    // scroll and applies a partial y-transform to the gradient before the
    // page snaps back to the top, making it look like the height changes.
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
        <Projects />
        <Contact />
      </div>
    </main>
  );
};

export default Portfolio;
