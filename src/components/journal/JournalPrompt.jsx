import React from "react";
import { promptForDate } from "@/lib/journalPrompts";
import { Eyebrow } from "@/components/alm/Primitives";

// Shown on the home page for people tracking general wellbeing: one reflective
// prompt a day, rotating through mood, gratitude and visualisation. It is a
// thought to start the day with, not a form — the entry links live below.
export default function JournalPrompt({ dateKey }) {
  const { theme, prompt } = promptForDate(dateKey);

  return (
    <section className="border border-primary bg-primary p-5 text-primary-foreground sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Eyebrow className="text-primary-foreground/70">
          Today's journal prompt
        </Eyebrow>
        <span className="font-heading text-[12px] italic text-primary-foreground/85">
          {theme.label}
        </span>
      </div>
      <p className="mt-3 text-[11.5px] text-primary-foreground/70">
        A new prompt every day.
      </p>
      <p className="mt-2 font-heading text-[19px] leading-snug sm:text-[21px]">
        {prompt}
      </p>
    </section>
  );
}