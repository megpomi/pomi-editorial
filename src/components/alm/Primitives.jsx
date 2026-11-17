import React from "react";
import { cn } from "@/lib/utils";

// The recurring Almanac pieces: a small caps label, a hairline, serif buttons
// and square chips. Everything else in the app is built from these.

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={cn("eyebrow text-muted-foreground", className)}>{children}</p>
  );
}

export function Rule({ className = "" }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}

export function AlmButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      {...props}
      className={cn(
        "h-12 w-full rounded-[3px] font-heading text-[16px] tracking-wide transition-[transform,background-color] duration-200 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-pomegranate-700"
          : "border border-foreground/25 bg-transparent text-foreground hover:bg-secondary",
        className
      )}
    >
      {children}
    </button>
  );
}

export function AlmChip({ on = false, children, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "rounded-[3px] border px-3 py-1.5 text-[13px] transition-colors duration-200",
        on
          ? "border-primary bg-primary text-primary-foreground"
          : "border-foreground/20 bg-transparent text-foreground hover:border-primary/50",
        className
      )}
    >
      {children}
    </button>
  );
}

// A numbered section of an entry, the way Almanac lays out its log.
export function AlmSection({ n, title, children, description, className = "" }) {
  return (
    <section className={cn("border-b border-border px-6 py-6", className)}>
      <h2 className="mb-4 font-heading text-[18px] leading-snug">
        {n ? (
          <span className="mr-2 italic text-primary">{n}.</span>
        ) : null}
        {title}
      </h2>
      {description ? (
        <p className="-mt-2 mb-4 text-[13.5px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export function AlmCard({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag
      {...props}
      className={cn("border border-border bg-card p-6", className)}
    >
      {children}
    </Tag>
  );
}

// A thin serif link with an underline that sits well in editorial prose.
export function AlmLink({ children, className = "", ...props }) {
  return (
    <a
      {...props}
      className={cn(
        "font-heading text-[14px] text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700",
        className
      )}
    >
      {children}
    </a>
  );
}