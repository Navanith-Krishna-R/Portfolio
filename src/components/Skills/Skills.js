import React from "react";
import {
  FiCode,
  FiCpu,
  FiDatabase,
  FiLayout,
  FiServer,
  FiTool,
} from "react-icons/fi";
import Section from "../Section";
import Github from "../About/Github";
import { skills } from "../../data/site";

const CATEGORY_ICONS = {
  Languages: FiCode,
  Frontend: FiLayout,
  Backend: FiServer,
  Databases: FiDatabase,
  "Tools & Platforms": FiTool,
  Concepts: FiCpu,
};

function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Technical toolkit"
      lead="Technologies I've actually built with, grouped by where they sit in the stack."
      alt
    >
      <div className="skills__grid">
        {skills.map((group) => {
          const Icon = CATEGORY_ICONS[group.category] || FiCode;

          return (
            <article className="card skill-card" key={group.category}>
              <h3 className="skill-card__title">
                <Icon aria-hidden="true" />
                {group.category}
              </h3>

              <div className="skill-card__items">
                {group.items.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <Github />
    </Section>
  );
}

export default Skills;
