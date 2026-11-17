import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { CHARITY_OPTIONS } from "@/lib/charities";
import { DONATION_SHARE } from "@/lib/donations";

const percent = `${Math.round(DONATION_SHARE * 100)}%`;

const PILLARS = [
  {
    icon: Heart,
    title: "Tracking that gives back",
    body: `Pomi is free with ads, or ad-free with a subscription. Either way, ${percent} of the revenue your activity generates is set aside as a donation, split between the causes you choose.`,
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    body: "Your cycle, mood and journal entries are private to your account. We don't sell your health data, and you can delete your account and everything in it at any time.",
  },
  {
    icon: Sparkles,
    title: "Built for real bodies",
    body: "Pomi tracks menstrual cycles, symptoms and day-to-day wellbeing, and it is designed to be inclusive: whether you are tracking a cycle, coming off contraception or simply keeping an eye on how you feel.",
  },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <div className="overflow-hidden rounded-3xl border border-pomegranate-100 bg-gradient-to-br from-pomegranate-500 to-pomegranate-800 p-8 text-white sm:p-10">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 fill-white/80" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">
              About us
            </span>
          </div>
          <h1 className="font-heading text-3xl font-semibold leading-snug sm:text-4xl">
            A women's health app that shares what it earns.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85">
            Pomi is named after the pomegranate, a symbol of health, abundance
            and natural cycles. We built it because we used period trackers for
            years and felt uneasy that the money our most personal data generated
            went into someone else's pocket. Pomi works the other way: the revenue
            your tracking creates goes to women's health causes.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl border border-slate-100 bg-white p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pomegranate-100 text-pomegranate-600">
                <pillar.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-heading text-base font-semibold text-slate-800">
                {pillar.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {pillar.body}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            What Pomi tracks
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            You choose what you want to track when you sign up, and you can change
            it at any time from your profile. Menstrual cycle tracking covers
            period days, flow, predicted fertile windows and symptoms. General
            wellbeing tracking gives you a daily check-in, a journalling prompt and
            a place to note how you feel, with or without a cycle. Everything you
            log stays in one place, so you can look back over time and spot
            patterns.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Pomi is not a medical device and does not provide medical advice.
            Predictions are estimates based on what you log, and they should never
            replace a conversation with a healthcare professional.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            The causes we support
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Donations are spread across {CHARITY_OPTIONS.length} areas of women's
            health, each delivered through charities we have chosen for their work:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CHARITY_OPTIONS.map((cause) => (
              <li
                key={cause.value}
                className="rounded-full bg-pomegranate-50 px-3 py-1.5 text-xs font-medium text-pomegranate-700"
              >
                {cause.label}
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
          >
            Questions about how it works? Contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <p className="mt-8 text-center text-xs text-slate-400">
          Pomi is an independent app. Your data is used to provide the app and to
          calculate donations, and nothing else.
        </p>
      </main>

      <PublicFooter />
    </div>
  );
}