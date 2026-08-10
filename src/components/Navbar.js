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

  // Scroll spy. Deliberately computed from scroll position rather than an
  // IntersectionObserver: intersectionRatio is relative to each target's own
  // height, so a full-height hero scores a *lower* ratio than a short section
  // sharing the same band and loses the comparison.
  useEffect(() => {
    if (!onHome) return undefined;

    let frame = 0;

    const compute = () => {
      frame = 0;

      // A probe line a third of the way down the viewport decides the section.
      const probe = window.scrollY + window.innerHeight * 0.34;
      let current = SECTIONS[0].id;

      SECTIONS.forEach((section) => {
        const el = document.getElementById(section.id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = section.id;
      });

      // The last section is usually too short to ever reach the probe line, so
      // resolve it explicitly once the page is scrolled to the bottom. The
      // `scrollable` guard matters: while the preloader holds the page at
      // `overflow: hidden; height: 100vh` there is nothing to scroll, and
      // without it every load would start out highlighting the last section.
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 4 && window.scrollY >= scrollable - 2) {
        current = SECTIONS[SECTIONS.length - 1].id;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
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
