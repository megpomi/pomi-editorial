import React from "react";
import { CURRENCIES } from "@/lib/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CurrencyPreference({ value, onChange }) {
  return (
    <section className="border border-border bg-card p-6">
      <h2 className="font-heading text-[19px] text-foreground">
        Currency
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        The currency your donation totals and cause shares are shown in.
      </p>

      <div className="mt-4 max-w-xs">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="rounded-xl border-slate-200">
            <SelectValue placeholder="Choose a currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.symbol} · {c.label} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}