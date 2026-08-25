import { Fragment } from "react";
import { motion } from "framer-motion";
import ProjectCard from "../components/projects/ProjectCard";
import { projects } from "../components/projects/projects";
import { staggerContainer, fadeInUp, viewportOnce } from "../lib/motion";
import TimelineDivider from "../components/portfolio/TimelineDivider";

export default function ProjectsPage() {
  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          A collection of personal and side projects.
        </p>
      </div>

      <motion.div
        className="experience-timeline"
        variants={staggerContainer()}
        initial="initial"
        whileInView="enter"
        viewport={viewportOnce}
      >
        {projects.map((project, i) => (
          <Fragment key={project.name}>
            {i > 0 && <TimelineDivider index={i - 1} />}
            <motion.div className="timeline-item" variants={fadeInUp}>
              <ProjectCard project={project} />
            </motion.div>
          </Fragment>
        ))}
      </motion.div>
    </main>
  );
}
