// netlify/functions/translate.js
//
// Προωθεί το αίτημα μετάφρασης προς το ήδη-δουλεμένο Cloudflare Function
// (το ίδιο που κάνει το caching στο TRANSLATE_KV). Κάνει ο ίδιος το fetch(),
// όχι μέσω netlify.toml redirect, ώστε το POST να φτάνει σωστά.

const TARGET = 'https://innerlife1111.pages.dev/api/translate';

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

    const data = await resp.text();

    return {
      statusCode: resp.status,
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Σφάλμα διακομιστή' })
    };
  }
};
