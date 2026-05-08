import type React from "react";
import { motion } from "framer-motion";

const slideMask = {
  initial: { y: "100%" },
  enter: (i: number) => ({
    y: "0%",
    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1] as const,
      delay: 0.075 * i,
    },
  }),
};

const proofItems = [
  { number: "Gov", label: "Federal workflow automation" },
  { number: "SaaS", label: "Full platform rebuild" },
  { number: "2+", label: "Years in production" },
];

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <p className="hero-label">Full-Stack Developer</p>

      <div className="line-mask" style={{ marginBottom: "1.5rem" }}>
        <motion.h1
          className="hero-name"
          custom={0}
          variants={slideMask}
          initial="initial"
          animate="enter"
        >
          Alex Steeves
        </motion.h1>
      </div>

      <p className="hero-tagline">
        I build full-stack software that does things people notice. Government
        automation that meaningfully changed how officers work. A SaaS platform
        rebuilt from the ground up. Live data tools I ship in my own time.
      </p>

      <div className="hero-proof">
        {proofItems.map((item, i) => (
          <motion.div
            key={item.number}
            className="hero-proof-item"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
              delay: 0.6 + i * 0.1,
            }}
          >
            <span className="hero-proof-number">{item.number}</span>
            <span className="hero-proof-label">{item.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="hero-stack">
        {["TypeScript", "React", "Python", "SQL", "Cloudflare"].map((tech) => (
          <span key={tech} className="hero-stack-chip">
            {tech}
          </span>
        ))}
      </div>

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
