// Builds the reader's daily "In the News" digest: recent coverage of the causes
// they chose, found by web search and summarised. One digest per account per day
// per set of causes, so a page visit reuses the day's edition.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { callerIdentity, withinLimit } from '../../shared/rateLimit.ts';

const isoDay = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

// What each cause covers, so the search looks in the right places.
const CAUSE_BRIEFS = {
  period_poverty:
    'period poverty and menstrual equity: access to menstrual products, free products in schools and public buildings, menstrual health education, legislation ending period poverty or taxing period products',
  fertility:
    'fertility and infertility medicine: IVF and assisted reproduction research, fertility treatment funding and access, miscarriage research, pregnancy loss support, fertility policy',
  cancer:
    'ovarian and cervical cancer: screening and HPV vaccination programmes, new detection tests, clinical trials and treatments, survival and diagnosis statistics, gynaecological cancer research funding',
  endometriosis:
    'endometriosis: research into causes and non-invasive diagnosis, new treatments and pain management, diagnosis delays, clinical guidance and funding',
  pmos:
    'PMOS / PCOS (polycystic ovary syndrome): hormonal and metabolic research, diagnosis and clinical guidance, treatments, long-term health risks, patient support and funding',
  trans_aid:
    'trans rights and trans wellbeing: access to gender-affirming healthcare, legal recognition and identity documents, anti-discrimination policy, safety and mental health, community support funding',
  violence_survivors:
    'sexual and domestic violence: survivor support services and refuge funding, helpline provision, legal reform, prevention programmes, reporting and conviction data, research on abuse',
};

const MAX_STORIES = 10;

const clean = (value, max) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

// Only real article links are kept: an http(s) address pointing at a page.
const isArticleUrl = (value) => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    const path = url.pathname.replace(/\/+$/, '');
    return path.length > 1;
  } catch {
    return false;
  }
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth
      .me()
      .catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const chosen = Array.isArray(user.charity_interests) ? user.charity_interests : [];
    const causes = [
      ...new Set(chosen.filter((value) => typeof value === 'string' && CAUSE_BRIEFS[value])),
    ].sort();

    if (!causes.length) {
      return Response.json({ digest: null, stories: [], causes: [] });
    }

    const today = isoDay(new Date());
    const cacheKey = `${today}|${causes.join(',')}`;

    // Today's edition for this set of causes is already written.
    const cached = await base44.entities.NewsDigest.filter(
      { cache_key: cacheKey },
      { sort: '-created_date', limit: 1 }
    );
    const cachedItems = Array.isArray(cached) ? cached : cached?.items || [];
    if (cachedItems.length) {
      return Response.json({ digest: cachedItems[0] });
    }

    // Each edition spends AI credits, so cap how many one account can request a day.
    const { allowed } = await withinLimit(base44, {
      kind: 'news-digest',
      identity: callerIdentity(req, user),
      limit: 8,
      windowMinutes: 24 * 60,
    });
    if (!allowed) {
      return Response.json(
        {
          error:
            "You've requested a lot of editions today. Tomorrow's edition will be ready for you then.",
        },
        { status: 429 }
      );
    }

    const causeLines = causes.map((value) => `- ${value}: ${CAUSE_BRIEFS[value]}`).join('\n');

    const prompt = `You are the news desk for Pomi, a women's health app. Today is ${today}.

The reader has chosen to support these charitable causes:
${causeLines}

Compile today's digest: news about these causes, published within the last 21 days. Aim for ${MAX_STORIES} items, spread across the causes, and give every cause at least one item where real coverage exists. For each cause look for, in this order of interest:
1. Scientific or medical milestones: studies, trial results, regulatory approvals, clinical guidance, research funding, new diagnostics or treatments.
2. General mentions in the news: policy and legal changes, government or charity reports, campaigns, notable statistics, court rulings, major funding appeals.

Rules:
- Search the web. Report only stories you verified on a real page you actually retrieved in this search.
- Never invent a headline, publication, date or link. If you cannot find a genuine recent story for a cause, leave that cause out.
- Link the direct article URL, never a search page, home page or social post.
- Prefer established outlets, peer-reviewed journals, health bodies or the charities themselves.
- Each summary is two calm, factual sentences for a lay reader, explaining what happened and why it matters. No advice, no diagnosis, no hype, no speculation.
- Skip celebrity coverage, advertising, product launches, and anything not genuinely about the cause.

Return JSON: "stories", an array of at most ${MAX_STORIES} objects, freshest first, each with:
- title: the headline, plain text
- summary: two sentences
- source: the publication or organisation name
- url: the direct article link
- cause: one of these exact values - ${causes.join(', ')}
- published_date: YYYY-MM-DD when the story was published`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_8_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          stories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                summary: { type: 'string' },
                source: { type: 'string' },
                url: { type: 'string' },
                cause: { type: 'string' },
                published_date: { type: 'string' },
              },
              required: ['title', 'summary', 'url', 'cause'],
            },
          },
        },
        required: ['stories'],
      },
    });

    const raw = Array.isArray(result?.stories) ? result.stories : [];
    const seen = new Set();
    const stories = raw
      .filter((story) => story && typeof story === 'object')
      .map((story) => ({
        title: clean(story.title, 200),
        summary: clean(story.summary, 600),
        source: clean(story.source, 120),
        url: typeof story.url === 'string' ? story.url.trim() : '',
        cause: clean(story.cause, 40),
        published_date: /^\d{4}-\d{2}-\d{2}$/.test(clean(story.published_date, 10))
          ? clean(story.published_date, 10)
          : '',
      }))
      .filter((story) => {
        if (!story.title || !story.summary || !causes.includes(story.cause)) return false;
        if (!isArticleUrl(story.url)) return false;
        const key = story.url.replace(/\/+$/, '').toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_STORIES);

    const digest = await base44.entities.NewsDigest.create({
      cache_key: cacheKey,
      digest_date: today,
      causes,
      stories,
    });

    return Response.json({ digest });
  } catch (error) {
    console.error('newsDigest failed:', error?.message || error);
    return Response.json(
      { error: "We couldn't put today's edition together. Please try again shortly." },
      { status: 500 }
    );
  }
}