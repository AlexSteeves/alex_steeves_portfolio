import type React from "react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { projects } from "../projects/projects";
import { staggerContainer, fadeInUp, viewportOnce } from "../../lib/motion";
import TimelineDivider from "./TimelineDivider";

const portfolioProjects = projects.filter(
  (p) => p.name !== "Philips Hue Light Automation",
);

const ProjectsSection: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Projects</h2>
      <motion.div
        className="experience-timeline"
        variants={staggerContainer()}
        initial="initial"
        whileInView="enter"
        viewport={viewportOnce}
      >
        {portfolioProjects.map((project, i) => (
          <Fragment key={project.name}>
            {i > 0 && <TimelineDivider index={i - 1} />}
            <motion.div className="timeline-item" variants={fadeInUp}>
              <div className="timeline-content">
                <div className="experience-header row-nowrap">
                  <div className="min-w-0">
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
                  <a href={project.url} target="_blank" rel="noreferrer" className="btn no-shrink">
                    GitHub →
                  </a>
                </div>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag} className="skill-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Fragment>
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
