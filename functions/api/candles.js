// functions/api/candles.js
// Cloudflare Pages Function — ΠΑΓΚΟΣΜΙΟΣ μετρητής κεριών.
// Χρειάζεται ένα KV namespace binding με το όνομα: CANDLES_KV
// (Cloudflare Dashboard → το Pages project σου → Settings → Functions → KV namespace bindings)

const ALLOWED_ORIGINS = [
  'https://innerlife1111.pages.dev',
  'https://innerlife1111.netlify.app'
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

// Προ-πτητικό αίτημα (preflight) του browser για cross-site κλήσεις
export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { headers: corsHeaders(origin) });
}

// GET /api/candles → επιστρέφει το τρέχον σύνολο
export async function onRequestGet(context) {
  const origin = context.request.headers.get('Origin') || '';
  try {
    const kv = context.env.CANDLES_KV;
    if (!kv) throw new Error('CANDLES_KV binding missing (context.env.CANDLES_KV is ' + typeof kv + ')');
    const current = parseInt((await kv.get('total')) || '0', 10);
    return new Response(JSON.stringify({ total: current }), { headers: corsHeaders(origin) });
  } catch (err) {
    // ΠΡΟΣΩΡΙΝΟ debug: δείχνουμε το ΠΡΑΓΜΑΤΙΚΟ σφάλμα για να το εντοπίσουμε
    return new Response(JSON.stringify({ error: String(err && err.message || err) }), {
      status: 500,
      headers: corsHeaders(origin)
    });
  }
}

// POST /api/candles → αυξάνει το σύνολο κατά 1 και το επιστρέφει
export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin') || '';
  try {
    const kv = context.env.CANDLES_KV;
    if (!kv) throw new Error('CANDLES_KV binding missing (context.env.CANDLES_KV is ' + typeof kv + ')');
    const current = parseInt((await kv.get('total')) || '0', 10);
    const next = current + 1;
    await kv.put('total', String(next));
    return new Response(JSON.stringify({ total: next }), { headers: corsHeaders(origin) });
  } catch (err) {
    // ΠΡΟΣΩΡΙΝΟ debug: δείχνουμε το ΠΡΑΓΜΑΤΙΚΟ σφάλμα για να το εντοπίσουμε
    return new Response(JSON.stringify({ error: String(err && err.message || err) }), {
      status: 500,
      headers: corsHeaders(origin)
    });
  }
}