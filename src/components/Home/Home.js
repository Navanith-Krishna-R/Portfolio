import React from "react";
import Hero from "./Hero";
import About from "../About/About";
import Experience from "../Experience/Experience";
import Projects from "../Projects/Projects";
import Skills from "../Skills/Skills";
import Education from "../Education/Education";
import Contact from "../Contact/Contact";

/** The landing page: one continuous scroll through every section. */
function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}

export default Home;
