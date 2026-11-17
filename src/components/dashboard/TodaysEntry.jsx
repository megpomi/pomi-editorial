import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/alm/Primitives";

// Today's own page: what is logged so far and a way into the entry form for
// each area the user chose to track.
export default function TodaysEntry({ options, logged }) {
  return (
    <section className="px-6">
      <Eyebrow>Today's entry</Eyebrow>

      {logged.length ? (
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
          {`Logged today: ${logged.join(" · ")}.`}
        </p>
      ) : (
        <Link
          to="/log-today"
          className="mt-3 block text-[13.5px] leading-relaxed text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
        >
          Nothing logged yet today. Make today's entry here - a half-filled page
          still tells you something. Alternatively make an entry for a specific
          area by clicking below.
        </Link>
      )}

      <div className="mt-4 divide-y divide-border border-y border-border">
        {options.map((option) => (
          <Link
            key={option.title}
            to={option.to}
            className="flex items-center justify-between gap-4 py-4"
          >
            <span className="min-w-0">
              <span className="block font-heading text-[17px] leading-snug">
                {option.title}
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                {option.desc}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
          </Link>
        ))}
      </div>
    </section>
  );
}