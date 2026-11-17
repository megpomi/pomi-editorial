import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pomegranate from "@/components/alm/Pomegranate";
import { AlmButton, Eyebrow, Rule } from "@/components/alm/Primitives";

// The page a reminder email's footer link lands on. It reads the token from the
// URL fragment, tells the platform, and stores nothing itself — the Emails tab
// keeps the list of who has unsubscribed.
function inPreview() {
  return (
    window.self !== window.top ||
    /^preview(-sandbox)?--/.test(window.location.hostname)
  );
}

export default function Unsubscribe() {
  const [status, setStatus] = useState("working");

  const unsubscribe = useCallback(async (token) => {
    setStatus("working");
    try {
      const res = await fetch("/api/app-emails/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) return setStatus("done");
      if (res.status === 400) return setStatus("invalid");
      setStatus("error");
    } catch (e) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get(
      "token"
    );
    if (token) {
      unsubscribe(token);
      return;
    }
    setStatus(inPreview() ? "preview" : "invalid");
  }, [unsubscribe]);

  const retry = () => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get(
      "token"
    );
    if (token) unsubscribe(token);
  };

  return (
    <div className="min-h-screen bg-background paper-grain">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <div className="border border-border bg-card px-7 py-9 sm:px-9 sm:py-11">
          <div className="flex items-center gap-2">
            <Pomegranate size={24} />
            <span className="font-heading text-[22px] italic leading-none text-primary">
              Pomi
            </span>
          </div>

          <Rule className="my-6" />

          {status === "working" && (
            <>
              <Eyebrow className="mb-3 text-primary">Your emails</Eyebrow>
              <h1 className="font-heading text-[26px] leading-tight">
                Removing you from our reminder emails.
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                One moment while we update your preference.
              </p>
            </>
          )}

          {(status === "done" || status === "preview") && (
            <>
              <Eyebrow className="mb-3 text-primary">
                {status === "preview" ? "Preview" : "You're unsubscribed"}
              </Eyebrow>
              <h1 className="font-heading text-[26px] leading-tight">
                No more reminder emails from us.
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                You won't receive our reminder or marketing emails any more.
                Transactional emails, such as receipts and password resets, will
                still arrive.
              </p>
              <p className="mt-5 text-[13.5px] leading-relaxed text-muted-foreground">
                Changed your mind? You can turn reminders back on any time in
                your profile settings.
              </p>
              <div className="mt-8">
                <AlmButton onClick={() => (window.location.href = "/")}>
                  Back to Pomi
                </AlmButton>
              </div>
            </>
          )}

          {status === "invalid" && (
            <>
              <Eyebrow className="mb-3 text-primary">Your emails</Eyebrow>
              <h1 className="font-heading text-[26px] leading-tight">
                This link doesn't work.
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                The unsubscribe link may have expired or been copied
                incompletely. Open the latest email we sent you and use the
                unsubscribe link at its foot.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <Eyebrow className="mb-3 text-primary">Your emails</Eyebrow>
              <h1 className="font-heading text-[26px] leading-tight">
                We couldn't update your preference.
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                Something went wrong on our side. Please try once more.
              </p>
              <div className="mt-8">
                <AlmButton onClick={retry}>Try again</AlmButton>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-muted-foreground">
          <Link to="/privacy" className="underline decoration-1 underline-offset-4">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}