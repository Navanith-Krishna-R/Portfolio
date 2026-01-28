import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>

            <p className="home-about-body">
              I’m <b className="purple">Navanith Krishna R</b>, a final-year{" "}
              <b className="purple">Computer Science</b> student at{" "}
              <b className="purple">BMS College of Engineering</b>, with a strong
              interest in building practical and user-focused software
              applications.
              <br />
              <br />
              I enjoy working with
              <i>
                <b className="purple">
                  {" "}
                  JavaScript, React, Node.js, Python, C++, and SQL{" "}
                </b>
              </i>
              and focus on writing clean, efficient, and maintainable code.
              <br />
              <br />
              My areas of interest include developing
              <i>
                <b className="purple">
                  {" "}
                  Web Applications, Data Science projects, and AI-based
                  solutions{" "}
                </b>
              </i>
              that solve real-world problems.
              <br />
              <br />
              I actively build projects using
              <b className="purple"> React.js </b> and
              <b className="purple"> Node.js </b>
              and continuously work on improving my problem-solving and
              development skills as I prepare for software engineering roles.
            </p>
          </Col>

          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;
