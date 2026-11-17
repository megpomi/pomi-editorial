// Shared request limiter for the app's public endpoints.
//
// Counts how many times one caller has used one action in a fixed time window.
// Callers are told apart by their account when signed in, otherwise by the
// connection address the platform forwards. Only the server reads or writes
// these counters (the RateLimit entity allows no client access).

// Who is asking: their account id when signed in, else their connection address.
export function callerIdentity(req, user) {
  if (user && user.id) return `user:${user.id}`;
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const address =
    forwarded.split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
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