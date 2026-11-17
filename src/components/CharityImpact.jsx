import React from "react";
import ContributionDays from "@/components/ContributionDays";

export default function CharityImpact() {
  return (
    <section className="bg-pomegranate-800 p-6 text-pomegranate-50 sm:p-8">
      <h3 className="font-heading text-[24px] leading-snug sm:text-[28px]">
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
        <p className="mt-3 text-[12px] leading-relaxed text-pomegranate-100/80">
          Consistent tracking powers the community that makes these donations
          possible.
        </p>
      </div>
    </section>
  );
}