import type React from "react";

const About: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">About</h2>
      <div className="card about-card">
        <p className="about-text">
          Computer Engineering grad with 2+ years of production experience
          across federal agencies and Autocase, a SaaS tool for LEED
          cost-benefit analysis. I've cut navigation time by 50%, saved officers
          80% of their manual work, and caught a 50% data discrepancy between
          legacy databases before it caused data loss. I work across the full
          stack: Python, FastAPI, Java, Spring Boot, React, TypeScript,
          Postgres, and Docker. I use AI tools to move faster without losing
          sight of the problem.
        </p>
      </div>
    </section>
  );
};

export default About;
