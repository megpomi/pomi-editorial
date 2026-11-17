import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Rule } from "@/components/alm/Primitives";
import { useToast } from "@/components/ui/use-toast";
import PeriodHistoryCalendar from "@/components/calendar/PeriodHistoryCalendar";

// The working calendar: tap the days you were bleeding to add them, tap a
// logged day to take it away, or import a screenshot from another app. The
// calendar page itself only reads — this is the page that writes.
export default function LogPeriod() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // Arriving from a prompt to import a screenshot.
  const [searchParams] = useSearchParams();
  const autoImport = searchParams.get("import") === "1";

  const loadLogs = useCallback(
    () =>
      base44.auth
        .me()
        .then((me) =>
          base44.entities.CycleLog.filter(
            { created_by_id: me?.id },
            { sort: "-start_date", limit: 200 }
          )
        )
        .then((page) => setLogs(page.items))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <section className="px-6">
          <Link
            to="/calendar"
            className="font-heading text-[13px] italic text-primary underline decoration-1 underline-offset-4"
          >
            Back to my calendar
          </Link>
          <h1 className="mt-3 font-heading text-[26px] leading-tight tracking-tight sm:text-[30px]">
            Log period
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Tap days you were menstruating to add them, or tap a logged day to
            remove it. You can also import a screenshot from another tracking
            app.
          </p>
        </section>

        <Rule className="my-6" />

        <div className="px-6">
          {loading ? (
            <div className="h-64 animate-pulse border border-border bg-card" />
          ) : (
            <PeriodHistoryCalendar
              logs={logs}
              autoImport={autoImport}
              onSaved={() => {
                loadLogs();
                toast({
                  title: "Calendar updated",
                  description:
                    "Your period days are saved. Head back to today when you're ready.",
                });
              }}
            />
          )}
        </div>
      </div>

      <AlmTabs />
    </div>
  );
}