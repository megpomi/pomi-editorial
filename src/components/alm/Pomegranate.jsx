import React from "react";

// The botanical line pomegranate that opens Almanac: drawn, never illustrated
// in colour, so it reads as an engraving rather than a cartoon.
export default function Pomegranate({
  size = 96,
  color = "hsl(var(--primary))",
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size * 1.08}
      viewBox="0 0 120 130"
      fill="none"
      stroke={color}
      strokeWidth="0.9"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M60 26c-27 0-46 21-46 49s19 49 46 49 46-21 46-49-19-49-46-49z" />
      <path d="M49 28l-4-13 8 6 7-11 7 11 8-6-4 13" />
      <path d="M63 16c8-9 21-11 31-7-7 9-20 12-31 7z" />
      <path d="M63 16c10-4 20-6 31-7" />
      <path d="M26 86c6 18 19 29 34 31" opacity=".55" />
      <path d="M32 96c6 11 14 17 24 19" opacity=".45" />
      <path d="M94 62c-3-10-9-18-17-24" opacity=".55" />
      {[
        [56, 70],
        [66, 76],
        [58, 84],
        [70, 88],
        [50, 80],
        [62, 94],
        [74, 70],
      ].map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="2.6"
          ry="3.6"
          transform={`rotate(${i * 25} ${x} ${y})`}
          opacity=".7"
        />
      ))}
    </svg>
  );
}