import React, { useState } from "react";
import {
  readThemePreference,
  saveThemePreference,
  systemPrefersDark,
} from "@/lib/theme";

const MODES = [
  { value: "light", label: "Light mode" },
  { value: "dark", label: "Dark mode" },
];

// Light or dark, chosen here and remembered on this device. The two choices
// read as square bubbles, the way every other choice in Pomi does.
export default function AppearancePreference() {
  const [mode, setMode] = useState(
    () => readThemePreference() || (systemPrefersDark() ? "dark" : "light")
  );

  const choose = (next) => {
    setMode(next);
    saveThemePreference(next);
  };

  return (
    <section className="border border-border bg-card p-6">
      <h2 className="font-heading text-[19px] text-foreground">Theme</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Light or dark, for this device.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {MODES.map((option) => {
          const on = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => choose(option.value)}
              aria-pressed={on}
              className={`rounded-[3px] border px-4 py-2 text-[13px] transition-colors ${
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground/20 text-foreground hover:border-primary/50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}