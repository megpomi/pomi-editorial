import React from "react";

// The pomegranate opens a little as the cycle turns: fully open as the period
// ends, a crescent revealed through the follicular days, the bare outline at
// ovulation, and half revealed through the luteal weeks.
//
// Each drawing is used as a mask, so it is painted in the app's ink rather than
// shown as an image. They were each cropped differently, so every one is sized
// and nudged so its fruit sits at exactly the same circle within the frame.
const IMAGES = {
  period: {
    src: "/pomi/outline.png",
    ratio: "1 / 1",
    width: "98.1%",
    left: "1.7%",
    top: "-6.2%",
  },
  follicular: {
    src: "/pomi/phase-follicular.png",
    ratio: "3 / 4",
    width: "81.1%",
    left: "8.7%",
    top: "-7.3%",
  },
  ovulation: {
    src: "/pomi/phase-ovulation.png",
    ratio: "1 / 1",
    width: "97.8%",
    left: "1.9%",
    top: "-6.3%",
  },
  luteal: {
    src: "/pomi/phase-luteal.png",
    ratio: "3 / 4",
    width: "80.2%",
    left: "12.6%",
    top: "-6.9%",
  },
};

// Before any history exists there is no phase to draw, so the plain whole-fruit
// outline stands in and keeps the corner of the page from feeling empty.
const FALLBACK = {
  src: "/pomi/outline.png",
  ratio: "1 / 1",
  width: "100%",
  left: "0%",
  top: "0%",
};

export default function PhasePomegranate({ phase, className = "" }) {
  const image = IMAGES[phase] || FALLBACK;

  return (
    <div
      aria-hidden="true"
      className={`relative h-[76px] w-[76px] shrink-0 sm:h-[100px] sm:w-[100px] ${className}`}
    >
      <div
        className="pom-mark absolute"
        style={{
          width: image.width,
          aspectRatio: image.ratio,
          left: image.left,
          top: image.top,
          WebkitMaskImage: `url(${image.src})`,
          maskImage: `url(${image.src})`,
        }}
      />
    </div>
  );
}