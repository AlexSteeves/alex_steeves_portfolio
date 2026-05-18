import type { Project } from "./projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card experience-card">
      <div className="experience-header" style={{ flexWrap: "nowrap", alignItems: "center" }}>
        <div style={{ minWidth: 0 }}>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "1.05rem",
              fontWeight: 600,
            }}
          >
            {project.name}
          </a>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
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

      <ul className="experience-highlights">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1rem" }}>
        {project.tags.map((tag) => (
          <span key={tag} className="skill-badge">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
