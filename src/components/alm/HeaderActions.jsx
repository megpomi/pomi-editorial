import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

// Sits in the top right of every page: the invitation to go ad-free and the
// door to the profile, where everything else is kept.
export default function HeaderActions() {
  return (
    <div className="flex items-center gap-3.5">
      <Link
        to="/upgrade"
        className="font-heading text-[12.5px] italic text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
      >
        Go ad-free
      </Link>
      <Link
        to="/profile"
        aria-label="Your profile"
        className="grid h-8 w-8 place-items-center rounded-[3px] border border-foreground/20 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <User className="h-4 w-4" strokeWidth={1.6} />
      </Link>
    </div>
  );
}