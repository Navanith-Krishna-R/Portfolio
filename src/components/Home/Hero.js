import React from "react";
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin } from "react-icons/fi";
import HeroVisual from "./HeroVisual";
import { RESUME_PATH, links, profile } from "../../data/site";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="hero__status">
              <span className="hero__status-dot" aria-hidden="true" />
              Open to software engineering roles
            </p>

            <h1 className="hero__name">
              <span>{profile.name}</span>
            </h1>

            <div className="hero__roles">
              {profile.roles.map((role, index) => (
                <React.Fragment key={role}>
                  {index > 0 && (
                    <span className="hero__roles-sep" aria-hidden="true" />
                  )}
                  <span>{role}</span>
                </React.Fragment>
              ))}
            </div>

            <p className="hero__intro">{profile.intro}</p>

            <div className="hero__actions">
              <a className="btn-gold" href="#projects">
                View Projects
                <FiArrowRight aria-hidden="true" />
              </a>

              <a
                className="btn-ghost"
                href={RESUME_PATH}
                download="Navanith_Krishna_R_Resume.pdf"
              >
                <FiDownload aria-hidden="true" />
                Download Resume
              </a>

              <a
                className="btn-icon"
                href={links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
              >
                <FiGithub />
              </a>

              <a
                className="btn-icon"
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
              >
                <FiLinkedin />
              </a>
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="Scroll to About">
        <span className="hero__scroll-line" aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}

export default Hero;
