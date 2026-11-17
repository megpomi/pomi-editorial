import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import Pomegranate from "@/components/alm/Pomegranate";
import { AlmButton } from "@/components/alm/Primitives";

export default function IntroStep({ onStart }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const points = [
    "Our purpose is built on the simple idea that every cycle is powerful and should be used for further good.",
    "Your data powers personalised health insights.",
    "Your account generates trackable donations made to charitable causes important to you.",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          <motion.div layout className="flex flex-col items-start">
            <motion.div layout transition={{ duration: 0.6, ease: "easeInOut" }}>
              <Pomegranate
                size={revealed ? "min(26vh, 100%)" : "min(36vh, 100%)"}
              />
            </motion.div>
          </motion.div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h1 className="mt-6 font-heading text-[38px] leading-[1.05] tracking-tight sm:text-[44px]">
                Welcome to Pomi
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                As in the pomegranate - Symbolic of health, abundance and
                natural cycles.
              </p>
            </motion.div>
          )}

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ul className="mt-7 space-y-3 text-[14px] leading-relaxed">
                {points.map((t) => (
                  <li key={t} className="flex items-baseline gap-3">
                    <span className="h-px w-4 shrink-0 bg-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <AlmButton onClick={onStart}>Start with Pomi</AlmButton>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}