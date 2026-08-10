import React from "react";

/**
 * NK monogram — a geometric "N" and "K" sharing a common baseline inside a
 * rounded badge. Drawn as strokes so it stays legible from 16px (favicon) up
 * to the 74px preloader mark.
 */
function Logo({ size = 36, className = "", title = "NK monogram" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      focusable="false"
    >
      <defs>
        <linearGradient id="nk-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD95A" />
          <stop offset="100%" stopColor="#F5C542" />
        </linearGradient>
        <linearGradient id="nk-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5C542" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#F5C542" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F5C542" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <rect
        x="1.6"
        y="1.6"
        width="44.8"
        height="44.8"
        rx="12.5"
        fill="#12161A"
        stroke="url(#nk-edge)"
        strokeWidth="2"
      />

      <g
        stroke="url(#nk-gold)"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* N */}
        <path d="M11 33V16l9.5 15V16" />
        {/* K */}
        <path d="M27.5 16v17" />
        <path d="M36.5 16 27.5 25.5 36.5 33" />
      </g>
    </svg>
  );
}

export default Logo;
