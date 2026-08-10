import React from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import Logo from "./Logo";
import { links, profile } from "../data/site";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <div className="brand">
          <Logo size={30} className="brand__mark" />
          <span className="brand__name">{profile.name}</span>
        </div>

        <p className="site-footer__meta">
          © {year} {profile.name} · Designed and built with React
        </p>

        <div className="site-footer__socials">
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
          <a
            className="btn-icon"
            href={`mailto:${links.email}`}
            aria-label="Send an email"
          >
            <FiMail />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
