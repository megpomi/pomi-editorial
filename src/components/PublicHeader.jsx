import React from "react";
import { Link } from "react-router-dom";
import Pomegranate from "@/components/alm/Pomegranate";

// Header for the public (non signed-in) pages: the mark and wordmark, the plain
// links a visitor needs, and the way in. The secondary links step aside on
// small screens so the row never crowds.
export default function PublicHeader() {
  return (
    <header
      className="border-b border-border"
      // Clears the phone's status bar and notch.
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-2">
          <Pomegranate size={24} />
          <span className="font-heading text-[23px] italic leading-none text-primary">
            Pomi
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-[13px] sm:gap-6">
          <Link
            to="/about"
            className="hidden text-muted-foreground transition-colors hover:text-primary sm:block"
          >
            Our mission
          </Link>
          <Link
            to="/contact"
            className="hidden text-muted-foreground transition-colors hover:text-primary sm:block"
          >
            Contact us
          </Link>
          <Link
            to="/login"
            className="font-heading italic text-primary underline underline-offset-4"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}