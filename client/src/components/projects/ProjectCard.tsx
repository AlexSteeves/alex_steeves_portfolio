import type { Project } from "./projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="timeline-content">
      <div className="experience-header row-nowrap">
        <div className="min-w-0">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="project-card-title"
          >
            {project.name}
          </a>
          <p className="project-card-desc">{project.description}</p>
        </div>
        <a href={project.url} target="_blank" rel="noreferrer" className="btn no-shrink">
          GitHub →
        </a>
      </div>

      <ul className="experience-highlights">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag} className="skill-badge">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
