import ProjectCard from "../components/projects/ProjectCard";
import { projects } from "../components/projects/projects";

export default function Projects() {
  return (
    <main className="page">
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            color: "var(--text-primary)",
            marginBottom: "0.25rem",
          }}
        >
          Projects
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          A collection of personal and side projects.
        </p>
      </div>

      <div className="experience-list">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </main>
  );
}
