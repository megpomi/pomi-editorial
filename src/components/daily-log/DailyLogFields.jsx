import React from "react";
import MoodFace from "@/components/icons/MoodFace";
import { FLOW_OPTIONS, MOOD_OPTIONS } from "@/lib/dailyLog";
import { AlmChip } from "@/components/alm/Primitives";

// A square chip that reads as pressed when it's on — the shared look of every
// lifestyle toggle.
export function TogglePill({ label, checked, onChange, disabled }) {
  return (
    <AlmChip
      on={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      {label}
    </AlmChip>
  );
}

// Flow as underlined serif words, the way Almanac sets its own options.
export function FlowPicker({ value, onChange, disabled }) {
  return (
    <div className={disabled ? "opacity-50" : ""}>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {FLOW_OPTIONS.map((option) => {
          const on = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`font-heading text-[17px] underline-offset-[6px] decoration-1 transition-colors ${
                on
                  ? "italic text-primary underline"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {disabled && (
        <p className="mt-2 font-heading text-[12px] italic text-muted-foreground">
          Flow is only recorded on period days.
        </p>
      )}
    </div>
  );
}

export function MoodPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOOD_OPTIONS.map((option) => {
        const on = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={on}
            onClick={() => onChange(on ? "" : option.value)}
            className={`inline-flex items-center gap-1.5 rounded-[3px] border px-3 py-1.5 text-[13px] transition-colors ${
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-foreground/20 text-foreground hover:border-primary/50"
            }`}
          >
            <MoodFace
              mood={option.value}
              className={`h-4 w-4 ${on ? "text-primary-foreground" : "text-primary"}`}
            />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}