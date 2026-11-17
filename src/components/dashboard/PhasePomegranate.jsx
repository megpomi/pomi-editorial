import React from "react";

// The pomegranate opens a little as the cycle turns: fully open as the period
// ends, a crescent revealed through the follicular days, the bare outline at
// ovulation, and half revealed through the luteal weeks.
//
// The four drawings were each cropped differently, so every one is sized and
// nudged so its fruit sits at exactly the same circle within the same frame.
const IMAGES = {
  period: {
    src: "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/fda5e4c25_9031e872e_generated-image.png",
    width: "98.1%",
    left: "1.7%",
    top: "-6.2%",
  },
  follicular: {
    src: "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/f577ccd7a_c7263a300_pomegranate-crescent-reveal.png",
    width: "81.1%",
    left: "8.7%",
    top: "-7.3%",
  },
  ovulation: {
    src: "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/665aa5535_6b87442d0_generated-image-2.png",
    width: "97.8%",
    left: "1.9%",
    top: "-6.3%",
  },
  luteal: {
    src: "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/f39b35260_62908c11c_pomegranate-half-reveal.png",
    width: "80.2%",
    left: "12.6%",
    top: "-6.9%",
  },
};

export default function PhasePomegranate({ phase, className = "" }) {
  const image = IMAGES[phase];
  if (!image) return null;

  return (
    <div
      aria-hidden="true"
      className={`relative h-[76px] w-[76px] shrink-0 sm:h-[100px] sm:w-[100px] ${className}`}
    >
      <img
        src={image.src}
        alt=""
        className="absolute max-w-none object-contain mix-blend-multiply"
        style={{ width: image.width, left: image.left, top: image.top }}
      />
    </div>
  );
}