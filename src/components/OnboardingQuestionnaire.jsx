import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles } from "lucide-react";
import { CHARITY_OPTIONS } from "@/lib/charities";
import {
  TRACKING_OPTIONS,
  CYCLE_FOCUS,
  addFocus,
  removeFocus,
} from "@/lib/tracking";
import {
  clearOnboardingDraft,
  writeOnboardingDraft,
} from "@/lib/onboardingDraft";
import { AlmButton } from "@/components/alm/Primitives";
import ChoiceCard from "@/components/onboarding/ChoiceCard";
import IntroStep from "@/components/onboarding/IntroStep";
import AccountStep from "@/components/onboarding/AccountStep";

// Cycle tracking starts switched on — Pomi is a cycle tracker first — and can be
// turned off again. Conception tracking always travels with it.
const ALWAYS_TRACKED = CYCLE_FOCUS;

export default function OnboardingQuestionnaire({ draft, onComplete }) {
  const [step, setStep] = useState(0);
  const [trackingFocus, setTrackingFocus] = useState(() => {
    const saved = draft?.tracking_focus || [];
    return saved.includes(ALWAYS_TRACKED)
      ? saved
      : [ALWAYS_TRACKED, ...saved];
  });
  const [charityInterests, setCharityInterests] = useState(
    draft?.charity_interests || []
  );
  const [restoring, setRestoring] = useState(Boolean(draft));

  // Back from Google/Apple sign-in: the account exists now, so save the answers
  // chosen before the redirect and pick the flow up where it left off.
  useEffect(() => {
    if (!draft) return;
    base44.auth
      .updateMe({
        tracking_focus: draft.tracking_focus,
        charity_interests: draft.charity_interests,
        preferred_name: draft.preferred_name,
      })
      .then(() => {
        clearOnboardingDraft();
        setRestoring(false);
        // The account is made, so the dashboard takes over from here.
        onComplete(draft.tracking_focus);
      })
      .catch(() => {
        clearOnboardingDraft();
        setRestoring(false);
        setStep(1);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const allCharitiesSelected =
    charityInterests.length === CHARITY_OPTIONS.length;

  const toggleAllCharities = () =>
    setCharityInterests(
      allCharitiesSelected ? [] : CHARITY_OPTIONS.map((o) => o.value)
    );

  // Answers are parked before leaving this page, so the account that gets
  // created (Google/Apple/Facebook or email) can pick them up straight after.
  const handleAccountReady = (name, provider) => {
    writeOnboardingDraft({
      preferred_name: name,
      tracking_focus: trackingFocus,
      charity_interests: charityInterests,
    });
    if (provider) {
      base44.auth.loginWithProvider(provider, "/");
    } else {
      window.location.href = "/";
    }
  };

  const isFirst = step === 1;
  const options = isFirst ? TRACKING_OPTIONS : CHARITY_OPTIONS;
  const selected = isFirst ? trackingFocus : charityInterests;
  const toggleCurrent = (value) => {
    if (!isFirst) {
      toggle(setCharityInterests)(value);
      return;
    }
    setTrackingFocus((prev) =>
      prev.includes(value) ? removeFocus(prev, value) : addFocus(prev, value)
    );
  };

  if (restoring) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pomegranate-100 border-t-pomegranate-600" />
      </div>
    );
  }

  if (step === 0) {
    return <IntroStep onStart={() => setStep(1)} />;
  }

  if (step === 3) {
    return (
      <AccountStep onBack={() => setStep(2)} onContinue={handleAccountReady} />
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-[24px] italic leading-none text-primary">
            Pomi
          </span>
          <span className="eyebrow text-muted-foreground">
            No. {["I", "II", "III"][step - 1] || "I"} of III
          </span>
        </div>
        <div className="mt-3 h-[4px] border-y border-foreground" />
        <div className="mb-8 mt-8">
          <h1 className="font-heading text-[32px] leading-tight tracking-tight">
            {isFirst
              ? "What would you like to track?"
              : "Which causes matter to you?"}
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            {isFirst
              ? "Choose what matters to you — this shapes your personalised insights and symptoms predictions and can be updated at any point."
              : "A share of what Pomi earns is donated to these areas - Pick the ones you'd like to support directly, these can be updated at any point."}
          </p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <ChoiceCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              desc={opt.desc}
              active={selected.includes(opt.value)}
              comingSoon={opt.comingSoon}
              onClick={() => toggleCurrent(opt.value)}
            />
          ))}
          {!isFirst && (
            <ChoiceCard
              icon={Sparkles}
              label="All of the above"
              active={allCharitiesSelected}
              onClick={toggleAllCharities}
            />
          )}
        </div>

        <div className="mt-7 grid grid-cols-[auto_1fr] gap-3">
          <button
            type="button"
            onClick={() => setStep(isFirst ? 0 : step - 1)}
            className="h-12 rounded-[3px] border border-foreground/25 px-6 font-heading text-[15px] transition-colors hover:bg-secondary"
          >
            Back
          </button>
          <AlmButton
            onClick={() => setStep(step + 1)}
            disabled={!selected.length}
          >
            Continue
          </AlmButton>
        </div>
      </div>
    </div>
  );
}