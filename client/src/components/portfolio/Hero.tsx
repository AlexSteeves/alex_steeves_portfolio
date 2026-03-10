import type React from "react";

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <p className="hero-label">
        Full-Stack Developer | TypeScript, React & Python
      </p>
      <h1 className="hero-name">Alex Steeves</h1>
      <p className="hero-tagline">
        Computer Engineering graduate building responsive, scalable applications
        across all layers of the stack — from systems to full-stack web.
      </p>
      <div className="hero-links">
        <a href="mailto:alqusteeves@gmail.com" className="btn btn-primary">
          Get in Touch
        </a>
        <a
          href="https://github.com/AlexSteeves"
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          GitHub ↗
        </a>
        <a
          href="https://linkedin.com/in/alexander-steeves/"
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          LinkedIn ↗
        </a>
      </div>
    </section>
  );
};

export default Hero;
