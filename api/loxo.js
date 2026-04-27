export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const DOMAIN = 'pod6.app.loxo.co';
  const SLUG = 'scene-1';
  const API_KEY = 'd8b8828b6120c2f3f3f9503b85a83db28ae62c16910710885463290fe0ce5386ccaacf9cd19bd9746459730ae7def151a6ec93cf23c458034dd86a7612539aec617bd0aca733869fad21c0336e07693d793db21352a90be0b37f990d816cdb24b865b9c3312ac63d5774ff9617f5b48e034bbedb5819c88c6a40523eee13d407';
  const USER_ID = '1895007';

  // Try multiple endpoints to find the right one
  const endpoint = req.query.endpoint || `candidates?owned_by_id=${USER_ID}&per_page=100`;

  try {
    const url = `https://${DOMAIN}/api/${SLUG}/${endpoint}`;
    console.log('Fetching:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      }
    });

    const text = await response.text();
    console.log('Status:', response.status, 'Preview:', text.substring(0, 300));

    if (!response.ok) {
      return res.status(response.status).json({ error: `${response.status}`, url, body: text });
    }

    return res.status(200).json(JSON.parse(text));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
