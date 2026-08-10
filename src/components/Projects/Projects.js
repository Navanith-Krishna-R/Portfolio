import React from "react";
import { FiGithub } from "react-icons/fi";
import Section from "../Section";
import ProjectCard from "./ProjectCards";
import { links, projects } from "../../data/site";

function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Things I've built"
      lead="Full-stack products and machine learning systems, each built end to end. Every link points to the actual repository."
    >
      <div className="projects__grid">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>

      <div className="projects__more">
        <a
          className="btn-ghost"
          href={links.github}
          target="_blank"
          rel="noreferrer"
        >
          <FiGithub aria-hidden="true" />
          See all repositories on GitHub
        </a>
      </div>
    </Section>
  );
}

export default Projects;
