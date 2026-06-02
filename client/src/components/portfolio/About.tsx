import type React from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const aboutText =
  "Computer Engineering grad with 2+ years of production experience across federal agencies and Autocase, a SaaS tool for LEED cost-benefit analysis. I've cut navigation time by 50%, saved officers 80% of their manual work, and caught a 50% data discrepancy between legacy databases before it caused data loss. I work across the full stack: Python, FastAPI, Java, Spring Boot, React, TypeScript, Postgres, and Docker. I use AI tools to move faster without losing sight of the problem.";

const About: React.FC = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = containerRef.current?.querySelectorAll("span");
      if (!words || words.length === 0) return;

      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: containerRef.current,
            scrub: true,
            start: "top 80%",
            end: "bottom 60%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section">
      <h2 className="section-title">About</h2>
      <div className="card about-card">
        <p className="about-text" ref={containerRef}>
          {aboutText.split(" ").map((word, i) => (
            <span key={i} style={{ display: "inline" }}>
              {word}
              {" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default About;
