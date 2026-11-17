import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  due: "border-l-primary",
  info: "border-l-border",
};

export default function ReminderBanner({
  reminder,
  onDismiss,
  onLogPeriod,
}) {
  if (!reminder) return null;
  const tone = TONES[reminder.tone] || TONES.info;

  return (
    <div className={cn("flex items-start gap-4 border-l-2 pl-4", tone)}>
      <div className="flex-1">
        <p className="eyebrow text-primary">A note for you</p>
        <p className="mt-2 font-heading text-[17px] leading-snug">
          {reminder.title}
        </p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
          {reminder.body}
        </p>
        {reminder.cta && (
          <button
            type="button"
            onClick={() => onLogPeriod(reminder)}
            className="mt-2 font-heading text-[13px] italic text-primary underline underline-offset-4"
          >
            {reminder.cta}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(reminder.id)}
        aria-label="Dismiss reminder"
        className="mt-1 text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}