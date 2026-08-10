import React from "react";
import { FiAward } from "react-icons/fi";
import Section from "../Section";
import { education } from "../../data/site";

function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="education__grid">
        {education.map((item) => (
          <article className="card edu-card" key={item.institution}>
            <span className="edu-card__icon" aria-hidden="true">
              <FiAward />
            </span>

            <div>
              <h3 className="edu-card__degree">{item.degree}</h3>
              <p className="edu-card__inst">
                {item.institution} · {item.location}
              </p>
              <p className="edu-card__meta">
                <span>{item.period}</span>
                {item.note && (
                  <span className="edu-card__note">{item.note}</span>
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export default Education;
