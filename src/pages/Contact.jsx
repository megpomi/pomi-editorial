import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, Loader2, Mail } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

const EMPTY = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      const response = await base44.functions.invoke("submitContactMessage", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (response.data?.error) {
        setError(response.data.error);
        return;
      }
      setSent(true);
      setForm(EMPTY);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          "We couldn't send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-pomegranate-400">
            Contact us
          </span>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-800 sm:text-4xl">
            Talk to the Pomi team
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            Questions about your account, donations, or how Pomi handles your
            data? Send us a message and we'll get back to you.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-5">
          <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:col-span-3 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-start gap-3 py-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pomegranate-100 text-pomegranate-600">
                  <Check className="h-5 w-5" />
                </span>
                <h2 className="font-heading text-lg font-semibold text-slate-800">
                  Message sent
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Thanks for getting in touch. We usually reply within two working
                  days.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSent(false)}
                  className="mt-2 rounded-full border-pomegranate-200 text-pomegranate-600 hover:bg-pomegranate-50"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Your name</Label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={update("name")}
                    maxLength={80}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Your email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    maxLength={160}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-message">How can we help?</Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={update("message")}
                    maxLength={2000}
                    rows={6}
                    required
                    className="mt-1.5"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-pomegranate-600 py-5 hover:bg-pomegranate-700"
                >
                  {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send message
                </Button>
              </form>
            )}
          </section>

          <aside className="space-y-4 sm:col-span-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pomegranate-100 text-pomegranate-600">
                <Clock className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-heading text-base font-semibold text-slate-800">
                Response times
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                We aim to reply to every message within two working days.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pomegranate-100 text-pomegranate-600">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-heading text-base font-semibold text-slate-800">
                Account and data requests
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                You can delete your account and all of its data yourself from your
                profile at any time. For anything else to do with your data, choose
                "Your data" in your message.
              </p>
            </div>
          </aside>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Pomi is not a medical device. If you have a health concern, please speak
          to a healthcare professional. In an emergency, contact your local
          emergency services.
        </p>
      </main>

      <PublicFooter />
    </div>
  );
}