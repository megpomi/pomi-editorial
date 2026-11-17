import React from "react";
import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/alm/Primitives";
import Pomegranate from "@/components/alm/Pomegranate";

// Shown on the dashboard until a cycle history exists: the predictions need
// past days, so the fastest way in is the calendar (by hand or from a
// screenshot of another tracking app).
export default function HistoricalDaysPrompt() {
  return (
    <section className="border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <Pomegranate size={34} className="mt-1" />
        <div className="min-w-0">
          <Eyebrow className="text-primary">Start your history</Eyebrow>
          <h2 className="mt-2 font-heading text-[20px] leading-snug">
            Add the period days you've already had
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Open the period log to mark past days, or import screenshots from
            another tracking app and we'll transfer them for you.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              to="/log-period"
              className="inline-flex h-11 items-center justify-center rounded-[3px] bg-primary px-5 font-heading text-[15px] text-primary-foreground transition-colors hover:bg-pomegranate-700"
            >
              Log period
            </Link>
            <Link
              to="/log-period?import=1"
              className="inline-flex h-11 items-center justify-center rounded-[3px] border border-foreground/25 px-5 font-heading text-[15px] transition-colors hover:bg-secondary"
            >
              Import a screenshot
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}