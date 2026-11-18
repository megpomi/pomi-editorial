import React from "react";

// The line drawing is used as a mask, so the mark is painted in the app's ink:
// burgundy on paper, the day-headline light on ink.
const pomiMark = "/pomi/outline.png";

// Pomi's mark: the crimson pomegranate, shown wherever the app signs itself.
export default function Pomegranate({ size = 96, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pom-mark shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${pomiMark})`,
        maskImage: `url(${pomiMark})`,
      }}
    />
  );
}