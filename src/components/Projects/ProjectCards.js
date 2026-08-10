import React from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import projectImages from "./projectImages";

function ProjectCard({ project }) {
  const image = projectImages[project.image];

  return (
    <article className="card project-card">
      <div className="project-card__media">
        <img
          src={image}
          alt={`${project.title} — ${project.subtitle}`}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__subtitle">{project.subtitle}</p>
        <p className="project-card__desc">{project.description}</p>

        <div className="project-card__tags">
          {project.stack.map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>

        <div className="project-card__actions">
          <a
            className="btn-ghost"
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} source code on GitHub`}
          >
            <FiGithub aria-hidden="true" />
            Source
          </a>

          {/* Rendered only when a deployment actually exists. */}
          {project.demo && (
            <a
              className="btn-ghost"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} live demo`}
            >
              <FiExternalLink aria-hidden="true" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
