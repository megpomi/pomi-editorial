import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const isoDay = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

// Roughly a 10 MB image once decoded — keeps the request body bounded.
const MAX_BASE64_LENGTH = 14 * 1024 * 1024;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const imageBase64 =
      typeof body.image_base64 === 'string' ? body.image_base64.trim() : '';
    const mimeType =
      typeof body.mime_type === 'string' ? body.mime_type.trim().toLowerCase() : '';

    if (!imageBase64) {
      return Response.json({ error: 'Missing screenshot' }, { status: 400 });
    }
    if (imageBase64.length > MAX_BASE64_LENGTH) {
      return Response.json({ error: 'That screenshot is too large' }, { status: 413 });
    }
    if (mimeType && !EXTENSIONS[mimeType]) {
      return Response.json({ error: 'Please upload an image file' }, { status: 400 });
    }

    let bytes;
    try {
      bytes = Uint8Array.from(atob(imageBase64), (char) => char.charCodeAt(0));
    } catch {
      return Response.json({ error: 'Could not read that screenshot' }, { status: 400 });
    }

    // The upload happens here, from the bytes this caller just sent, so the file
    // we sign is always the caller's own — no caller-supplied file URI is trusted.
    const upload = await base44.asServiceRole.integrations.Core.UploadPrivateFile({
      file: new File([bytes], `screenshot.${EXTENSIONS[mimeType] || 'png'}`, {
        type: mimeType || 'image/png',
      }),
    });
    const fileUri = upload?.file_uri;
    if (!fileUri) {
      return Response.json({ error: 'Could not read that screenshot' }, { status: 500 });
    }

    const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri: fileUri,
      expires_in: 600,
    });
    const signedUrl = signed?.signed_url;
    if (!signedUrl) {
      return Response.json({ error: 'Could not open that screenshot' }, { status: 400 });
    }

    const today = new Date();
    const earliest = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    const todayIso = isoDay(today);
    const earliestIso = isoDay(earliest);

    const prompt = `You are reading a screenshot of a period-tracking app's calendar (for example Clue, Flo, Apple Health, Fitbit, Garmin, Natural Cycles or a similar app) that a user uploaded so their history can be copied across.

Today's date is ${todayIso}. The user only tracks the last 12 months, so the only dates that matter are between ${earliestIso} and ${todayIso}.

Task: list every calendar day that the screenshot marks as a menstrual / period (bleeding) day, and return them as ISO dates in YYYY-MM-DD form.

Rules:
- Include only days the app clearly marks as period or bleeding days.
- Exclude ovulation days, fertile-window days, predicted or forecast days (usually shown faded, dashed, outlined or lighter), and any symptom, mood or note markers.
- Read the month and year labels shown in the screenshot. If the year is not visible, choose the year that puts the date closest to today without going into the future.
- Return only dates between ${earliestIso} and ${todayIso}.
- Return an empty list if no period days can be identified.

Return JSON with a single key "days": an array of YYYY-MM-DD strings sorted from oldest to newest.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [signedUrl],
      response_json_schema: {
        type: 'object',
        properties: {
          days: { type: 'array', items: { type: 'string' } },
        },
        required: ['days'],
      },
    });

    const raw = Array.isArray(result?.days) ? result.days : [];
    const days = [
      ...new Set(
        raw.filter((value) => {
          if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return false;
          const date = new Date(`${value.trim()}T00:00:00`);
          if (Number.isNaN(date.getTime())) return false;
          return date >= earliest && date <= today;
        }).map((value) => value.trim())
      ),
    ].sort();

    return Response.json({ days });
  } catch (error) {
    console.error('importCycleScreenshot failed:', error?.message || error);
    return Response.json({ error: 'Could not read that screenshot' }, { status: 500 });
  }
}