// netlify/functions/chat.js
//
// Αυτό είναι το ισοδύναμο, για Netlify, του functions/api/chat.js που έχεις στο Cloudflare.
// Τρέχει ΣΤΟΝ ΣΕΡΒΕΡ, όχι στον browser. Το key διαβάζεται από environment variable
// (ANTHROPIC_API_KEY) που θα ορίσεις στο Netlify dashboard — δεν είναι ποτέ ορατό στον κώδικα.
//
// Χάρη στο netlify.toml (redirect rule), το index.html μπορεί να συνεχίσει να καλεί
// το ίδιο URL: fetch('/api/chat') — δεν χρειάζεται καμία αλλαγή στο index.html.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { system, messages, max_tokens } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Λείπουν μηνύματα' })
      };
    }

    // Ίδιο όριο ασφαλείας όπως στο Cloudflare function
    const MAX_MESSAGES = 20;
    const trimmedMessages = messages.slice(-MAX_MESSAGES);

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // <-- κρυφό, ζει μόνο στο Netlify
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: Math.min(max_tokens || 500, 1000),
        system: system,
        messages: trimmedMessages
      })
    });

    const data = await resp.json();

    return {
      statusCode: resp.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Σφάλμα διακομιστή' })
    };
  }
};
