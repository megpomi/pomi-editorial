import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  readThemePreference,
  saveThemePreference,
  systemPrefersDark,
} from "@/lib/theme";

// Light or dark, chosen here and remembered on this device.
export default function AppearancePreference() {
  const [dark, setDark] = useState(() => {
    const preference = readThemePreference();
    return preference ? preference === "dark" : systemPrefersDark();
  });

  const toggle = (next) => {
    setDark(next);
    saveThemePreference(next ? "dark" : "light");
  };

  return (
    <section className="border border-border bg-card p-6">
      <h2 className="font-heading text-[19px] text-foreground">Theme</h2>
      <p className="mt-1 text-sm text-slate-500">
        Light or dark, for this device.
      </p>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
        <label
          htmlFor="dark-appearance"
          className="font-heading text-[15px] text-foreground"
        >
          Turn on dark theme
        </label>
        <Switch id="dark-appearance" checked={dark} onCheckedChange={toggle} />
      </div>
    </section>
  );
}