import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import Pomegranate from "@/components/alm/Pomegranate";
import { AlmButton, Eyebrow, Rule } from "@/components/alm/Primitives";

export default function IntroStep({ onStart }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const points = [
    "Kept for you, and never sold",
    "Your record powers your own insights",
    "Every entry helps fund causes you choose",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          <motion.div layout className="flex flex-col items-start">
            <motion.div layout transition={{ duration: 0.6, ease: "easeInOut" }}>
              <Pomegranate size={revealed ? 96 : 140} />
            </motion.div>
          </motion.div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Eyebrow className="mt-6">Est. for your own record</Eyebrow>
              <h1 className="mt-3 font-heading text-[38px] leading-[1.05] tracking-tight sm:text-[44px]">
                A quiet record
                <br />
                <span className="italic text-primary">of your cycle.</span>
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Pomi helps you notice your own rhythm: gently, privately, and in
                your own words.
              </p>
            </motion.div>
          )}

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ul className="mt-7 space-y-2.5 text-[14px]">
                {points.map((t) => (
                  <li key={t} className="flex items-baseline gap-3">
                    <span className="h-px w-4 shrink-0 bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <AlmButton onClick={onStart}>Begin</AlmButton>
              </div>

              <Rule className="my-6" />

              <p className="text-center text-[13px] text-muted-foreground">
                Already keep a record with Pomi?{" "}
                <Link
                  to="/login"
                  className="font-heading italic text-primary underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}