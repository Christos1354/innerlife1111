// netlify/functions/tts.js
//
// Server-side function (Netlify) - κρύβει το ELEVENLABS_API_KEY.
// Χάρη στο netlify.toml redirect, το index.html καλεί το ίδιο /api/tts.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { text } = JSON.parse(event.body);

    if (!text || !text.trim()) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Λείπει κείμενο' }) };
    }

    const safeText = text.trim().slice(0, 2000);
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // default: "Rachel"

    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
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
      return { statusCode: resp.status, body: JSON.stringify({ error: 'ElevenLabs error', detail: errText }) };
    }

    const audioBuffer = await resp.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
      body: base64Audio,
      isBase64Encoded: true
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Σφάλμα διακομιστή' }) };
  }
};
