export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const DOMAIN = 'pod6.app.loxo.co';
  const SLUG = 'scene';
  const API_KEY = '81f8be364a9a6f67c722a45db87fcb268418abdd6bdc8d0394b8ed7ed0435c8cf978083c0fc00a4158417a791c1ffbc7aa436e420de9bcf97b50609dd1ae56334400bfd0d39b0c9b19a33be97abcd88e4b2cb14e46ddb77710578c3e20208521a8813bbb23645f05e1d40c95051af9e5899c55af4cbc8aeb7850649d573d5bdd';

  const endpoint = req.query.endpoint || 'people';

  try {
    const url = `https://${DOMAIN}/api/${SLUG}/${endpoint}`;
    console.log('Fetching:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response preview:', text.substring(0, 200));

    if (!response.ok) {
      return res.status(response.status).json({ error: `Loxo API error: ${response.status}`, body: text });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
