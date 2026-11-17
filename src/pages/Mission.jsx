import React from "react";
import { ArrowUpRight } from "lucide-react";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Eyebrow, Rule } from "@/components/alm/Primitives";
import { CHARITY_OPTIONS } from "@/lib/charities";
import { DONATION_SHARE } from "@/lib/donations";

const percent = `${Math.round(DONATION_SHARE * 100)}%`;

const STEPS = [
  {
    title: "Your activity generates revenue",
    body: `Pomi is free with ads, or ad-free with a subscription. Both earn the app revenue — every ad view and every subscription day counts.`,
  },
  {
    title: `${percent} of that revenue becomes your donation`,
    body: `We take ${percent} of the revenue your activity generates and put it into your personal donation pot. The rest keeps Pomi running.`,
  },
  {
    title: "Your pot is split between your causes",
    body: "Your pot is divided equally between the causes you chose in your profile. Distributions to our partner organisations are made periodically, and you can change your causes at any time.",
  },
];

export default function Mission() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <section className="px-6">
          <Eyebrow className="mb-3 text-primary">Our mission</Eyebrow>
          <h1 className="font-heading text-[26px] leading-tight tracking-tight sm:text-[30px]">
            Tracking your cycle should give something back.
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Health data is some of the most personal information there is, and it
            is usually collected for profit - Pomi's purpose is different. We've
            used similar apps and felt uncomfortable for years with the money
            going to sit in someone's bank account. Our founder wanted an
            inclusive women's health app, one that would generate donations to
            accelerate women's health research. Pomi's mission is to direct more
            funds to seven causes via the charities given below, chosen to help
            women as well as those similarly impacted.
          </p>
        </section>

        <Rule className="my-6" />

        <section className="px-6">
          <Eyebrow className="mb-4">How we donate</Eyebrow>
          <ol className="space-y-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="shrink-0 font-heading text-[20px] italic leading-none text-primary">
                  {index + 1}.
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-[17px] leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Rule className="my-7" />

        <section className="px-6">
          <Eyebrow className="mb-4">The causes we support</Eyebrow>
          <p className="mb-5 text-[13.5px] leading-relaxed text-muted-foreground">
            Each cause is delivered through more than one charitable
            organisation. Here is what they do and links to find out more
            information.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {CHARITY_OPTIONS.flatMap((cause) =>
              cause.partners.map((partner) => {
                const Icon = cause.icon;
                return (
                  <div
                    key={`${cause.value}-${partner.name}`}
                    className="flex flex-col border border-border bg-card p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border border-border bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-heading text-[16px] leading-snug">
                          {partner.name}
                        </h3>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {cause.label}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                      {partner.blurb}
                    </p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 font-heading text-[13.5px] text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
                    >
                      Visit website
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <Rule className="my-7" />

        <p className="px-6 text-[11.5px] leading-relaxed text-muted-foreground">
          Partner organisations and their websites are listed for information.
          Pomi is not affiliated with them beyond our donation distributions.
        </p>
      </div>

      <AlmTabs />
    </div>
  );
}