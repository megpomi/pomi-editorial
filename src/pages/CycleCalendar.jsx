import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Rule } from "@/components/alm/Primitives";
import { useToast } from "@/components/ui/use-toast";
import PeriodHistoryCalendar from "@/components/calendar/PeriodHistoryCalendar";

export default function CycleCalendar() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // Arriving from the dashboard prompt to import a screenshot.
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
        .then((res) => setLogs(res.items))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead
          kicker="Month"
          actions={
            <Link
              to="/"
              className="font-heading text-[12.5px] italic text-primary underline underline-offset-4"
            >
              Back to my dashboard
            </Link>
          }
        />

        <section className="px-6">
          <h1 className="font-heading text-[26px] leading-tight tracking-tight sm:text-[30px]">
            Log historical menstrual days
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Tap days you were menstruating to add them, or tap a logged day to
            remove it.
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
                    "Your period days are saved. Head back to your cycle when you're ready.",
                });
              }}
            />
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="font-heading text-[13px] italic text-primary underline underline-offset-4"
          >
            Back to my dashboard
          </Link>
        </div>
      </div>

      <AlmTabs />
    </div>
  );
}