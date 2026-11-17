import React from "react";

// The month's symptom totals as a grid of figures, the ones logged most first.
export default function SymptomTiles({ symptoms, monthLabel }) {
  if (symptoms.length === 0) {
    return (
      <p className="border-l-2 border-border pl-4 font-heading text-[14px] italic text-muted-foreground">
        No symptoms recorded in {monthLabel}.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-y-5 sm:grid-cols-4">
      {symptoms.map((symptom) => (
        <div key={symptom.key}>
          <p className="font-heading text-[22px] leading-none text-primary">
            {symptom.count}
          </p>
          <p className="eyebrow mt-2 text-muted-foreground">{symptom.label}</p>
        </div>
      ))}
    </div>
  );
}