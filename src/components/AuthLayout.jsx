import React from "react";
import Pomegranate from "@/components/alm/Pomegranate";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-[24px] italic leading-none text-primary">
              Pomi
            </span>
          </div>
          <div className="mt-3 h-[4px] border-y border-foreground" />
          <div className="mt-8 flex justify-center">
            <Pomegranate size={64} />
          </div>
          <h1 className="mt-5 text-center font-heading text-[30px] leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-center text-[14px] leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="border border-border bg-card p-6 sm:p-8">{children}</div>

        {footer && (
          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}