import React from "react";
import { Link } from "react-router-dom";
import { splitByCause } from "@/lib/donations";
import { currencyOf, formatMoney } from "@/lib/currency";

export default function DonationCauses({ user, pot }) {
  const money = (value) => formatMoney(value, currencyOf(user));
  const shares = splitByCause(user, pot);

  if (!shares.length) {
    return (
      <p className="mt-5 font-heading text-[14px] italic leading-relaxed text-muted-foreground">
        You haven't chosen any causes yet. Your pot is split equally between the
        causes you pick.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <p className="eyebrow text-muted-foreground">Your causes</p>
        <span className="text-[11px] text-muted-foreground">
          all time · split equally
        </span>
      </div>
      <div className="border-t border-border">
        {shares.map((share) => (
          <Link
            key={share.value}
            to={`/causes/${share.value}`}
            className="group flex items-baseline justify-between gap-4 border-b border-border py-2.5"
          >
            <span className="font-heading text-[15px] leading-snug transition-colors group-hover:text-primary">
              {share.label}
            </span>
            <span className="font-heading text-[15px] text-primary">
              {money(share.amount)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}