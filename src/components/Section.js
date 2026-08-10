import React from "react";
import useReveal from "../hooks/useReveal";

/**
 * Standard section shell: anchor id, eyebrow / title / lead header and the
 * reveal-on-scroll behaviour, so every section lines up on the same rhythm.
 */
function Section({ id, eyebrow, title, lead, alt = false, children }) {
  const ref = useReveal();

  return (
    <section
      id={id}
      className={`section${alt ? " section--alt" : ""}`}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <div className="wrap reveal" ref={ref}>
        {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
        {title && (
          <h2 className="section-title" id={`${id}-title`}>
            {title}
          </h2>
        )}
        {lead && <p className="section-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export default Section;
