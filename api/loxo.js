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

  try {
    const url = `https://${DOMAIN}/api/${SLUG}/people?per_page=3`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();
    const people = data.people || data.data || data || [];
    
    // Return just the ownership and stage fields so we can see what's there
    const debug = people.map(p => ({
      id: p.id,
      name: p.name,
      owned_by_id: p.owned_by_id,
      created_by_id: p.created_by_id,
      updated_by_id: p.updated_by_id,
      workflow_stage: p.workflow_stage,
      workflow_stage_id: p.workflow_stage_id,
    }));

    return res.status(200).json(debug);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
