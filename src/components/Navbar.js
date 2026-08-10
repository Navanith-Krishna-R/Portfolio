import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import Logo from "./Logo";
import { links, profile } from "../data/site";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Scroll spy — highlights the section currently occupying the upper band of
  // the viewport.
  useEffect(() => {
    if (!onHome || typeof IntersectionObserver === "undefined") return undefined;

    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  const goToSection = useCallback(
    (event, id) => {
      setOpen(false);

      if (onHome) return; // Let the browser handle the in-page anchor.

      event.preventDefault();
      navigate("/");
      // Wait for the home route to mount before scrolling to the target.
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      });
    },
    [navigate, onHome]
  );

  return (
    <header
      className={`site-nav${scrolled ? " is-scrolled" : ""}${
        open ? " is-open" : ""
      }`}
    >
      <div className="site-nav__inner">
        <Link to="/" className="brand" aria-label={`${profile.name} — home`}>
          <Logo size={36} className="brand__mark" />
          <span className="brand__name">{profile.name}</span>
        </Link>

        <button
          type="button"
          className={`nav-toggle${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`nav-menu${open ? " is-open" : ""}`}
          aria-label="Primary"
        >
          <ul className="nav-links">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`nav-link${
                    onHome && active === section.id ? " is-active" : ""
                  }`}
                  onClick={(event) => goToSection(event, section.id)}
                >
                  {section.label}
                </a>
              </li>
            ))}

            <li>
              <Link
                to="/resume"
                className={`nav-link${
                  location.pathname === "/resume" ? " is-active" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                Resume
              </Link>
            </li>

            <li className="nav-actions">
              <a
                className="nav-icon"
                href={links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
              >
                <FiGithub />
              </a>
              <a
                className="nav-icon"
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
              >
                <FiLinkedin />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
