import React from "react";
import Section from "../Section";
import { highlights, profile } from "../../data/site";

function About() {
  return (
    <Section id="about" eyebrow="About" title="Building software that ships">
      <div className="about__grid">
        <div className="about__body">
          <p>{profile.summary}</p>
          <p>
            I&apos;m a final-year Computer Science and Engineering student at{" "}
            <strong className="accent">BMS College of Engineering</strong>,
            Bengaluru. Most of my time goes into building end-to-end products —
            designing the data model, writing the API, and putting a responsive
            interface in front of it.
          </p>
          <p>
            Alongside web development I work on applied machine learning: a
            hybrid deepfake detection model, an LLM-powered resume analyzer, and
            VANET simulation research at my college. I care about clean,
            readable code and about understanding the fundamentals underneath
            the frameworks.
          </p>
        </div>

        <div className="about__cards">
          {highlights.map((item) => (
            <article className="card info-card" key={item.label}>
              <p className="info-card__label">{item.label}</p>
              <p className="info-card__value">{item.value}</p>
              <p className="info-card__detail">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default About;
