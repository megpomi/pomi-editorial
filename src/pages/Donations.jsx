import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Rule } from "@/components/alm/Primitives";
import DonationTracker from "@/components/DonationTracker";
import CharityImpact from "@/components/CharityImpact";

// The donation page: the pot built from the user's activity, split across the
// causes they chose, and the mission it feeds.
export default function Donations() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) => active && setUser(me || null))
      .catch(() => active && setUser(null));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <h1 className="sr-only">Your donations</h1>

        <div className="px-6">
          <DonationTracker user={user} />
        </div>

        <Rule className="my-7" />

        <div className="px-6">
          <CharityImpact />
        </div>

        <p className="px-6 pt-8 text-center text-[12px] leading-relaxed text-muted-foreground">
          Distributions to our partner organisations are made periodically.
        </p>
      </div>

      <AlmTabs />
    </div>
  );
}