import type React from "react";
import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "../../lib/motion";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "../../lib/constants";

const Contact: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Contact</h2>
      <motion.div
        className="contact-card"
        variants={fadeInUp}
        initial="initial"
        whileInView="enter"
        viewport={viewportOnce}
      >
        <div className="contact-links">
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
            Send an Email ↗
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn">
            GitHub ↗
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn">
            LinkedIn ↗
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
