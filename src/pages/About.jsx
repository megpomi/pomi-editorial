import React from "react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import MissionContent from "@/components/mission/MissionContent";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 py-8 sm:py-12">
        <div className="px-5 sm:px-8">
          <MissionContent />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}