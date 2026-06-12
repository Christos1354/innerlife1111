/* ════════════════════════════════════════════════════════════
   innerlife1111 — Anthropic API Proxy Worker
   Βάλε το API key σου στο Cloudflare:
   Workers → το Worker σου → Settings → Variables → Add variable
   Name:  ANTHROPIC_KEY
   Value: sk-ant-api03-...
   ════════════════════════════════════════════════════════════ */

export default {
  async fetch(request, env) {

    /* ── CORS: επιτρέπω μόνο το δικό σου site ── */
    const ALLOWED_ORIGIN = 'https://innerlife1111.pages.dev';

    const origin = request.headers.get('Origin') || '';
    const isAllowed = origin === ALLOWED_ORIGIN || origin === '';

    /* Preflight OPTIONS */
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    /* Μόνο POST επιτρέπεται */
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    /* Έλεγχος origin */
    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    /* Διάβασε το body που έστειλε το site */
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    /* Κλήση στο Anthropic API με το key από τα env Variables */
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await anthropicResp.json();

    /* Επιστροφή στο site με CORS headers */
    return new Response(JSON.stringify(data), {
      status: anthropicResp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      },
    });
  },
};