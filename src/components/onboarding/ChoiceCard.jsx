import React from "react";
import { Check } from "lucide-react";

// A numbered choice row in Almanac's hand: hairline border, serif label,
// crimson ink when chosen.
export default function ChoiceCard({
  icon: Icon,
  label,
  desc,
  active,
  onClick,
  comingSoon,
  locked,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      className={`flex w-full items-center gap-4 rounded-[3px] border p-4 text-left transition-colors ${
        locked ? "cursor-default" : ""
      } ${
        active
          ? "border-primary bg-accent"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {Icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border ${
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}
      <span className="flex-1">
        <span className="flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-[17px] leading-snug">{label}</span>
          {comingSoon && (
            <span className="eyebrow text-muted-foreground">Coming soon</span>
          )}
        </span>
        {desc && (
          <span className="mt-1 block text-[13px] text-muted-foreground">
            {desc}
          </span>
        )}
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border ${
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-foreground/25"
        }`}
      >
        {active && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}