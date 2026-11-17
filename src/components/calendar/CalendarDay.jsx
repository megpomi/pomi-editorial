import React from "react";

// A pomegranate dot marks every day that has a period logged, a symptom dot
// every day the daily check-in recorded a symptom on, and a dark purple one
// every day with a journal entry — a day can carry several. While conception is
// being tracked, the fertile window is shaded and the expected ovulation day is
// drawn as a hairline box.
export default function CalendarDay({ date, activeModifiers }) {
  const dots = [];
  if (activeModifiers.logged) dots.push("bg-pomegranate-600");
  if (activeModifiers.symptom) dots.push("bg-symptom");
  if (activeModifiers.journal) dots.push("bg-purple-800");

  const shaded = activeModifiers.fertile && !activeModifiers.selected;
  const ringed = activeModifiers.ovulation && !activeModifiers.selected;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {shaded && (
        <span className="absolute inset-x-1.5 inset-y-1.5 rounded-[2px] bg-sky-300/40" />
      )}
      {ringed && (
        <span className="absolute inset-x-1.5 inset-y-1.5 rounded-[2px] border border-pomegranate-600/60" />
      )}
      <span className="relative">{date.getDate()}</span>
      {dots.length > 0 && (
        <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-[3px]">
          {dots.map((color) => (
            <span
              key={color}
              className={`h-[3px] w-[3px] rounded-full ${
                activeModifiers.selected ? "bg-primary-foreground" : color
              }`}
            />
          ))}
        </span>
      )}
    </div>
  );
}