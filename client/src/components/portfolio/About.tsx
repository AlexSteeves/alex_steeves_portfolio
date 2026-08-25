import type React from "react";
import { motion } from "framer-motion";
import { staggerContainer, wordReveal, viewportOnce } from "../../lib/motion";

const aboutBlocks = [
  {
    label: "Background",
    text: "Computer Engineering grad with 2+ years of production experience across federal agencies and Autocase, a SaaS platform for LEED cost-benefit analysis. I've cut navigation time by 50%, saved officers 80% of their manual work, and caught a 50% data discrepancy between legacy databases before it caused data loss.",
  },
  {
    label: "Approach",
    text: "I build the data layer: PostgreSQL schemas, Python and FastAPI services, and the pipelines and reports that turn that data into something people can act on. I use AI tools to move faster without losing sight of the problem.",
  },
];

const About: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">About</h2>
      <div className="about-text-group">
        {aboutBlocks.map((block) => (
          <div key={block.label} className="about-block">
            <h3 className="eyebrow-label">{block.label}</h3>
            <motion.p
              className="about-text"
              variants={staggerContainer(0.015)}
              initial="initial"
              whileInView="enter"
              viewport={viewportOnce}
            >
              {block.text.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordReveal}
                  className={word.includes("%") ? "about-metric" : undefined}
                >
                  {word}
                  {" "}
                </motion.span>
              ))}
            </motion.p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
