/*
  /api/translate — μεταφράζει κείμενα από Ελληνικά σε όποια γλώσσα ζητηθεί,
  μέσω του επίσημου, πληρωμένου Google Cloud Translation API (κλειδί κρυμμένο
  στο περιβάλλον, ΠΟΤΕ ορατό στον browser).

  Πριν καλέσουμε το Google για οποιοδήποτε κείμενο, ελέγχουμε πρώτα το
  Cloudflare KV (TRANSLATE_KV) — μια μόνιμη, ΚΟΙΝΗ cache για όλους τους
  επισκέπτες. Αν κάποιος άλλος επισκέπτης έχει ήδη ζητήσει την ίδια μετάφραση
  στο παρελθόν, την παίρνουμε αμέσως από εκεί, χωρίς να ξαναπληρώσουμε/
  ξαναρωτήσουμε το Google. Έτσι κάθε κείμενο μεταφράζεται ΜΙΑ φορά συνολικά,
  ποτέ ξανά.

  Είσοδος (POST, JSON): { texts: string[], targetLang: string }
  Έξοδος (JSON): { translations: string[] }  — ίδιο μήκος/σειρά με texts.
  Ποτέ δεν επιστρέφει σφάλμα σαν μετάφραση· αν κάτι αποτύχει, επιστρέφει το
  πρωτότυπο κείμενο αμετάφραστο για εκείνη τη θέση, ώστε η σελίδα να μη
  δείχνει ποτέ σκουπίδι/κενό.

  ΠΡΟΣΤΕΘΗΚΕ: CORS headers, ώστε να δουλεύει και όταν καλείται απευθείας
  (cross-site) από το Netlify site — πριν δούλευε μόνο ίδιο-site (Cloudflare).
*/

const SOURCE_LANG = 'el';
const GOOGLE_URL = 'https://translation.googleapis.com/language/translate/v2';

const MAX_TEXTS_PER_CALL = 100;
const MAX_CHARS_PER_CALL = 20000;

const ALLOWED_ORIGINS = [
  'https://innerlife1111.pages.dev',
  'https://innerlife.netlify.app',
  'https://innerlife1111.netlify.app'
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

// Προ-πτητικό αίτημα (preflight) του browser για cross-site κλήσεις
export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { headers: corsHeaders(origin) });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '';

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'invalid JSON body' }, 400, origin);
  }

  const texts = Array.isArray(body.texts) ? body.texts.map((t) => (typeof t === 'string' ? t : '')) : null;
  const targetLang = typeof body.targetLang === 'string' ? body.targetLang.trim().toLowerCase() : '';

  if (!texts || !texts.length || !targetLang) {
    return jsonResponse({ error: 'texts (array) and targetLang (string) are required' }, 400, origin);
  }
  if (texts.length > 500) {
    return jsonResponse({ error: 'too many texts in one request (max 500)' }, 400, origin);
  }
  if (targetLang === SOURCE_LANG) {
    return jsonResponse({ translations: texts }, 200, origin);
  }

  const apiKey = env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.error('[translate] Λείπει το GOOGLE_TRANSLATE_API_KEY από το περιβάλλον');
    return jsonResponse({ translations: texts.slice() }, 200, origin);
  }
  const kv = env.TRANSLATE_KV;

  const results = new Array(texts.length);
  const cacheKeys = new Array(texts.length);
  const missing = [];

  await Promise.all(
    texts.map(async (t, i) => {
      if (!t || !t.trim()) {
        results[i] = t;
        return;
      }
      const key = await cacheKey(targetLang, t);
      cacheKeys[i] = key;
      if (kv) {
        try {
          const cached = await kv.get(key);
          if (cached !== null) {
            results[i] = cached;
            return;
          }
        } catch (e) {
          console.warn('[translate] KV get απέτυχε:', e && e.message);
        }
      }
      missing.push(i);
    })
  );

  const kvWrites = [];
  let batchStart = 0;
  while (batchStart < missing.length) {
    let charCount = 0;
    let batchEnd = batchStart;
    while (
      batchEnd < missing.length &&
      batchEnd - batchStart < MAX_TEXTS_PER_CALL &&
      (batchEnd === batchStart || charCount + texts[missing[batchEnd]].length <= MAX_CHARS_PER_CALL)
    ) {
      charCount += texts[missing[batchEnd]].length;
      batchEnd++;
    }
    const batchIdx = missing.slice(batchStart, batchEnd);
    const batchTexts = batchIdx.map((i) => texts[i]);

    try {
      const translated = await callGoogleTranslate(batchTexts, targetLang, apiKey);
      batchIdx.forEach((idx, j) => {
        const val = translated[j] && translated[j].trim() ? translated[j] : texts[idx];
        results[idx] = val;
        if (kv && val !== texts[idx]) {
          kvWrites.push(kv.put(cacheKeys[idx], val));
        }
      });
    } catch (e) {
      console.warn('[translate] Google Translate αποτυχία για ομάδα:', e && e.message);
      batchIdx.forEach((idx) => {
        results[idx] = texts[idx];
      });
    }

    batchStart = batchEnd;
  }

  if (kvWrites.length) {
    context.waitUntil(Promise.all(kvWrites).catch(() => {}));
  }

  return jsonResponse({ translations: results }, 200, origin);
}

async function callGoogleTranslate(texts, target, apiKey) {
  const resp = await fetch(GOOGLE_URL + '?key=' + encodeURIComponent(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: texts,
      source: SOURCE_LANG,
      target: target,
      format: 'text',
    }),
  });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error('Google Translate HTTP ' + resp.status + ' ' + errText.slice(0, 200));
  }
  const data = await resp.json();
  const translations = data && data.data && data.data.translations;
  if (!Array.isArray(translations) || translations.length !== texts.length) {
    throw new Error('unexpected Google Translate response shape');
  }
  return translations.map((t) => t.translatedText || '');
}

async function cacheKey(lang, text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
  return 'tr:' + lang + ':' + hex;
}

function jsonResponse(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin)
    },
  });
}
