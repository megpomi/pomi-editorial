import React from "react";
import { promptForDate } from "@/lib/journalPrompts";

// Shown on the home page for people tracking general wellbeing: one reflective
// prompt a day, rotating through mood, gratitude and visualisation. It is a
// thought to start the day with, not a form — the entry links live below.
export default function JournalPrompt({ dateKey }) {
  const { theme, prompt } = promptForDate(dateKey);

  return (
    <section className="bg-pomegranate-800 px-6 py-7 text-pomegranate-50 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow text-pomegranate-100/70">
          Today's journal prompt
        </p>
        <span className="font-heading text-[12px] italic text-pomegranate-100/80">
          {theme.label}
        </span>
      </div>
      <div className="mt-3 border-t border-pomegranate-100/25 pt-3">
        <p className="text-[12px] text-pomegranate-100/70">
          A new prompt every day.
        </p>
        <p className="mt-2 font-heading text-[17px] leading-snug sm:text-[19px]">
          {prompt}
        </p>
      </div>
    </section>
  );
}