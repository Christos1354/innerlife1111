// netlify/functions/candles.js
//
// Προωθεί το αίτημα (GET ή POST) προς το ήδη-δουλεμένο Cloudflare Function,
// κάνοντας ο ίδιος το fetch() (όχι μέσω netlify.toml redirect — εκεί τα POST
// αιτήματα προς εξωτερικό URL μπορεί να "χαθούν" ή να γίνουν GET).
// Έτσι υπάρχει ΕΝΑΣ μόνο πραγματικός μετρητής κεριών, κοινός και για τα δύο site.

const TARGET = 'https://innerlife1111.pages.dev/api/candles';

exports.handler = async function (event) {
  try {
    const resp = await fetch(TARGET, {
      method: event.httpMethod,
      headers: { 'Content-Type': 'application/json' },
      body: event.httpMethod === 'POST' ? event.body : undefined
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
