import React, { useEffect, useState } from "react";

const HOLD_MS = 2600;
const FADE_MS = 320;

/**
 * Rotates through `roles` one at a time with a soft crossfade — a quieter
 * replacement for the old Typewriter effect: no typing, no cursor, no
 * deleting. Each role holds for ~2.6s then fades out and the next fades in.
 *
 * The rotating text is aria-hidden; a screen reader gets the full role list
 * once as static text (rendered by the caller) rather than a live region that
 * would re-announce itself every few seconds.
 */
function RoleRotator({ roles }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Under reduced motion, or with nothing to rotate through, simply never
    // start the cycle — index stays at 0 and roles[0] is shown permanently.
    if (reduceMotion || roles.length <= 1) return undefined;

    let holdTimer;
    let fadeTimer;

    const cycle = () => {
      holdTimer = window.setTimeout(() => {
        setFading(true);
        fadeTimer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % roles.length);
          setFading(false);
          cycle();
        }, FADE_MS);
      }, HOLD_MS);
    };

    cycle();

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(fadeTimer);
    };
  }, [roles]);

  return (
    <span
      className={`hero__role-rotator${fading ? " is-fading" : ""}`}
      aria-hidden="true"
    >
      {roles[index]}
    </span>
  );
}

export default RoleRotator;
