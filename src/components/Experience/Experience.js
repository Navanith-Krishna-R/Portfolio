import React from "react";
import Section from "../Section";
import { experience } from "../../data/site";

function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've worked"
      lead="Internships in applied AI engineering and networking research."
      alt
    >
      <div className="timeline">
        {experience.map((role) => (
          <article
            className="card timeline__item"
            key={`${role.company}-${role.period}`}
          >
            <div className="timeline__head">
              <h3 className="timeline__role">{role.role}</h3>
              <span className="timeline__period">{role.period}</span>
            </div>

            <p className="timeline__meta">
              <strong>{role.company}</strong> · {role.location}
            </p>

            <ul className="timeline__points">
              {role.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <div className="tag-row">
              {role.stack.map((tech) => (
                <span className="tag" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export default Experience;
