import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Image } from "@/components/ui/image";
import pomiLogo from "@/assets/pomi-logo.png";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { groupBleedingDays } from "@/lib/cycle";

const COPY = {
  menstrual_cycles: {
    question: "Are you currently menstruating?",
    prompt:
      "Tap the days you were bleeding — scroll back through the months to build your history.",
  },
  default: {
    question: "Do you currently experience menstrual symptoms?",
    prompt:
      "Tap the days you experienced menstrual bleeding - scroll back through the months to build your history.",
  },
};

const formatDay = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export default function SymptomHistoryStep({ trackingFocus, onComplete, onBack }) {
  const isMenstrual = (trackingFocus || []).includes("menstrual_cycles");
  const copy = isMenstrual ? COPY.menstrual_cycles : COPY.default;
  const [currentlyActive, setCurrentlyActive] = useState(false);
  const [days, setDays] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date();
  const historyStart = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const handleFinish = async () => {
    setSaving(true);
    setError("");
    try {
      const selected = days.map(formatDay);
      if (isMenstrual) {
        const runs = groupBleedingDays(selected);
        if (runs.length) {
          await base44.entities.CycleLog.bulkCreate(
            runs.map((run) => ({ ...run, flow_intensity: "medium" }))
          );
        }
        await base44.auth.updateMe({ currently_menstruating: currentlyActive });
      } else {
        await base44.auth.updateMe({ symptom_history: selected });
      }
      onComplete(trackingFocus);
    } catch (e) {
      setError(e?.message || "Couldn't save your history. Please try again.");
      setSaving(false);
    }
  };

  // Opening the calendar lands on the most recent month — the current date.
  const scrollToLatest = (node) => {
    if (node) node.scrollTop = node.scrollHeight;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={pomiLogo}
            alt="Pomi"
            className="h-12 w-12"
            fittingType="fit"
          />
          <h1 className="mt-4 font-heading text-3xl font-semibold text-slate-800">
            {copy.question}
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Let's enter some data.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-pomegranate-100 bg-white px-5 py-4">
          <span className="text-sm font-medium text-slate-700">
            {currentlyActive ? "Yes" : "No"}
          </span>
          <Switch
            checked={currentlyActive}
            onCheckedChange={setCurrentlyActive}
          />
        </div>

        {currentlyActive && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-slate-500">{copy.prompt}</p>
            <div
              ref={scrollToLatest}
              className="max-h-[26rem] overflow-y-auto rounded-2xl border border-pomegranate-100 bg-white p-1"
            >
              <Calendar
                mode="multiple"
                selected={days}
                onSelect={(value) => setDays(value || [])}
                numberOfMonths={12}
                defaultMonth={historyStart}
                disabled={{ after: today }}
                classNames={{
                  months: "flex flex-col items-center",
                  month: "w-full space-y-3",
                  head_row: "flex w-full",
                  head_cell: "flex-1 font-normal text-[0.8rem] text-muted-foreground",
                  row: "flex w-full mt-1",
                  cell: "relative flex-1 p-0 text-center text-sm",
                  day: "inline-flex h-11 w-full items-center justify-center rounded-full p-0 text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-selected:opacity-100",
                  day_selected:
                    "bg-pomegranate-600 text-primary-foreground hover:bg-pomegranate-600 focus:bg-pomegranate-600",
                  day_today: "font-semibold",
                }}
                className="w-full p-3"
              />
            </div>
            {days.length > 0 && (
              <p className="mt-2 text-xs text-pomegranate-600">
                {days.length} day{days.length === 1 ? "" : "s"} selected
              </p>
            )}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={saving}
            className="rounded-full border-pomegranate-200 px-5 text-pomegranate-600 hover:bg-pomegranate-50"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleFinish}
            disabled={saving}
            className="flex-1 rounded-full bg-pomegranate-600 py-6 text-base hover:bg-pomegranate-700"
          >
            {saving ? "Saving…" : "Finish"}
            {!saving && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}