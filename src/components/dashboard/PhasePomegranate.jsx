import React from "react";

// The pomegranate opens a little as the cycle turns: fully open as the period
// ends, a crescent revealed through the follicular days, the bare outline at
// ovulation, and half revealed through the luteal weeks.
const IMAGES = {
  period:
    "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/fda5e4c25_9031e872e_generated-image.png",
  follicular:
    "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/f577ccd7a_c7263a300_pomegranate-crescent-reveal.png",
  ovulation:
    "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/665aa5535_6b87442d0_generated-image-2.png",
  luteal:
    "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/f39b35260_62908c11c_pomegranate-half-reveal.png",
};

export default function PhasePomegranate({ phase, className = "" }) {
  const src = IMAGES[phase];
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`h-auto w-[76px] shrink-0 object-contain mix-blend-multiply sm:w-[100px] ${className}`}
    />
  );
}