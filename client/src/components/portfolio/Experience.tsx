import type React from "react";

interface ExperienceItem {
  company: string;
  location: string;
  role: string;
  period?: string;
  highlights: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: "Autocase",
    location: "Toronto, ON",
    role: "Software Developer",
    period: "July 2024 – Feb 2026",
    highlights: [
      "Cut navigation time 50% by refactoring the front end with TypeScript and React Query into a fully responsive UI.",
      "Designed PostgreSQL schemas and ran Alembic migrations across all environments with zero data integrity issues.",
      "Built modular Python backend services and calculation engines that power the core SaaS application in production.",
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
      <div className="experience-timeline">
        {experiences.map((exp) => (
          <div key={exp.company} className="timeline-item">
            <div className="timeline-marker">
              <div className="timeline-dot" />
              <div className="timeline-line" />
            </div>
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
