import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CURRENCIES } from "@/lib/currency";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function CurrencyPreference({ value, onChange }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const current = CURRENCIES.find((c) => c.code === value);

  const choose = (code) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <section className="border border-border bg-card p-6">
      <h2 className="font-heading text-[19px] text-foreground">
        Currency
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        The currency your donation totals and cause shares are shown in.
      </p>

      <div className="mt-4 max-w-xs">
        {isMobile ? (
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-12 w-full items-center justify-between gap-2 rounded-[3px] border border-border bg-background px-3 text-left text-[15px]"
            >
              <span className={current ? "text-foreground" : "text-muted-foreground"}>
                {current
                  ? `${current.symbol} · ${current.label} (${current.code})`
                  : "Choose a currency"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>

            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent className="max-h-[80vh] rounded-t-[3px]">
                <DrawerHeader className="border-b border-border px-6 pb-4 text-left">
                  <DrawerTitle className="font-heading text-[18px] font-normal">
                    Your currency
                  </DrawerTitle>
                </DrawerHeader>
                <div
                  className="overflow-y-auto px-2 pb-6 pt-2"
                  style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
                >
                  {CURRENCIES.map((c) => {
                    const selected = c.code === value;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => choose(c.code)}
                        className={`flex w-full items-center justify-between gap-3 rounded-[3px] px-4 py-3 text-left text-[15px] transition-colors ${
                          selected
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <span>
                          {c.symbol} · {c.label} ({c.code})
                        </span>
                        {selected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
                      </button>
                    );
                  })}
                </div>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
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
        )}
      </div>
    </section>
  );
}