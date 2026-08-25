import type React from "react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, viewportOnce } from "../../lib/motion";
import TimelineDivider from "./TimelineDivider";

interface ExperienceItem {
  company: string;
  location: string;
  role: string;
  period?: string;
  highlights: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: "Rumble",
    location: "Toronto, ON",
    role: "Data Platform & Analytics Engineer",
    period: "July 2026 – Present",
    highlights: [
      "Write Python scripts that ingest API usage data into Apache Doris tables.",
      "Build Superset dashboards on the Doris warehouse for internal analytics.",
      "Deploy and maintain a Kubernetes cluster running OpenMetadata for data cataloging.",
    ],
  },
  {
    company: "Autocase",
    location: "Toronto, ON",
    role: "Software Developer",
    period: "July 2024 – Feb 2026",
    highlights: [
      "Cut navigation time 50% by leading a front-end refactor with TypeScript and React Query.",
      "Designed PostgreSQL schemas and Falcon APIs, shipping migrations with zero downtime.",
      "Built out test coverage that cut production bugs 60%.",
      "Set up GCP monitoring that cut incident detection from 2+ hours to under 10 minutes.",
    ],
  },
  {
    company: "Canada Revenue Agency",
    location: "Ottawa, ON",
    role: "Data Analyst",
    period: "May 2023 – Sept 2023",
    highlights: [
      "Fixed a 50% data discrepancy between legacy and new databases before it caused data loss.",
      "Cut reporting time 20% by building Cognos BI reports that replaced manual data processing.",
    ],
  },
  {
    company: "Canada Border Services Agency",
    location: "Ottawa, ON",
    role: "Software Developer",
    period: "Jan 2022 – Jan 2023",
    highlights: [
      "Saved officers 80% of their manual work by automating email distribution with Java, SQL, and Apache POI.",
      "Eliminated hours of manual entry for federal officers by building a document automation tool for boilerplate generation.",
    ],
  },
];

const Experience: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Experience</h2>
      <motion.div
        className="experience-timeline"
        variants={staggerContainer()}
        initial="initial"
        whileInView="enter"
        viewport={viewportOnce}
      >
        {experiences.map((exp, i) => (
          <Fragment key={exp.company}>
            {i > 0 && <TimelineDivider index={i - 1} />}
            <motion.div className="timeline-item" variants={fadeInUp}>
              <div className="timeline-content">
                <div className="experience-header">
                  <div>
                    <h3 className="experience-company">{exp.company}</h3>
                    <p className="experience-role">{exp.role}</p>
                  </div>
                  <div className="experience-meta">
                    {exp.period && (
                      <span className="experience-period">{exp.period}</span>
                    )}
                    <span className="experience-location">{exp.location}</span>
                  </div>
                </div>
                <ul className="experience-highlights">
                  {exp.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </Fragment>
        ))}
      </motion.div>
    </section>
  );
};

export default Experience;
