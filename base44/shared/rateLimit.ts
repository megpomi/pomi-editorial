// Shared request limiter for the app's public endpoints.
//
// Counts how many times one caller has used one action in a fixed time window.
// Callers are told apart by their account when signed in, otherwise by the
// connection address the platform forwards. Only the server reads or writes
// these counters (the RateLimit entity allows no client access).

// A bare address from a header value: drops a port, brackets and whitespace, so the
// same visitor keeps one identity even though every connection uses a new port.
function bareAddress(value) {
  if (!value) return '';
  const trimmed = String(value).trim().replace(/^\[|\]$/g, '');
  const withPort = trimmed.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  return withPort ? withPort[1] : trimmed;
}

// Who is asking: their account id when signed in, else their connection address.
// Only server-set values count. The FIRST entry of x-forwarded-for is whatever the
// client sent, so it is ignored: a caller could otherwise rotate it and get a fresh
// allowance on every request. Prefer the CDN/edge address, then the address the last
// proxy appended, and never a value the caller chose.
export function callerIdentity(req, user) {
  if (user && user.id) return `user:${user.id}`;

  const forwarded = (req.headers.get('x-forwarded-for') || '')
    .split(',')
    .map(bareAddress)
    .filter(Boolean);

  const address =
    bareAddress(req.headers.get('cf-connecting-ip')) ||
    bareAddress(req.headers.get('x-real-ip')) ||
    forwarded[forwarded.length - 1] ||
    'unknown';

  return `ip:${address}`;
}

// Counts one use and reports whether the caller is still within their allowance.
// If the counter store is unavailable we allow the request: a limiter outage must
// not block real visitors.
export async function withinLimit(base44, { kind, identity, limit, windowMinutes }) {
  const windowMs = windowMinutes * 60 * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${kind}:${identity}:${bucket}`;
  const db = base44.asServiceRole;

  try {
    const matches = await db.entities.RateLimit.filter({ key });
    const record = matches && matches[0];

    if (!record) {
      await db.entities.RateLimit.create({
        key,
        kind,
        count: 1,
        window_start: new Date(bucket * windowMs).toISOString(),
      });
      return { allowed: true };
    }

    const count = record.count || 0;
    if (count >= limit) return { allowed: false };

    await db.entities.RateLimit.update(record.id, { count: count + 1 });
    return { allowed: true };
  } catch (error) {
    console.warn('rate limiter unavailable, allowing request', error?.message || error);
    return { allowed: true };
  }
}