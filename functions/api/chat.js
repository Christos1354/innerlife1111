// functions/api/chat.js
//
// Αυτό το αρχείο τρέχει ΣΤΟΝ ΣΕΡΒΕΡ του Cloudflare, όχι στον browser του επισκέπτη.
// Το API key διαβάζεται από environment variable (env.ANTHROPIC_API_KEY),
// άρα δεν εμφανίζεται ΠΟΤΕ στον κώδικα ή στο "View Page Source".
//
// Το index.html θα καλεί πλέον: fetch('/api/chat', {...})
// αντί να καλεί απευθείας το api.anthropic.com

// 25-10-2026: CORS, ώστε να δουλεύει και από το Innerlife 4all (innerlife-4all.pages.dev)
const ALLOWED_ORIGINS = [
  'https://innerlife1111.pages.dev',
  'https://innerlife.netlify.app',
  'https://innerlife1111.netlify.app',
  'https://innerlife-4all.pages.dev'
];
function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { headers: corsHeaders(origin) });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '';

  try {
    const body = await request.json();
    const { system, messages, max_tokens } = body;

    // Βασικός έλεγχος εισόδου
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Λείπουν μηνύματα' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
      });
    }

    // Προαιρετικό αλλά συνιστώμενο: όριο μεγέθους για να μην κάνει κάποιος
    // κατάχρηση στέλνοντας τεράστια μηνύματα και "τρώγοντας" credits
    const MAX_MESSAGES = 20;
    const trimmedMessages = messages.slice(-MAX_MESSAGES);

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY, // <-- κρυφό, ζει μόνο στο Cloudflare
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        // Ανέβηκε από 1000 σε 4096, ώστε οι μεγάλες απαντήσεις να μην κόβονται στη μέση.
        // Το default (όταν δεν στέλνει τίποτα το index.html) ανέβηκε επίσης, από 500 σε 1500.
        max_tokens: Math.min(max_tokens || 1500, 4096),
        system: system,
        messages: trimmedMessages
      })
    });

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Σφάλμα διακομιστή' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }
}

// Απορρίπτουμε οποιαδήποτε άλλη μέθοδο (GET κτλ.) για ασφάλεια
export async function onRequestGet() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
