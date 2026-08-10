import React from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import useReveal from "../../hooks/useReveal";
import { links, profile } from "../../data/site";

function Contact() {
  const ref = useReveal();

  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="wrap reveal" ref={ref}>
        <div className="contact__panel">
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>
            Contact
          </div>

          <h2 className="contact__title" id="contact-title">
            Let&apos;s build something <span className="accent">together</span>
          </h2>

          <p className="contact__text">
            I&apos;m open to software engineering opportunities, internships and
            interesting technical projects. The fastest way to reach me is
            email — I usually reply within a day.
          </p>

          <div className="contact__actions">
            <a className="btn-gold" href={`mailto:${links.email}`}>
              <FiMail aria-hidden="true" />
              Get In Touch
            </a>
            <Link className="btn-ghost" to="/resume">
              <FiFileText aria-hidden="true" />
              View Resume
            </Link>
          </div>

          <div className="contact__channels">
            <a className="contact__channel" href={`mailto:${links.email}`}>
              <FiMail aria-hidden="true" />
              {links.email}
            </a>

            <a
              className="contact__channel"
              href={links.github}
              target="_blank"
              rel="noreferrer"
            >
              <FiGithub aria-hidden="true" />
              github.com/Navanith-Krishna-R
            </a>

            <a
              className="contact__channel"
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <FiLinkedin aria-hidden="true" />
              linkedin.com/in/navanith-krishna-r
            </a>

            <span className="contact__channel">{profile.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
