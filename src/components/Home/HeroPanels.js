import React from "react";
import { FiCode } from "react-icons/fi";

/**
 * Small decorative "glass" panels floating around the hero lattice —
 * dark, translucent, gold-accented readouts that gesture at the themes of the
 * portfolio (a running system, a trained model, a connected API, the stack).
 *
 * These are explicitly NOT live data or claimed statistics — the 82% and
 * "ONLINE" are set dressing, the same way a concept render shows a dashboard
 * with placeholder numbers. Marked aria-hidden and excluded from the tab
 * order for that reason; nothing here is informational.
 */
function HeroPanels() {
  return (
    <div className="hero__panels" aria-hidden="true">
      <div className="hero__panel hero__panel--status">
        <span className="hero__panel-label">System Status</span>
        <span className="hero__panel-value">
          <span className="hero__panel-dot" />
          Online
        </span>
      </div>

      <div className="hero__panel hero__panel--model">
        <span className="hero__panel-label">AI Model</span>
        <span className="hero__panel-bar">
          <span className="hero__panel-bar-fill" />
        </span>
      </div>

      <div className="hero__panel hero__panel--api">
        <span className="hero__panel-label">API</span>
        <span className="hero__panel-value">
          <span className="hero__panel-dot" />
          Connected
        </span>
      </div>

      <div className="hero__panel hero__panel--stack">
        <span className="hero__panel-label">
          <FiCode aria-hidden="true" /> Stack
        </span>
        <span className="hero__panel-chips">
          <span>React</span>
          <span>Node.js</span>
          <span>MongoDB</span>
        </span>
      </div>
    </div>
  );
}

export default HeroPanels;
