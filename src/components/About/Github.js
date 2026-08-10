import React from "react";
import GitHubCalendar from "react-github-calendar";
import { FiGithub } from "react-icons/fi";
import { githubUsername, links } from "../../data/site";

/** Gold ramp so the calendar sits inside the site palette instead of GitHub green. */
const calendarTheme = {
  level0: "#1b2027",
  level1: "#4a3d17",
  level2: "#87691f",
  level3: "#c39a30",
  level4: "#f5c542",
};

function Github() {
  return (
    <div className="card github-panel">
      <div className="github-panel__head">
        <div>
          <h3 className="github-panel__title">Contribution activity</h3>
          <p className="github-panel__sub">
            Public commits from the last year on @{githubUsername}
          </p>
        </div>

        <a
          className="btn-ghost"
          href={links.github}
          target="_blank"
          rel="noreferrer"
        >
          <FiGithub aria-hidden="true" />
          View GitHub Profile
        </a>
      </div>

      <div className="github-panel__calendar">
        <GitHubCalendar
          username={githubUsername}
          theme={calendarTheme}
          blockSize={12}
          blockMargin={4}
          blockRadius={2}
          fontSize={13}
          hideColorLegend={false}
        />
      </div>
    </div>
  );
}

export default Github;
