import React, { useEffect, useState } from "react";
import {
  CONSENT_OPEN_EVENT,
  applySavedConsent,
  readConsent,
  saveConsent,
} from "@/lib/consent";

// The one cookie and ads notice. Sits on the topmost layer, above the header
// and the tabs, and only appears until a choice is saved — or when the
// "Cookie settings" link asks it back.
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    applySavedConsent();
    if (!readConsent()) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const choose = (granted) => {
    saveConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-2xl border border-border bg-card p-5 shadow-[0_10px_40px_rgba(44,24,16,0.16)] sm:p-6">
        <p className="eyebrow text-primary">Cookies and ads</p>
        <p className="mt-2 font-heading text-[17px] leading-snug text-foreground">
          A word about the ads that fund your donations.
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
          Pomi is free because of the ads you see here. With your permission we
          use cookies to show them and to understand how the app is used. Say no
          and everything still works — you will simply see less relevant ads.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose(true)}
            className="h-11 flex-1 rounded-[3px] bg-primary font-heading text-[14.5px] tracking-wide text-primary-foreground transition-colors hover:bg-pomegranate-700"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="h-11 flex-1 rounded-[3px] border border-foreground/25 bg-transparent font-heading text-[14.5px] tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}