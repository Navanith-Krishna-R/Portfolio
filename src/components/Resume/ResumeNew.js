import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { RESUME_PATH, profile } from "../../data/site";

/**
 * The worker is served from /public rather than a CDN so the viewer keeps
 * working offline and cannot break when a third-party host changes.
 * It is a copy of node_modules/pdfjs-dist/build/pdf.worker.min.js — refresh it
 * if pdfjs-dist is ever upgraded.
 */
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const DOWNLOAD_NAME = "Navanith_Krishna_R_Resume.pdf";
// Matches .resume-doc's own max-width (1000px) minus a little breathing room
// so the page's shadow always has room to read against the dark background.
const MAX_PAGE_WIDTH = 900;

function ResumeNew() {
  const containerRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(MAX_PAGE_WIDTH);
  const [numPages, setNumPages] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const measure = () => {
      const available = containerRef.current?.clientWidth ?? MAX_PAGE_WIDTH;
      setPageWidth(Math.min(available - 24, MAX_PAGE_WIDTH));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <main className="resume-page">
      <div className="wrap">
        <header className="resume-page__head">
          <div
            className="section-eyebrow"
            style={{ justifyContent: "center" }}
          >
            Resume
          </div>
          <h1 className="section-title">{profile.name}</h1>
          <p className="section-lead" style={{ margin: "0 auto" }}>
            {profile.roles.join(" · ")}
          </p>

          <div className="resume-page__actions">
            <a className="btn-gold" href={RESUME_PATH} download={DOWNLOAD_NAME}>
              <FiDownload aria-hidden="true" />
              Download Resume
            </a>
            <a
              className="btn-ghost"
              href={RESUME_PATH}
              target="_blank"
              rel="noreferrer"
            >
              <FiExternalLink aria-hidden="true" />
              Open in new tab
            </a>
          </div>
        </header>

        <div className="resume-doc" ref={containerRef}>
          {failed ? (
            <div className="card resume-fallback">
              <p>
                The inline preview couldn&apos;t be rendered in this browser.
                You can still open or download the PDF directly.
              </p>
              <a
                className="btn-gold"
                href={RESUME_PATH}
                target="_blank"
                rel="noreferrer"
              >
                <FiExternalLink aria-hidden="true" />
                Open Resume PDF
              </a>
            </div>
          ) : (
            <Document
              file={RESUME_PATH}
              onLoadSuccess={({ numPages: total }) => setNumPages(total)}
              onLoadError={() => setFailed(true)}
              onSourceError={() => setFailed(true)}
              loading={
                <p className="card resume-fallback">Loading resume…</p>
              }
            >
              {Array.from({ length: numPages }, (_, index) => (
                <Page
                  key={`page-${index + 1}`}
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          )}
        </div>
      </div>
    </main>
  );
}

export default ResumeNew;
