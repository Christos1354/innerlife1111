// functions/api/chat.js
//
// Αυτό το αρχείο τρέχει ΣΤΟΝ ΣΕΡΒΕΡ του Cloudflare, όχι στον browser του επισκέπτη.
// Το API key διαβάζεται από environment variable (env.ANTHROPIC_API_KEY),
// άρα δεν εμφανίζεται ΠΟΤΕ στον κώδικα ή στο "View Page Source".
//
// Το index.html θα καλεί πλέον: fetch('/api/chat', {...})
// αντί να καλεί απευθείας το api.anthropic.com

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { system, messages, max_tokens } = body;

    // Βασικός έλεγχος εισόδου
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Λείπουν μηνύματα' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
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
        max_tokens: Math.min(max_tokens || 500, 1000), // cap ασφαλείας
        system: system,
        messages: trimmedMessages
      })
    });

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Σφάλμα διακομιστή' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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
