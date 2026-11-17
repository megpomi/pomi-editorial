import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { callerIdentity, withinLimit } from '../../shared/rateLimit.ts';

// Public contact form: anyone (including visitors without an account) can send a
// message. Messages are stored admin-only; only the shape is validated here.
const LIMITS = { name: 80, email: 160, message: 2000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function (req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const message = String(body?.message ?? '').trim();

    if (!name || !email || !message) {
      return Response.json(
        { error: 'Please add your name, email and a message.' },
        { status: 400 }
      );
    }
    if (!EMAIL_PATTERN.test(email)) {
      return Response.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    if (
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      message.length > LIMITS.message
    ) {
      return Response.json(
        { error: 'That message is a little too long. Please shorten it.' },
        { status: 400 }
      );
    }

    // A handful of messages per visitor per hour: enough for a real question,
    // nowhere near enough to fill the inbox with a script.
    const { allowed } = await withinLimit(base44, {
      kind: 'contact',
      identity: callerIdentity(req, null),
      limit: 5,
      windowMinutes: 60,
    });
    if (!allowed) {
      return Response.json(
        { error: 'You have already sent us a few messages. Please try again in an hour.' },
        { status: 429 }
      );
    }

    await base44.asServiceRole.entities.ContactMessage.create({
      name,
      email,
      message,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('submitContactMessage failed', error);
    return Response.json(
      { error: 'Something went wrong sending your message.' },
      { status: 500 }
    );
  }
}