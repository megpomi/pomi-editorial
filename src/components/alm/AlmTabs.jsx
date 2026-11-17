import React from "react";
import { Link, useLocation } from "react-router-dom";

// Almanac's section tabs, kept at the foot of the page the way a printed
// almanac keeps its index: Today, Month, Entry, Give, Record.
const TABS = [
  { label: "Today", to: "/" },
  { label: "Month", to: "/calendar" },
  { label: "Entry", to: "/log-today" },
  { label: "Give", to: "/mission" },
  { label: "Record", to: "/profile" },
];

export default function AlmTabs() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl justify-between px-6 pb-4 pt-3">
        {TABS.map((tab) => {
          const active =
            tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className="h-1 w-1 rounded-full bg-primary transition-opacity"
                style={{ opacity: active ? 1 : 0 }}
              />
              <span
                className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}