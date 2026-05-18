import type React from "react";
import { projects } from "../projects/projects";

const portfolioProjects = projects.filter(
  (p) => p.name !== "Philips Hue Light Automation",
);

const Projects: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Projects</h2>
      <div className="experience-timeline">
        {portfolioProjects.map((project) => (
          <div key={project.name} className="timeline-item">
            <div className="timeline-marker">
              <div className="timeline-dot-ring" />
              <div className="timeline-line-dashed" />
            </div>
            <div className="timeline-content">
              <div
                className="experience-header"
                style={{ flexWrap: "nowrap", alignItems: "center" }}
              >
                <div style={{ minWidth: 0 }}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="experience-company"
                    style={{ textDecoration: "none" }}
                  >
                    {project.name}
                  </a>
                  <p
                    className="experience-role"
                    style={{ color: "var(--text-secondary)", fontWeight: 400 }}
                  >
                    {project.description}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  GitHub →
                </a>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {project.tags.map((tag) => (
                  <span key={tag} className="skill-badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
