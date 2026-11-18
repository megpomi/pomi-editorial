import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// A 0–100 score the user sets themselves: drag the slider, or click the number
// and type it. Until it's touched there is no reading to save, so the slider
// rests in the middle and the number reads "—".
export default function SleepQualityField({ value, onChange }) {
  const logged = typeof value === "number";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    setDraft(logged ? String(value) : "");
    setEditing(true);
  };

  const commit = () => {
    const typed = Number(draft);
    if (draft.trim() !== "" && Number.isFinite(typed)) {
      onChange(Math.min(100, Math.max(0, Math.round(typed))));
    }
    setEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <Label className="eyebrow text-muted-foreground">Sleep quality</Label>
        <div className="flex items-baseline">
          {editing ? (
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              aria-label="Sleep quality score"
              className="w-14 border-b border-primary bg-transparent text-right font-heading text-[18px] leading-none text-primary outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={startEditing}
              aria-label="Type your sleep quality score"
              className={`font-heading text-[18px] leading-none underline decoration-1 underline-offset-4 ${
                logged ? "text-primary" : "text-muted-foreground/50"
              }`}
            >
              {logged ? value : "—"}
            </button>
          )}
          <span className="ml-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            / 100
          </span>
        </div>
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
        0 is a very poor night's sleep, 100 is excellent. Tap the score to type
        it.
      </p>
    </div>
  );
}