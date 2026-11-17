import React from "react";
import { Link, useLocation } from "react-router-dom";

// Almanac's section tabs, kept at the foot of the page the way a printed
// almanac keeps its index: today, the calendar, the news, the mission, the
// donations. `short` keeps the foot of the page on one line on a phone.
// The news tab carries a drawn mark instead of a word, and sits on the banner
// without making it any thicker.
const NEWS_MARK =
  "https://base44.app/api/apps/6afc241cb31d2d0419b1358b/files/mp/public/6afc241cb31d2d0419b1358b/0f86320da_pomi-newspaper-linework-transparent.png";

const TABS = [
  { label: "Today", short: "Today", to: "/" },
  { label: "Calendar", short: "Calendar", to: "/calendar" },
  { label: "In the News", to: "/news", art: NEWS_MARK },
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

          if (tab.art) {
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-label={tab.label}
                className="-mt-1 flex flex-1 items-center justify-center"
              >
                <img
                  src={tab.art}
                  alt=""
                  aria-hidden="true"
                  className={`h-10 w-auto max-w-none transition-opacity duration-200 sm:h-12 ${
                    active ? "opacity-100" : "opacity-60"
                  }`}
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
    </nav>
  );
}