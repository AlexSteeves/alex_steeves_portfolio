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
      "Refactored front-end architecture using TypeScript and React Query to implement a fully responsive UI, reducing navigation time by 50% and ensuring cross-platform compatibility.",
      "Architected and managed PostgreSQL schemas and relational models, utilizing Alembic for database migrations to maintain version control and data integrity across environments.",
      "Developed modular Python backend services and calculation engines, focusing on code reusability and high-performance processing for core application logic.",
    ],
  },
  {
    company: "Canada Revenue Agency",
    location: "Ottawa, ON",
    role: "Data Analyst",
    period: "May 2023 – Sept 2023",
    highlights: [
      "Identified and fixed a 50% data discrepancy between the legacy and new databases using Excel and SAS Viya, ensuring data integrity and preventing potential data loss.",
      "Streamlined data processing and analysis by creating efficient reports using Cognos BI, improving reporting speed by 20%.",
    ],
  },
  {
    company: "Canada Border Services Agency",
    location: "Ottawa, ON",
    role: "Software Developer",
    period: "Jan 2022 – Jan 2023",
    highlights: [
      "Developed a component to automate email distribution using Java, SQL, and Apache POI, saving officers 80% of their time and increasing operational efficiency.",
      "Built a component that streamlined the storing and populating of boilerplate documents, saving officers hours of manual entry and improving document management efficiency.",
    ],
  },
];

const Experience: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section-title">Experience</h2>
      <div className="experience-list">
        {experiences.map((exp) => (
          <div key={exp.company} className="card experience-card">
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
        ))}
      </div>
    </section>
  );
};

export default Experience;
