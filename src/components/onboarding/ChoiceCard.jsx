import React from "react";
import { Check } from "lucide-react";

export default function ChoiceCard({ icon: Icon, label, desc, active, onClick, comingSoon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-pomegranate-400 bg-pomegranate-50/70 ring-1 ring-pomegranate-300"
          : "border-pomegranate-100 bg-white hover:border-pomegranate-200 hover:bg-pomegranate-50/40"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-pomegranate-500 text-white"
            : "bg-pomegranate-50 text-pomegranate-500"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-800">{label}</span>
          {comingSoon && (
            <span className="rounded-full bg-pomegranate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-pomegranate-600">
              Coming soon
            </span>
          )}
        </span>
        {desc && (
          <span className="mt-0.5 block text-sm text-slate-500">{desc}</span>
        )}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          active
            ? "border-pomegranate-500 bg-pomegranate-500 text-white"
            : "border-pomegranate-200"
        }`}
      >
        {active && <Check className="h-4 w-4" />}
      </span>
    </button>
  );
}