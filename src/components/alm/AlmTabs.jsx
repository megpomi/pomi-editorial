import React from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

// Almanac's section tabs, kept at the foot of the page the way a printed
// almanac keeps its index: today, the calendar, the news, the mission, the
// donations. `short` keeps the foot of the page on one line on a phone.
// The news tab carries a drawn mark instead of a word, and sits on the banner
// without making it any thicker.
const NEWS_MARK = "/pomi/newspaper.png";

const TABS = [
  { label: "Today", short: "Today", to: "/" },
  { label: "Calendar", short: "Calendar", to: "/calendar" },
  { label: "In the News", to: "/news", art: NEWS_MARK },
  { label: "Our Mission", short: "Mission", to: "/mission" },
  { label: "Your donations", short: "Donations", to: "/donations" },
];

export default function AlmTabs() {
  const { pathname } = useLocation();

  // Rendered straight into the page body, so a route transition can slide the
  // page along without dragging the tab bar with it.
  return createPortal(
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-3xl justify-between px-4 pb-3.5 pt-2.5 sm:px-6 sm:pb-4 sm:pt-3">
        {TABS.map((tab) => {
          const active =
            tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);

          if (tab.art) {
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-label={tab.label}
                className="-mt-1 flex flex-1 items-center justify-center"
              >
                <div
                  aria-hidden="true"
                  className={`pom-mark aspect-[470/313] h-10 max-w-none transition-opacity duration-200 sm:h-12 ${
                    active ? "opacity-100" : "opacity-60"
                  }`}
                  style={{
                    WebkitMaskImage: `url(${tab.art})`,
                    maskImage: `url(${tab.art})`,
                  }}
                />
              </Link>
            );
          }

          return (
            <Link
              key={tab.to}
              to={tab.to}
              aria-label={tab.label}
              className="flex flex-1 items-center justify-center py-1"
            >
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
    </nav>,
    document.body
  );
}