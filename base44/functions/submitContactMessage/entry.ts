import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

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