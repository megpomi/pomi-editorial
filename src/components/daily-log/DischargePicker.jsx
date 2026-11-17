import React from "react";
import { Label } from "@/components/ui/label";
import { DISCHARGE_OPTIONS, prettySymptom } from "@/lib/dailyLog";

// The kinds of discharge a user can note — only active once Discharge is on.
export default function DischargePicker({ value, onChange, disabled }) {
  const toggle = (type) =>
    onChange(
      value.includes(type)
        ? value.filter((item) => item !== type)
        : [...value, type]
    );

  return (
    <div className={`transition ${disabled ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap gap-2">
        {DISCHARGE_OPTIONS.map((type) => {
          const active = value.includes(type);
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => toggle(type)}
              className={`rounded-[3px] border px-3 py-1.5 text-[13px] capitalize transition-colors ${
                disabled
                  ? "cursor-not-allowed border-border text-muted-foreground/60"
                  : active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground/20 text-foreground hover:border-primary/50"
              }`}
            >
              {prettySymptom(type)}
            </button>
          );
        })}
      </div>
    </div>
  );
}