import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Masthead from "@/components/alm/Masthead";
import { Eyebrow, Rule } from "@/components/alm/Primitives";

// What Pomi actually does with what you log, in the app's own words. Kept next
// to the code so the page stays true if the rules change.
const SECTIONS = [
  {
    title: "What Pomi saves",
    paragraphs: [
      "Only what you choose to log: your period days and flow, symptoms, mood, discharge and the lifestyle boxes you tick, your journal reflections, any voice note you record, and the symptom and lifestyle trackers you add yourself.",
      "Alongside that we keep the settings that make the app yours: the name you go by, the areas you asked to track, your chosen causes, your currency, and whether you want reminder emails or push notifications.",
    ],
  },
  {
    title: "Only you can read it",
    paragraphs: [
      "Every entry is tied to your account, and the server re-checks that link on every read, change and deletion. Another signed-in person cannot open your records, even if they somehow know an entry's reference.",
      "There is no page in Pomi that shows anyone else's tracking, no sharing option, and no public link to your data. Our team does not browse your entries: the app owner holds the database access that keeps the service running, and uses it only for maintenance, or for support when you ask us to look into something.",
    ],
  },
  {
    title: "Where it lives",
    paragraphs: [
      "Your tracking is stored on Pomi's managed backend, not on your phone. Journal voice notes are stored privately: they can only be opened through a link the app creates for you, and that link expires within minutes.",
      "Nothing you log is sent to a third party, and Pomi runs no third-party analytics on what you enter.",
    ],
  },
  {
    title: "Ads, donations and your data",
    paragraphs: [
      "Your entries are never sold, rented or shared with advertisers or data brokers. Donations are calculated from how much you engaged with the app, never from the content of what you logged.",
      "When you use Pomi with ads, those ads come from Google AdSense, which may use its own cookies to decide what to show. It never receives your Pomi entries, your symptoms or your journal, and you can control those cookies in your Google ad settings.",
    ],
  },
  {
    title: "Staying in control",
    paragraphs: [
      "You can change or remove any day from the calendar, turn reminders off in your profile, and delete your account at any time. Deleting your account erases every cycle log, daily entry, journal note and custom tracker on the server, not just from your screen.",
      "On a shared device, log out when you are finished. Answers you give before signing in are held in that browser tab only, and are discarded when you close it.",
    ],
  },
];

export default function Privacy() {
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

          <Eyebrow className="mb-3 text-primary">Privacy</Eyebrow>
          <h1 className="font-heading text-[28px] leading-[1.1] tracking-tight sm:text-[32px]">
            How Pomi protects your health data.
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            What you log here is the most personal thing in the app. This page
            sets out exactly what happens to it, in plain words, with nothing
            buried.
          </p>
        </div>

        <Rule className="my-6" />

        <div className="space-y-7 px-6">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-[19px] leading-snug">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <Rule className="my-7" />

        <p className="px-6 text-[12.5px] leading-relaxed text-muted-foreground">
          Something here you'd like explained?{" "}
          <Link
            to="/contact"
            className="font-heading text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
          >
            Get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  );
}