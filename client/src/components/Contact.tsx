import type React from "react";

const Contact: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Contact</h2>
      <div className="card contact-card">
        <p className="contact-text">
          Open to new opportunities, collaborations, or just a good conversation
          about software. Feel free to reach out through any of the channels
          below.
        </p>
        <div className="contact-links">
          <a href="mailto:alqusteeves@gmail.com" className="btn btn-primary">
            Email ↗
          </a>
          <a
            href="https://github.com/AlexSteeves"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/alexander-steeves/"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
