// functions/api/translate.js
//
// Cloudflare Pages Function — λειτουργεί σαν "ενδιάμεσος" (proxy) ανάμεσα
// στον επισκέπτη του site και τη Google Translate.
//
// ΓΙΑΤΙ ΧΡΕΙΑΖΕΤΑΙ: όταν ο browser του επισκέπτη προσπαθεί να καλέσει
// απευθείας το translate.googleapis.com, το μπλοκάρει το CORS policy του
// browser (θέμα ασφάλειας — καμία σχέση με εμάς, ισχύει για όλα τα sites).
// Όταν όμως το ΔΙΚΟ ΜΑΣ site (μέσω αυτής της Function, που τρέχει σε
// server, όχι σε browser) κάνει την ίδια κλήση, το CORS δεν ισχύει καθόλου.
//
// ΔΟΚΙΜΗ: επισκέψου απευθείας στον browser:
//   https://innerlife1111.pages.dev/api/translate?sl=el&tl=en&q=Καλημέρα
// για να δεις ακριβώς τι απαντάει, χωρίς dev tools.

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const sl = url.searchParams.get('sl') || 'el';
  const tl = url.searchParams.get('tl') || 'en';
  const qParams = url.searchParams.getAll('q');
  const debug = url.searchParams.has('debug');

  if (!qParams.length) {
    return new Response(
      JSON.stringify({ error: 'Λείπει η παράμετρος q (το κείμενο προς μετάφραση)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const googleUrl = new URL('https://translate.googleapis.com/translate_a/single');
  googleUrl.searchParams.set('client', 'gtx');
  googleUrl.searchParams.set('sl', sl);
  googleUrl.searchParams.set('tl', tl);
  googleUrl.searchParams.set('dt', 't');
  qParams.forEach(q => googleUrl.searchParams.append('q', q));

  try {
    const upstream = await fetch(googleUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'el-GR,el;q=0.9,en;q=0.8',
        'Referer': 'https://translate.google.com/'
      }
    });

    const bodyText = await upstream.text();

    if (!upstream.ok) {
      // Σε λειτουργία debug (?debug στο τέλος του URL), δείχνουμε ΑΚΡΙΒΩΣ τι
      // απάντησε η Google, ώστε να καταλάβουμε τι ακριβώς φταίει.
      return new Response(
        JSON.stringify({
          error: 'Η Google επέστρεψε σφάλμα',
          status: upstream.status,
          statusText: upstream.statusText,
          googleResponseBody: debug ? bodyText.slice(0, 1000) : undefined
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(bodyText, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Αποτυχία σύνδεσης με τη Google', details: String(e && e.message ? e.message : e) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
