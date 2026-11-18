import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import HeaderReminderBell from "@/components/reminders/HeaderReminderBell";

// Sits at the right of every page's banner: the invitation to go ad-free, the
// reminders, and the door to the profile, where everything else is kept.
export default function HeaderActions() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        to="/upgrade"
        className="whitespace-nowrap font-heading text-[12.5px] italic text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
      >
        Go ad-free
      </Link>
      <HeaderReminderBell />
      <Link
        to="/profile"
        aria-label="Your profile"
        // The drawn box stays 32px; the invisible after-padding lifts the touch
        // target to 44px, the size a thumb can reliably hit.
        className="relative grid h-8 w-8 shrink-0 place-items-center rounded-[3px] border border-foreground/20 text-foreground transition-colors after:absolute after:-inset-[6px] after:content-[''] hover:border-primary/50 hover:text-primary"
      >
        <User className="h-4 w-4" strokeWidth={1.6} />
      </Link>
    </div>
  );
}