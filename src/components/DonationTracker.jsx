import React from "react";
import { AD_REVENUE_PER_VISIT, donationTotals } from "@/lib/donations";
import DonationCauses from "@/components/donations/DonationCauses";
import { currencyOf, formatMoney } from "@/lib/currency";
import useIsSubscriber from "@/hooks/use-is-subscriber";
import { Eyebrow } from "@/components/alm/Primitives";

export default function DonationTracker({ user }) {
  const money = (value) => formatMoney(value, currencyOf(user));
  const subscriber = useIsSubscriber();
  const totals = donationTotals(user, subscriber);
  const subscribed = totals.mode === "subscription";

  const countLabel = (count) =>
    subscribed
      ? `${count} ${count === 1 ? "day" : "days"} subscribed`
      : `${count} ${count === 1 ? "ad view" : "ad views"}`;

  const fromLabel = (revenue, count) =>
    `from ${money(revenue)} revenue · ${countLabel(count)}`;

  return (
    <section>
      <Eyebrow>Your contribution</Eyebrow>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
        Track the growth of your donation pot. Revenue is earned from your
        engagement and is split equally between your chosen causes.
      </p>

      <div className="mt-5 grid grid-cols-2 divide-x divide-border border-y border-border">
        <div className="py-4 pr-4">
          <p className="eyebrow text-muted-foreground">This month</p>
          <p className="mt-2 font-heading text-[30px] leading-none text-primary">
            {money(totals.thisMonth)}
          </p>
          <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
            {fromLabel(totals.thisMonthRevenue, totals.thisMonthCount)}
          </p>
        </div>
        <div className="py-4 pl-4">
          <p className="eyebrow text-muted-foreground">All time</p>
          <p className="mt-2 font-heading text-[30px] leading-none">
            {money(totals.allTime)}
          </p>
          <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
            {fromLabel(totals.allTimeRevenue, totals.allTimeCount)}
          </p>
        </div>
      </div>

      <DonationCauses user={user} pot={totals.allTime} />

      {!subscribed && (
        <p className="mt-4 text-[12px] italic leading-relaxed text-muted-foreground">
          {`${money(AD_REVENUE_PER_VISIT)} of ad revenue per visit — go ad-free to donate more`}
        </p>
      )}
    </section>
  );
}