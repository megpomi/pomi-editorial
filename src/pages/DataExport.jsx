import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import {
  AlmButton,
  AlmChip,
  AlmSection,
  Eyebrow,
  Rule,
} from "@/components/alm/Primitives";
import { Textarea } from "@/components/ui/textarea";

// The choices a person can make about their own records. Each one is folded into
// the message an admin reads, so nothing has to be retyped in an email.
const REQUESTS = [
  {
    value: "export",
    label: "Send me a copy of my data",
    intro:
      "We'll prepare a file of everything tied to your account: your period days, daily entries, journal notes and settings.",
  },
  {
    value: "correct",
    label: "Correct something in my data",
    intro:
      "Tell us which day or setting is wrong and what it should say, and we'll put it right.",
  },
  {
    value: "delete",
    label: "Delete some of my data",
    intro:
      "Tell us which days or trackers you want removed. For everything at once, use Delete my account instead.",
  },
];

export default function DataExport() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("export");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setUser(u || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const chosen = REQUESTS.find((request) => request.value === type) || REQUESTS[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;
    setSending(true);
    setError("");
    const name =
      user.preferred_name || user.full_name || user.email.split("@")[0] || "Pomi user";
    const message = [
      `Data request: ${chosen.label}.`,
      `Account: ${user.email}`,
      details.trim() ? `Details: ${details.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await base44.functions.invoke("submitContactMessage", {
        name,
        email: user.email,
        message,
      });
      if (response?.data?.error) throw new Error(response.data.error);
      setSent(true);
    } catch (e) {
      setError(e?.message || "We couldn't send your request. Please try again.");
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-20">
        <Masthead />

        <div className="px-6">
          <Link
            to="/profile"
            className="mb-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to my profile
          </Link>

          <Eyebrow className="mb-3 text-primary">Your data</Eyebrow>
          <h1 className="font-heading text-[28px] leading-[1.1] tracking-tight sm:text-[32px]">
            Request a copy of your data.
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            You can ask for everything Pomi holds about you, ask us to correct
            it, or ask us to remove part of it. Choose what you need below and
            we'll reply to the email address on your account.
          </p>
        </div>

        <Rule className="my-6" />

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pomegranate-100 border-t-pomegranate-600" />
          </div>
        ) : sent ? (
          <div className="px-6 py-10">
            <span className="flex h-10 w-10 items-center justify-center rounded-[3px] border border-border bg-secondary text-primary">
              <Check className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-heading text-[21px] leading-snug">
              Your request is with us.
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              We'll reply to {user?.email} once it's done. Requests are usually
              answered within a few days.
            </p>
            <Link
              to="/profile"
              className="mt-6 inline-block font-heading text-[14px] text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
            >
              Back to my profile
            </Link>
          </div>
        ) : !user ? (
          <div className="px-6 py-10 text-center">
            <p className="font-heading text-[17px]">We couldn't load your account.</p>
            <Link
              to="/login"
              className="mt-3 inline-block font-heading text-[14px] text-primary underline decoration-1 underline-offset-4"
            >
              Sign in again
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <AlmSection n="1" title="What would you like us to do?">
              <div className="flex flex-col gap-2">
                {REQUESTS.map((request) => (
                  <AlmChip
                    key={request.value}
                    on={type === request.value}
                    onClick={() => setType(request.value)}
                    className="w-full py-3 text-left font-heading text-[14px]"
                  >
                    {request.label}
                  </AlmChip>
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {chosen.intro}
              </p>
            </AlmSection>

            <AlmSection n="2" title="Anything we should know?">
              <Textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                maxLength={1000}
                rows={5}
                placeholder="Optional — add dates, entries or details that help us find what you need."
                className="rounded-[3px] text-[14px]"
              />
              <p className="mt-2 text-[12px] text-muted-foreground">
                {details.length}/1000
              </p>
            </AlmSection>

            <AlmSection n="3" title="Where we'll reply">
              <p className="text-[14px] font-medium">{user.email}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                We only reply to the address on your account, so no one else can
                collect your data.
              </p>
            </AlmSection>

            <div className="px-6 pt-6">
              <AlmButton type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send my request"}
              </AlmButton>
              {error ? (
                <p className="mt-3 text-center text-[12.5px] text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}