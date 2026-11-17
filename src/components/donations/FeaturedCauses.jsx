import React from "react";
import { Link } from "react-router-dom";
import { featuredCauses } from "@/lib/charities";

// The featured partners, printed on the dark band that closes the day.
export default function FeaturedCauses() {
  const featured = featuredCauses();

  return (
    <section className="bg-pomegranate-800 px-6 py-7 text-pomegranate-50 sm:px-8">
      <p className="eyebrow mb-2 text-pomegranate-100/70">
        Today's featured causes
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
      <p className="mt-3 text-[12px] leading-relaxed text-pomegranate-100/75">
        New partners featured daily — donation distributions are made by Pomi
        periodically.
      </p>
    </section>
  );
}