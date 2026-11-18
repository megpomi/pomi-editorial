import React from "react";
import { Link } from "react-router-dom";
import { openConsentSettings } from "@/lib/consent";

// Footer shown on the public pages, so the About and Contact pages are always
// one click away.
export default function PublicFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-8 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <p>© {new Date().getFullYear()} Pomi · Not a medical device</p>
        <nav className="flex items-center gap-6">
          <Link to="/about" className="transition-colors hover:text-primary">
            Our mission
          </Link>
          <Link to="/contact" className="transition-colors hover:text-primary">
            Contact us
          </Link>
          <button
            type="button"
            onClick={openConsentSettings}
            className="uppercase tracking-[0.16em] transition-colors hover:text-primary"
          >
            Cookie settings
          </button>
        </nav>
      </div>
    </footer>
  );
}