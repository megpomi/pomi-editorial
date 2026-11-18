import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// A 0–100 score the user sets themselves. Until it's touched there is no
// reading to save, so the slider rests in the middle and the number reads "—".
export default function SleepQualityField({ value, onChange }) {
  const logged = typeof value === "number";

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <Label className="eyebrow text-muted-foreground">Sleep quality</Label>
        <span
          className={`font-heading text-[18px] leading-none ${
            logged ? "text-primary" : "text-muted-foreground/50"
          }`}
        >
          {logged ? value : "—"}
          <span className="ml-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            / 100
          </span>
        </span>
      </div>
      <Slider
        aria-label="Sleep quality score"
        value={[logged ? value : 50]}
        onValueChange={([next]) => onChange(next)}
        min={0}
        max={100}
        step={1}
      />
      <p className="text-[12px] leading-relaxed text-muted-foreground">
        0 is a very poor night's sleep, 100 is excellent.
      </p>
    </div>
  );
}