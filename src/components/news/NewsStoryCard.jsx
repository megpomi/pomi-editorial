import React from "react";
import { ArrowUpRight } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { charityByValue } from "@/lib/charities";

// One story in the digest: the cause it belongs to, the headline, a two-line
// summary and the way through to the original.
export default function NewsStoryCard({ story }) {
  const cause = charityByValue(story.cause);
  const published =
    story.published_date && isValid(parseISO(story.published_date))
      ? format(parseISO(story.published_date), "d MMMM")
      : null;

  return (
    <article className="border-b border-border pb-6 last:border-b-0 last:pb-0">
      <p className="eyebrow mb-2 text-primary">{cause?.label || story.cause}</p>

      <h2 className="font-heading text-[19px] leading-snug tracking-tight">
        {story.title}
      </h2>

      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
        {story.summary}
      </p>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-heading text-[13px] text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
        >
          {story.source ? `Read in ${story.source}` : "Read the original"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        {published && (
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
            {published}
          </span>
        )}
      </div>
    </article>
  );
}