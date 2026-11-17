import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Eyebrow, Rule } from "@/components/alm/Primitives";
import { useToast } from "@/components/ui/use-toast";
import PeriodHistoryCalendar from "@/components/calendar/PeriodHistoryCalendar";
import { format } from "date-fns";

export default function CycleCalendar() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
          kicker={format(new Date(), "MMMM yyyy")}
          actions={
            <Link
              to="/"
              className="font-heading text-[12.5px] italic text-primary underline underline-offset-4"
            >
              Today
            </Link>
          }
        />

        <section className="px-6">
          <Eyebrow>The month</Eyebrow>
          <h1 className="mt-3 font-heading text-[34px] leading-[1.05] tracking-tight">
            A record of your <span className="italic text-primary">months.</span>
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Tap the days you were menstruating to add them, or tap a recorded
            day to remove it. You can also bring in history from a screenshot.
          </p>
        </section>

        <Rule className="my-6" />

        <div className="px-6">
          {loading ? (
            <div className="h-64 animate-pulse border border-border bg-card" />
          ) : (
            <PeriodHistoryCalendar
              logs={logs}
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

        <div className="px-6 pt-8 text-center">
          <Link
            to="/"
            className="font-heading text-[13px] italic text-primary underline underline-offset-4"
          >
            Back to today
          </Link>
        </div>
      </div>
      <AlmTabs />
    </div>
  );
}