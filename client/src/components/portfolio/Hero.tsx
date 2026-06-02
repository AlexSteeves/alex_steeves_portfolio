import type React from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NoiseCanvas from "./NoiseCanvas";

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
  { number: "50%", label: "Navigation time cut" },
  { number: "80%", label: "Officer time saved" },
  { number: "2+", label: "Years in production" },
];

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(gradientRef.current, {
        y: "40vh",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={sectionRef}>
      {/* Parallax noise layer — GSAP translates this wrapper on scroll */}
      <div
        ref={gradientRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "140vh",
          zIndex: 0,
          willChange: "transform",
          overflow: "hidden",
        }}
      >
        <NoiseCanvas />
      </div>

      {/* All content sits above the gradient, constrained to page width */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1300px",
          width: "100%",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <p className="hero-label">Full-Stack Developer</p>
        <span className="hero-plus" aria-hidden="true">
          +
        </span>

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
          Backend services, React frontends, database schemas. I work across the
          full stack at federal agencies and startups. Everything ships to
          production and gets used by real teams.
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
          {[
            "TypeScript",
            "Python",
            "React",
            "Docker",
            "FastAPI",
            "Java",
            "Postgres",
            "Spring Boot",
          ].map((tech) => (
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
      </div>
    </section>
  );
};

export default Hero;
