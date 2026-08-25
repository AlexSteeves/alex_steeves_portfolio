import type React from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, viewportOnce } from "../../lib/motion";

const skillGroups = [
  { label: "Languages", skills: ["Python", "TypeScript", "Java", "SQL"] },
  { label: "Data Platform", skills: ["Apache Doris", "Apache Superset"] },
  { label: "Tools & Platforms", skills: ["React", "Docker", "Kubernetes", "Git", "GCP"] },
];

const Skills: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Skills</h2>
      <motion.div
        className="skills-groups"
        variants={staggerContainer(0.08)}
        initial="initial"
        whileInView="enter"
        viewport={viewportOnce}
      >
        {skillGroups.map((group) => (
          <motion.div key={group.label} className="skills-group" variants={fadeInUp}>
            <h3 className="eyebrow-label">{group.label}</h3>
            <p className="skills-group-items">{group.skills.join(", ")}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;
