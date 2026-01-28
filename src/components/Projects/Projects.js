import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";

// ✅ EXISTING IMAGES (NO ERRORS)
import chatify from "../../Assets/Projects/chatify.png";
import blog from "../../Assets/Projects/blog.png";
import editor from "../../Assets/Projects/codeEditor.png";
import leaf from "../../Assets/Projects/leaf.png";
import suicide from "../../Assets/Projects/suicide.png";
import emotion from "../../Assets/Projects/emotion.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Projects</strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are some of the projects I’ve built as part of my academic and
          self-learning journey.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {/* CALMPANION */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={chatify}
              isBlog={false}
              title="Calmpanion"
              description="A full-stack mental health support platform that allows users to learn about mental health, book appointments, donate to initiatives, and share blogs. Built using React and Node.js with a focus on user privacy."
              ghLink="https://github.com/Navanith-Krishna-R/Calmpanion"
            />
          </Col>

          {/* AI RESUME ANALYZER */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={blog}
              isBlog={false}
              title="AI Resume Analyzer"
              description="A web application that analyzes resumes using NLP techniques, extracts key skills, and provides structured feedback. Built using React, Node.js, and Python."
              ghLink="https://github.com/Navanith-Krishna-R/ai-resume-analyzer"
            />
          </Col>

          {/* VEHICLE MANAGEMENT SYSTEM */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={editor}
              isBlog={false}
              title="Vehicle Management System"
              description="A backend-focused system for managing vehicles, telemetry data, and users. Implemented REST APIs using Node.js, Express, PostgreSQL, and JWT authentication."
              ghLink="https://github.com/Navanith-Krishna-R/vehicle-management-system"
            />
          </Col>

          {/* AI FOR URBAN FARMING */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={leaf}
              isBlog={false}
              title="AI-Based Urban Farming Assistant"
              description="An AI-driven application concept for sustainable urban farming that analyzes plant images and provides gardening recommendations for compact spaces."
              ghLink="https://github.com/Navanith-Krishna-R/urban-farming-ai"
            />
          </Col>

          {/* AI FOR SOCIAL GOOD */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={suicide}
              isBlog={false}
              title="AI for Social Good"
              description="An NLP-based project to detect suicide-related content on social media platforms and help in early identification for prevention."
              ghLink="https://github.com/Navanith-Krishna-R/AI_For_Social_Good"
            />
          </Col>

          {/* EMOTION DETECTION */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={emotion}
              isBlog={false}
              title="Emotion Detection System"
              description="A CNN-based emotion recognition system trained on facial expression datasets and integrated with OpenCV for real-time emotion detection."
              ghLink="https://github.com/Navanith-Krishna-R/Face_And_Emotion_Detection"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
