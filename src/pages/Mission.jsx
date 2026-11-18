import React from "react";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import MissionContent from "@/components/mission/MissionContent";

export default function Mission() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <div className="px-6">
          <MissionContent />
        </div>
      </div>

      <AlmTabs />
    </div>
  );
}