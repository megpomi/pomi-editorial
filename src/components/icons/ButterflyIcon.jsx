import React from "react";

// A butterfly: the mark for a gender affirming journey, where the point is the
// change itself rather than a phase to wait out. Drawn artwork, sized to fill
// the tile it sits in, so callers' icon sizing doesn't shrink it back down.
const BUTTERFLY_MARK =
  "https://media.base44.com/images/public/6afc241cb31d2d0419b1358b/8c2235a18_generated_6dac81fa.png";

export default function ButterflyIcon() {
  return (
    <img
      src={BUTTERFLY_MARK}
      alt=""
      aria-hidden="true"
      className="h-7 w-7 shrink-0 rounded-[2px] object-contain"
    />
  );
}