import type React from "react";
import Hero from "../components/portfolio/Hero";
import About from "../components/portfolio/About";
import Experience from "../components/portfolio/Experience";
import Skills from "../components/portfolio/Skills";
import Contact from "../components/portfolio/Contact";

const Portfolio: React.FC = () => {
  return (
    <main className="page portfolio-page">
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
};

export default Portfolio;
