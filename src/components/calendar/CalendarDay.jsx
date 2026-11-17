import React from "react";

// A day with a period logged is filled in pomegranate; a symptom dot marks
// every day the daily check-in recorded a symptom on, and a dark purple one
// every day with a journal entry. While conception is being tracked, the fertile
// window is shaded and the expected ovulation day is drawn as a hairline box.
export default function CalendarDay({ date, activeModifiers }) {
  const filled = Boolean(activeModifiers.logged);
  const dotColor = (color) => (filled ? "bg-background/80" : color);

  const dots = [];
  if (activeModifiers.symptom) dots.push("bg-symptom");
  if (activeModifiers.journal) dots.push("bg-purple-800");

  const shaded = activeModifiers.fertile && !activeModifiers.selected;
  const ringed = activeModifiers.ovulation && !activeModifiers.selected;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {filled && (
        <span className="absolute inset-x-1.5 inset-y-1.5 rounded-[2px] bg-pomegranate-600" />
      )}
      {shaded && (
        <span className="absolute inset-x-1.5 inset-y-1.5 rounded-[2px] bg-sky-300/20" />
      )}
      {ringed && (
        <span className="absolute inset-x-1.5 inset-y-1.5 rounded-[2px] border-2 border-sky-500/40" />
      )}
      <span
        className={`relative ${
          filled ? "font-medium text-primary-foreground" : ""
        }`}
      >
        {date.getDate()}
      </span>
      {dots.length > 0 && (
        <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-[3px]">
          {dots.map((color) => (
            <span
              key={color}
              className={`h-[3px] w-[3px] rounded-full ${dotColor(color)}`}
            />
          ))}
        </span>
      )}
    </div>
  );
}