// netlify/functions/tts.js
//
// Προωθεί το αίτημα φωνής (text-to-speech) προς το ήδη-δουλεμένο Cloudflare
// Function. Η απάντηση είναι ήχος (mp3), γι' αυτό χρειάζεται μετατροπή σε
// base64 (έτσι θέλει το Netlify τα binary δεδομένα).

const TARGET = 'https://innerlife1111.pages.dev/api/tts';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const resp = await fetch(TARGET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return {
        statusCode: resp.status,
        body: errText
      };
    }

    const arrayBuffer = await resp.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
      body: base64,
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Σφάλμα διακομιστή' })
    };
  }
};
