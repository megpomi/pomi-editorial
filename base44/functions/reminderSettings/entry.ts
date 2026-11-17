import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Called by the daily reminder workflow before the email goes out: reports
// whether the app owner still wants reminder emails, and who to send them to.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const firstName = (user.full_name || '').trim().split(' ')[0] || 'there';

    return Response.json({
      enabled: user.notify_email !== false,
      email: user.email,
      first_name: firstName,
    });
  } catch (error) {
    console.error('reminderSettings failed', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}