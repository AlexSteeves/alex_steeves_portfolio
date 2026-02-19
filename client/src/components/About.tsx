import type React from "react";

const About: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">About</h2>
      <div className="card about-card">
        <p className="about-text">
          I'm a Computer Engineering graduate with 2+ years of experience across
          government agencies and the private sector. I focus on building
          responsive, usable applications with an eye for scalability — whether
          that's automating tedious workflows, building out SaaS platforms, or
          digging into data pipelines. I'm interested in all layers of software,
          from low-level systems to full-stack web apps.
        </p>
      </div>
    </section>
  );
};

export default About;
