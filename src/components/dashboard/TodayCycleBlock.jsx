import React from "react";
import { Link } from "react-router-dom";
import { Eyebrow, Rule } from "@/components/alm/Primitives";
import TodayStatus from "@/components/dashboard/TodayStatus";
import PhasePomegranate from "@/components/dashboard/PhasePomegranate";

// The top of the dashboard, set the way the Almanac prints its front page:
// a small caps label, the day of the cycle as the headline, the phase in
// italic beneath it, and then the day's note in a paragraph.
export default function TodayCycleBlock({
  kicker,
  title,
  subtitle,
  note,
  logHref,
  status,
  phase,
}) {
  const Heading = (
    <span className="font-heading text-[46px] leading-[0.95] tracking-tight sm:text-[64px]">
      {title}
    </span>
  );

  return (
    <>
      <section className="px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow>{kicker}</Eyebrow>
            <h1 className="mt-3 text-foreground">
              {logHref ? (
                <Link
                  to={logHref}
                  className="inline-block transition-colors hover:text-primary"
                >
                  {Heading}
                </Link>
              ) : (
                Heading
              )}
            </h1>
            {subtitle ? (
              <p className="mt-2 font-heading text-[17px] italic leading-snug text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
          <PhasePomegranate phase={phase} className="-mt-1" />
        </div>
      </section>

      <Rule className="my-6" />

      <section className="px-6">
        <Eyebrow className="mb-3">The day's note</Eyebrow>
        <p className="alm-dropcap text-[15px] leading-[1.65]">{note}</p>
      </section>

      {status ? (
        <>
          <Rule className="my-6" />
          <section className="px-6">
            <TodayStatus status={status} />
          </section>
        </>
      ) : null}

      <Rule className="my-6" />
    </>
  );
}