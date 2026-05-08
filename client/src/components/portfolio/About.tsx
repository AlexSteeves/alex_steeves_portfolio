import type React from "react";

const About: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">About</h2>
      <div className="card about-card">
        <p className="about-text">
          Computer Engineering grad with 2+ years of production experience at
          government agencies and a SaaS startup. I've automated federal
          workflows, rebuilt platforms from the ground up, and shipped data
          tools as projects I actually use. I work across the whole stack:
          Python backends, SQL schemas, React UIs. I care about writing software
          that's fast, maintainable, and does exactly what it's supposed to. I
          use AI tools in my workflow to move faster without cutting corners on
          quality or understanding.
        </p>
      </div>
    </section>
  );
};

export default About;
