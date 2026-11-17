import React from "react";
import { Link, useLocation } from "react-router-dom";

// Almanac's section tabs, kept at the foot of the page the way a printed
// almanac keeps its index: today, the calendar, the mission, the donations.
// `short` keeps the foot of the page on one line on a phone.
const TABS = [
  { label: "Today", short: "Today", to: "/" },
  { label: "Calendar", short: "Calendar", to: "/calendar" },
  { label: "Our Mission", short: "Mission", to: "/mission" },
  { label: "Your donations", short: "Donations", to: "/donations" },
];

export default function AlmTabs() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-3xl justify-between px-4 pb-3.5 pt-2.5 sm:px-6 sm:pb-4 sm:pt-3">
        {TABS.map((tab) => {
          const active =
            tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-1 flex-col items-center gap-1.5 py-1"
            >
              <span
                className="h-1 w-1 rounded-full bg-primary transition-opacity"
                style={{ opacity: active ? 1 : 0 }}
              />
              <span
                className={`text-[10px] uppercase tracking-[0.12em] transition-colors sm:text-[11px] sm:tracking-[0.16em] ${
                  active
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <span className="sm:hidden">{tab.short}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}