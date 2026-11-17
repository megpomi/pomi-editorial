import React from "react";
import { Link } from "react-router-dom";
import { promptForDate } from "@/lib/journalPrompts";
import { Eyebrow } from "@/components/alm/Primitives";

// Shown on the home page for people tracking general wellbeing: one reflective
// prompt a day, rotating through mood, gratitude and visualisation.
export default function JournalPrompt({ dateKey }) {
  const { theme, prompt } = promptForDate(dateKey);

  return (
    <section className="border border-border bg-secondary/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Eyebrow>Today's journal prompt</Eyebrow>
        <span className="font-heading text-[12px] italic text-primary">
          {theme.label}
        </span>
      </div>
      <p className="mt-3 font-heading text-[19px] leading-snug sm:text-[21px]">
        {prompt}
      </p>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <Link
          to="/log-today"
          className="font-heading text-[13px] italic text-primary underline underline-offset-4"
        >
          Write it in today's log
        </Link>
        <span className="text-[11.5px] text-muted-foreground">
          A new prompt every day.
        </span>
      </div>
    </section>
  );
}