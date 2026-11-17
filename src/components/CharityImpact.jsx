import React from "react";
import { Link } from "react-router-dom";
import { featuredCauses } from "@/lib/charities";
import ContributionDays from "@/components/ContributionDays";

export default function CharityImpact() {
  const featured = featuredCauses();
  return (
    <section className="bg-pomegranate-800 p-6 text-pomegranate-50 sm:p-8">
      <Link
        to="/mission"
        className="eyebrow inline-block text-pomegranate-100/80 underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-50"
      >
        Our mission
      </Link>

      <h3 className="mt-4 font-heading text-[24px] leading-snug sm:text-[28px]">
        Every day you track helps fund{" "}
        <span className="italic text-pomegranate-100">important causes.</span>
      </h3>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-pomegranate-100/85">
        Pomi is free with ads, or ad-free with a subscription. A share of the
        revenue earned is donated to your selected nonprofits, supporting women
        and LGBTQ+ in a range of health areas.
      </p>

      <div className="mt-6 border-t border-pomegranate-100/25 pt-4">
        <p className="eyebrow text-pomegranate-100/70">Your contribution</p>
        <ContributionDays />
        <p className="mt-3 text-[11.5px] leading-relaxed text-pomegranate-100/70">
          Consistent tracking powers the community that makes these donations
          possible.
        </p>
      </div>

      <div className="mt-6">
        <p className="eyebrow mb-2 text-pomegranate-100/70">
          Today's featured causes we support
        </p>
        <div className="border-t border-pomegranate-100/25">
          {featured.map((c) => (
            <Link
              key={c.value}
              to={`/causes/${c.value}`}
              className="flex items-baseline justify-between gap-4 border-b border-pomegranate-100/25 py-2.5 transition-colors hover:text-white"
            >
              <span>
                <span className="block font-heading text-[16px] leading-snug">
                  {c.partners.map((p) => p.name).join(" & ")}
                </span>
                <span className="block text-[12px] text-pomegranate-100/70">
                  {c.label}
                </span>
              </span>
              <span className="shrink-0 text-[15px] text-pomegranate-100/70">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
        <Link
          to="/mission"
          className="mt-4 inline-block font-heading text-[13px] italic text-pomegranate-50 underline underline-offset-4"
        >
          Our mission &amp; how we donate
        </Link>
        <p className="mt-3 text-[11px] leading-relaxed text-pomegranate-100/60">
          New partners featured daily — donation distributions are made by Pomi
          periodically.
        </p>
      </div>
    </section>
  );
}