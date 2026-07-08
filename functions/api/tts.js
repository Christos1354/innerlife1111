// functions/api/tts.js
//
// Server-side function (Cloudflare) - κρύβει το ELEVENLABS_API_KEY.
// Το index.html καλεί fetch('/api/tts', {text, lang}) και παίρνει πίσω ήχο (mp3).

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { text, lang } = await request.json();

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Λείπει κείμενο' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Όριο ασφαλείας μεγέθους ανά κλήση (προστασία κόστους)
    const safeText = text.trim().slice(0, 2000);

    // Το voice ID μπορείς να το αλλάξεις χωρίς να αγγίξεις κώδικα:
    // βάλε ELEVENLABS_VOICE_ID ως environment variable στο Cloudflare.
    const voiceId = env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // default: "Rachel"

    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': env.ELEVENLABS_API_KEY // <-- κρυφό, ζει μόνο στο Cloudflare
      },
      body: JSON.stringify({
        text: safeText,
        model_id: 'eleven_multilingual_v2', // υποστηρίζει Ελληνικά + 130+ γλώσσες
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
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const audioBuffer = await resp.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Σφάλμα διακομιστή' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
