// Serves the "In the News" edition that is on file. Editions are no longer
// regenerated: the news desk is paused, so every account reads the same stored
// edition and no AI credits are spent on a page visit.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth
      .me()
      .catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // One shared edition for the whole app, so it is read with the service role
    // rather than being limited to the reader's own records.
    const page = await base44.asServiceRole.entities.NewsDigest.filter(
      {},
      { sort: '-created_date', limit: 10 }
    );
    const editions = Array.isArray(page) ? page : page?.items || [];

    const withStories = editions.find(
      (edition) => Array.isArray(edition?.stories) && edition.stories.length
    );

    return Response.json({ digest: withStories || editions[0] || null });
  } catch (error) {
    console.error('newsDigest failed:', error?.message || error);
    return Response.json(
      { error: "We couldn't open the news page. Please try again shortly." },
      { status: 500 }
    );
  }
}