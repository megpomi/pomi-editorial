import React from "react";
import Masthead from "@/components/alm/Masthead";

// The banner pinned to the top of the pages that scroll a long way, carrying
// the same one line as everywhere else.
export default function AppHeader({ maxWidth = "max-w-3xl" }) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur">
      <div className={`mx-auto ${maxWidth}`}>
        <Masthead />
      </div>
    </header>
  );
}