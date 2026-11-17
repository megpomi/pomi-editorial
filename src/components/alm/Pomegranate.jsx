import React from "react";
const pomiLogo = "/pomi-logo.png";

// Pomi's mark: the crimson pomegranate, shown wherever the app signs itself.
export default function Pomegranate({ size = 96, className = "" }) {
  return (
    <img
      src={pomiLogo}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: "auto" }}
      className={`shrink-0 object-contain ${className}`}
      aria-hidden="true"
    />
  );
}