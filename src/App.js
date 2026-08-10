import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Preloader from "./components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import "./style.css";
import "./App.css";

// react-pdf is heavy and only the /resume route needs it, so it is split out
// of the main bundle.
const Resume = lazy(() => import("./components/Resume/ResumeNew"));

/**
 * The hero's light-shaft backdrop (body::before in style.css) is tuned
 * specifically for the home layout — its left-to-right gradient exists to
 * protect the left-aligned hero copy, and it has no meaning against a
 * centred page like /resume. It lives on <body> rather than inside Home so
 * it can sit at a negative z-index below the whole document, which means
 * nothing in CSS alone stops it from also rendering on every other route.
 * This toggles a class so the CSS selector can require it.
 */
function RouteBodyClass() {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("is-home", location.pathname === "/");
  }, [location.pathname]);

  return null;
}

function App() {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoad(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />

      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <Navbar />
        <ScrollToTop />
        <RouteBodyClass />

        <main id="main">
          <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resume" element={<Resume />} />
              {/* Legacy routes from the previous multi-page layout. */}
              <Route path="/about" element={<Navigate to="/#about" replace />} />
              <Route
                path="/project"
                element={<Navigate to="/#projects" replace />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
