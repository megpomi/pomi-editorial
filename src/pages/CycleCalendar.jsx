import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Eyebrow, Rule } from "@/components/alm/Primitives";
import CalendarPanel from "@/components/calendar/CalendarPanel";
import CycleStats from "@/components/dashboard/CycleStats";
import CyclePatterns from "@/components/patterns/CyclePatterns";

// The calendar page reads the cycle back to you: any date opens what was
// logged that day, and the statistics and patterns sit underneath. Writing
// period days happens on its own page, reached from the Log period row.
export default function CycleCalendar() {
  const [logs, setLogs] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(
    () =>
      base44.auth
        .me()
        .then((me) => {
          const owner = { created_by_id: me?.id };
          return Promise.all([
            base44.entities.CycleLog.filter(owner, {
              sort: "-start_date",
              limit: 200,
            }),
            base44.entities.DailyLog.filter(owner, {
              sort: "-date",
              limit: 500,
            }),
          ]);
        })
        .then(([cycles, dailies]) => {
          setLogs(cycles.items);
          setDailyLogs(dailies.items);
        })
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <section className="px-6">
          <h1 className="font-heading text-[26px] leading-tight tracking-tight sm:text-[30px]">
            Your calendar
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Tap any date to see what you logged that day, and add or edit the
            entry from there.
          </p>
        </section>

        <Rule className="my-6" />

        <div className="px-6">
          <Link
            to="/log-period"
            className="group flex items-center justify-between gap-4 border-y border-border py-4"
          >
            <span className="min-w-0">
              <Eyebrow className="text-primary">Log period</Eyebrow>
              <span className="mt-1.5 block font-heading text-[16.5px] leading-snug">
                Mark your period days
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                Choose several days at once, or import a screenshot from another
                app.
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="px-6 pt-6">
          {loading ? (
            <div className="h-64 animate-pulse border border-border bg-card" />
          ) : (
            <CalendarPanel
              logs={logs}
              dailyLogs={dailyLogs}
              onChanged={loadAll}
            />
          )}
        </div>

        {!loading && (
          <>
            <Rule className="my-7" />

            <div className="px-6">
              <CycleStats logs={logs} />
            </div>

            <Rule className="my-7" />

            <section className="px-6">
              <Eyebrow className="mb-4">Your patterns</Eyebrow>
              <CyclePatterns logs={logs} dailyLogs={dailyLogs} />
            </section>
          </>
        )}
      </div>

      <AlmTabs />
    </div>
  );
}