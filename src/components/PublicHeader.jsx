import React from "react";
import { Link } from "react-router-dom";

// Header for the public (non signed-in) pages: the wordmark in italic
// Playfair, the plain links a visitor or reviewer needs, and the way in.
export default function PublicHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-heading text-[24px] italic leading-none text-primary">
            Pomi
          </span>
        </Link>
        <nav className="flex items-baseline gap-4 text-[13px] sm:gap-6">
          <Link
            to="/about"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            About us
          </Link>
          <Link
            to="/contact"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Contact us
          </Link>
          <Link
            to="/login"
            className="font-heading italic text-primary underline underline-offset-4"
          >
            Sign in
          </Link>
          <Link
            to="/"
            className="rounded-[3px] bg-primary px-4 py-2 font-heading text-[13px] text-primary-foreground transition-colors hover:bg-pomegranate-700"
          >
            Start with Pomi
          </Link>
        </nav>
      </div>
    </header>
  );
}