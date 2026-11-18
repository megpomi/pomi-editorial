import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { AlmButton, Rule } from "@/components/alm/Primitives";
import NewsStoryCard from "@/components/news/NewsStoryCard";
import { charityLabel } from "@/lib/charities";

// The paper's news desk: a daily digest of research milestones and press
// coverage for the causes the reader chose to support.
export default function InTheNews() {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke("newsDigest", {});
      setDigest(response.data?.digest || null);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          "We couldn't put today's edition together. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stories = digest?.stories || [];
  const causes = digest?.causes || [];
  const compiled =
    digest?.digest_date && isValid(parseISO(digest.digest_date))
      ? format(parseISO(digest.digest_date), "d MMMM yyyy")
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <h1 className="eyebrow mb-4 px-6 text-primary">In the News</h1>

        {loading && (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="mt-4 font-heading text-[14px] italic text-muted-foreground">
              Opening the edition…
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="px-6">
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              {error}
            </p>
            <div className="mt-5 max-w-xs">
              <AlmButton onClick={load}>Try again</AlmButton>
            </div>
          </div>
        )}

        {!loading && !error && !digest && (
          <div className="px-6">
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              There's no edition on file just now. Please check back soon.
            </p>
            <div className="mt-5 max-w-xs">
              <Link to="/mission">
                <AlmButton>See the causes we support</AlmButton>
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && digest && causes.length > 0 && (
          <>
            <section className="px-6">
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Research milestones and mentions in the press for{" "}
                {causes.map((value) => charityLabel(value)).join(", ")} — each
                story linking back to its source.
              </p>
            </section>

            <Rule className="my-6" />

            {stories.length === 0 ? (
              <p className="px-6 text-[14px] leading-relaxed text-muted-foreground">
                A quiet day for your causes — there are no stories on file just now.
              </p>
            ) : (
              <section className="space-y-6 px-6">
                {stories.map((story) => (
                  <NewsStoryCard key={story.id || story.url} story={story} />
                ))}
              </section>
            )}

            <Rule className="my-7" />

            <p className="px-6 text-[11.5px] leading-relaxed text-muted-foreground">
              Summaries are written by Pomi from the sources linked beside them.
              {compiled ? ` Compiled ${compiled}.` : ""} Pomi does not provide
              medical advice.
            </p>
          </>
        )}
      </div>

      <AlmTabs />
    </div>
  );
}