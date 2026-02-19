import type React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Contact from "../components/Contact";

const Home: React.FC = () => {
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

export default Home;
