import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Intake form handler. Writes to public.intake_submissions (anon INSERT allowed
 * by RLS) and fires a best-effort notification webhook.
 */
export async function POST(request: Request) {
  let payload: Record<string, string>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 });
  }

  const row = {
    name,
    email,
    company: payload.company || null,
    whatsapp: payload.whatsapp || null,
    service_type: payload.serviceType || null,
    target_platform: payload.targetPlatform || null,
    budget_band: payload.budget || null,
    timeline: payload.timeline || null,
    content_language: payload.language || null,
    asset_path: payload.assetPath || null,
    message: payload.message || null
  };

  // Guard: if Supabase isn't configured yet, don't 500 — accept and log.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('[intake] Supabase not configured; submission not persisted:', row.email);
  } else {
    const supabase = createClient();
    const { error } = await supabase.from('intake_submissions').insert(row);
    if (error) {
      console.error('[intake] insert failed:', error.message);
      return NextResponse.json({ error: 'Could not save submission' }, { status: 500 });
    }
  }

  // Best-effort notification (Slack/Resend/webhook). Never blocks the response.
  const hook = process.env.NOTIFY_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: `New lead: ${name} (${email}) · ${row.company ?? '—'} · ${row.service_type ?? '—'}`
        })
      });
    } catch (e) {
      console.error('[intake] notify failed:', e);
    }
  }

  return NextResponse.json({ ok: true });
}
