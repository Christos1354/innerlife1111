// functions/api/translate.js
//
// Cloudflare Pages Function — λειτουργεί σαν "ενδιάμεσος" (proxy) ανάμεσα
// στον επισκέπτη του site και τη Google Translate.
//
// ΓΙΑΤΙ ΧΡΕΙΑΖΕΤΑΙ: όταν ο browser του επισκέπτη προσπαθεί να καλέσει
// απευθείας το translate.googleapis.com, το μπλοκάρει το CORS policy του
// browser (θέμα ασφάλειας — καμία σχέση με εμάς, ισχύει για όλα τα sites).
// Όταν όμως το ΔΙΚΟ ΜΑΣ site (μέσω αυτής της Function, που τρέχει σε
// server, όχι σε browser) κάνει την ίδια κλήση, το CORS δεν ισχύει καθόλου
// — οι server-to-server κλήσεις δεν έχουν αυτόν τον περιορισμό.
//
// Ο browser του επισκέπτη λοιπόν μιλάει ΜΟΝΟ με το innerlife1111.pages.dev
// (ίδιο domain, κανένα πρόβλημα), και το site μας μιλάει με τη Google.
//
// ΤΟΠΟΘΕΤΗΣΗ: αυτό το αρχείο πρέπει να μπει στον φάκελο
//   functions/api/translate.js
// μέσα στο repository σου (δίπλα στο ήδη υπάρχον functions/api/candles.js
// ή όπου κι αν βρίσκεται εκείνο) — το Cloudflare Pages το αναγνωρίζει
// αυτόματα και δημιουργεί το endpoint /api/translate χωρίς άλλη ρύθμιση.

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const sl = url.searchParams.get('sl') || 'el';
  const tl = url.searchParams.get('tl') || 'en';
  const qParams = url.searchParams.getAll('q');

  if (!qParams.length) {
    return new Response(
      JSON.stringify({ error: 'Λείπει η παράμετρος q (το κείμενο προς μετάφραση)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Χτίζουμε το ίδιο URL που χρησιμοποιούσαμε πριν απευθείας από τον browser,
  // αλλά τώρα η κλήση γίνεται από εδώ (server-side στο Cloudflare) -- χωρίς CORS.
  const googleUrl = new URL('https://translate.googleapis.com/translate_a/single');
  googleUrl.searchParams.set('client', 'gtx');
  googleUrl.searchParams.set('sl', sl);
  googleUrl.searchParams.set('tl', tl);
  googleUrl.searchParams.set('dt', 't');
  qParams.forEach(q => googleUrl.searchParams.append('q', q));

  try {
    const upstream = await fetch(googleUrl.toString(), {
      headers: {
        // Μερικές φορές η Google θέλει να μοιάζει η κλήση με πραγματικό browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
      }
    });

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: 'Η Google επέστρεψε σφάλμα', status: upstream.status }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await upstream.text();
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Επιτρέπουμε στο ίδιο μας το site να το ξαναχρησιμοποιήσει από cache
        // για λίγη ώρα, ώστε να μη ρωτάμε τη Google το ίδιο ξανά και ξανά.
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Αποτυχία σύνδεσης με τη Google', details: String(e) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
