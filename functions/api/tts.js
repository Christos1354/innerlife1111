// functions/api/tts.js
//
// Server-side function (Cloudflare) - κρύβει το ELEVENLABS_API_KEY.
// Το index.html καλεί fetch('/api/tts', {text, lang}) και παίρνει πίσω ήχο (mp3).
//
// ΠΡΟΣΤΕΘΗΚΕ: CORS headers, ώστε να δουλεύει και cross-site (από Netlify).

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

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { headers: corsHeaders(origin) });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '';

  try {
    const { text, lang } = await request.json();

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Λείπει κείμενο' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
      });
    }

    const safeText = text.trim().slice(0, 2000);
    const voiceId = env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // default: "Rachel"

    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: safeText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: 'ElevenLabs error', detail: errText }), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
      });
    }

    const audioBuffer = await resp.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg', ...corsHeaders(origin) }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Σφάλμα διακομιστή' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
