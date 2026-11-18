import React from "react";

// The line drawing is used as a mask, so the mark is painted in the app's ink:
// burgundy on paper, the day-headline light on ink.
const pomiMark = "/pomi/outline.png";

// Pomi's mark: the crimson pomegranate, shown wherever the app signs itself.
export default function Pomegranate({ size = 96, className = "" }) {
  // A fixed number gives a fixed square. A fluid size (e.g. "min(26vh, 100%)")
  // is used for the width only, and the aspect ratio keeps it square — a
  // percentage height would otherwise resolve against an auto-height parent and
  // collapse the mark to nothing.
  const fixed = typeof size === "number";

  return (
    <div
      aria-hidden="true"
      className={`pom-mark shrink-0 ${className}`}
      style={{
        width: size,
        ...(fixed ? { height: size } : { aspectRatio: "1 / 1" }),
        WebkitMaskImage: `url(${pomiMark})`,
        maskImage: `url(${pomiMark})`,
      }}
    />
  );
}