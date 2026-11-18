import React from "react";

// A butterfly drawn in the same line style as the app's other icons: a single
// stroke in the current text colour, no fill and no background, so it takes the
// colour of the tile it sits in. Sized to fill that tile rather than shrink to
// the small icon size used elsewhere.
export default function ButterflyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M11.9 10.7C11 8.5 9.1 6.7 7 6.6 5.1 6.5 3.7 7.9 4 9.7c.4 2.2 2.6 3.7 5.1 3.6 1.2 0 2.1-.4 2.8-1.1" />
      <path d="M11.9 13.9c-1.2.6-2.4 1.6-3.2 2.9-1 1.5-1 3.1.2 3.9 1.3.9 3.1 0 4-1.6.5-1 .8-2.1.8-3.3" />
      <g transform="translate(24 0) scale(-1 1)">
        <path d="M11.9 10.7C11 8.5 9.1 6.7 7 6.6 5.1 6.5 3.7 7.9 4 9.7c.4 2.2 2.6 3.7 5.1 3.6 1.2 0 2.1-.4 2.8-1.1" />
        <path d="M11.9 13.9c-1.2.6-2.4 1.6-3.2 2.9-1 1.5-1 3.1.2 3.9 1.3.9 3.1 0 4-1.6.5-1 .8-2.1.8-3.3" />
      </g>
      <path d="M12 9.2v9.6" />
      <path d="M11.4 9.4 9.9 6.9" />
      <path d="M12.6 9.4 14.1 6.9" />
    </svg>
  );
}