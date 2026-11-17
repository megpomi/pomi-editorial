import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Erases the signed-in user's saved wellbeing data. Every query is pinned to the
// caller's own id and runs with the caller's own token, so row-level security
// applies and no other account's records can ever be reached.
export default async function (req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth
      .me()
      .catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const owner = { created_by_id: user.id };

    const results = await Promise.allSettled([
      base44.entities.DailyLog.deleteMany(owner),
      base44.entities.CycleLog.deleteMany(owner),
      base44.entities.CustomSymptom.deleteMany(owner),
      base44.entities.CustomLifestyle.deleteMany(owner),
    ]);

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length) {
      console.error(
        'deleteMyAccount: some records could not be removed',
        failures.map((r) => r.reason?.message || String(r.reason))
      );
      return Response.json(
        { error: 'Some of your data could not be deleted. Please try again.' },
        { status: 500 }
      );
    }

    const deleted = results.reduce(
      (sum, r) => sum + (r.status === 'fulfilled' ? r.value?.deleted ?? 0 : 0),
      0
    );

    return Response.json({ ok: true, records_deleted: deleted });
  } catch (error) {
    console.error('deleteMyAccount failed', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}