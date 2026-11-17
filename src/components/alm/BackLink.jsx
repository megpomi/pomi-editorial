import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// The small return link that sits above a page's headline, so a page opened
// from another one always shows the way back a single step.
export default function BackLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary",
        className
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {children}
    </Link>
  );
}