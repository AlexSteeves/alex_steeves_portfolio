import type React from "react";

const skills: string[] = [
  "TypeScript",
  "React",
  "Next.js",
  "Java",
  "SQL",
  "Hono",
  "Vite",
  "Bun",
  "Cloudflare",
  "GCP",
  "Node.js",
  "Git",
];

const Skills: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Skills</h2>
      <div className="card">
        <div className="skills-grid">
          {skills.map((skill) => (
            <span key={skill} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
