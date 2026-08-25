import type React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import NoiseCanvas from "./NoiseCanvas";
import { slideMask } from "../../lib/motion";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "../../lib/constants";

const proofItems = [
  { number: "50%", label: "Navigation time cut" },
  { number: "80%", label: "Officer time saved" },
  { number: "2+", label: "Years in production" },
];

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0vh", "40vh"]);

  return (
    <section className="hero-section" ref={sectionRef}>
      {/* Parallax noise layer — translated on scroll via useScroll/useTransform */}
      <motion.div
        aria-hidden="true"
        className="hero-parallax-layer"
        style={{ y: parallaxY }}
      >
        <NoiseCanvas />
      </motion.div>

      {/* Fades the smoke into the flat page background instead of a hard cutoff */}
      <div className="hero-fade" aria-hidden="true" />

      {/* All content sits above the gradient, constrained to page width */}
      <div className="hero-content">
        <p className="hero-label">
          Data Platform &<br className="mobile-show" /> Analytics Engineer
        </p>
        <span className="hero-mark" aria-hidden="true" />

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

        <p className="hero-tagline mobile-hide">
          I design database schemas, build data pipelines, and ship the
          backend services that turn raw data into reports people actually
          use. My work has run in production at federal agencies and a SaaS
          analytics platform for two years.
        </p>
        <p className="hero-tagline mobile-show">
          I build data pipelines and backend services that turn raw data
          into reports people use, in production at federal agencies and a
          SaaS platform for 2+ years.
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

        <div className="hero-links">
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
            Get in Touch
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn">
            GitHub ↗
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn">
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
