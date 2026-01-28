import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi everyone! I’m <span className="purple">Navanith Krishna R</span>, a
            final-year <span className="purple">Computer Science</span> student
            at <span className="purple">BMS College of Engineering</span>,
            Bengaluru.
            <br />
            <br />
            I have a strong interest in{" "}
            <span className="purple">
              Web Development, Data Science, and AI-based applications
            </span>
            , and I enjoy building projects that solve real-world problems.
            <br />
            <br />
            I’ve worked with technologies such as{" "}
            <span className="purple">
              React, Node.js, Python, C++, SQL, and Git
            </span>
            , and I continuously focus on improving my problem-solving skills
            and understanding of core computer science concepts.
            <br />
            <br />
            Outside of academics and coding, I enjoy:
          </p>

          <ul>
            <li className="about-activity">
              <ImPointRight /> Building and experimenting with side projects
            </li>
            <li className="about-activity">
              <ImPointRight /> Solving coding and algorithmic problems
            </li>
            <li className="about-activity">
              <ImPointRight /> Learning new technologies and tools
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            “Consistently learning and building meaningful software.”
          </p>
          <footer className="blockquote-footer">
            Navanith Krishna R
          </footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
