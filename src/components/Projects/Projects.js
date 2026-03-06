import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";

// PROJECT IMAGES
import chatify from "../../Assets/Projects/Mental-Health.jpg";
import blog from "../../Assets/Projects/insightful.jpg";
import leaf from "../../Assets/Projects/EasyCheesy.png";
import suicide from "../../Assets/Projects/deepfake-detection.jpg";
import emotion from "../../Assets/Projects/Language-Detection.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>

        <h1 className="project-heading">
          My Recent <strong className="purple">Projects</strong>
        </h1>

        <p style={{ color: "white" }}>
          Here are some projects I’ve developed in full-stack development,
          machine learning, and AI systems.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>

          {/* CALMPANION */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={chatify}
              isBlog={false}
              title="Calmpanion"
              description="A full-stack mental health awareness platform with blogs, appointment booking, and donation system. Built using React, Next.js, Node.js, and Prisma with MongoDB/PostgreSQL."
              ghLink="https://github.com/Navanith-Krishna-R/Calmpanion"
            />
          </Col>

          {/* AI RESUME ANALYZER */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={blog}
              isBlog={false}
              title="InsightfulCV – AI Resume Analyzer"
              description="AI-powered ATS resume analysis platform built with Next.js, TypeScript, and TailwindCSS. Integrates Mistral AI via OpenRouter and Supabase for resume evaluation and job matching."
              ghLink="https://github.com/Navanith-Krishna-R/ai-resume-analyzer"
            />
          </Col>

          {/* EASY CHEESY */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={leaf}
              isBlog={false}
              title="EasyCheesy – Food Ordering Platform"
              description="A modern restaurant ordering platform built using Next.js, React, and MongoDB. Includes authentication middleware, admin dashboard, and responsive UI with TailwindCSS."
              ghLink="https://github.com/Navanith-Krishna-R"
            />
          </Col>

          {/* DEEPFAKE DETECTION */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={suicide}
              isBlog={false}
              title="Hybrid Deepfake Detection System"
              description="Deep learning pipeline for detecting manipulated media using RGB and frequency-domain features. Combines EfficientNet-B4 with transformer encoders for deepfake detection."
              ghLink="https://github.com/Navanith-Krishna-R"
            />
          </Col>

          {/* LANGUAGE DETECTION */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={emotion}
              isBlog={false}
              title="Language Detection & Translation"
              description="Multilingual translation web application built with Flask, HTML, CSS, and JavaScript. Uses langdetect and googletrans libraries for real-time language detection and translation."
              ghLink="https://github.com/Navanith-Krishna-R"
            />
          </Col>

        </Row>
      </Container>
    </Container>
  );
}

export default Projects;