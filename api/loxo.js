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

  const STAGES = [
    { id: '4115', name: 'Shortlist' },
    { id: '4117', name: 'CV Sent' },
    { id: '4118', name: '1st Interview' },
    { id: '4119', name: '2nd Interview' },
    { id: '5512', name: '3rd Interview' },
    { id: '5514', name: 'Final Interview' },
    { id: '5515', name: 'Offer' },
  ];

  try {
    const allCandidates = [];

    for (const stage of STAGES) {
      const url = `https://${DOMAIN}/api/${SLUG}/people?query=owned_by_id:${USER_ID}&active_workflow_stage_id=${stage.id}&per_page=100`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const people = data.people || data.data || [];
        console.log(`Stage ${stage.name}: ${people.length} people`);
        people.forEach(p => {
          allCandidates.push({ ...p, workflow_stage: stage.name, workflow_stage_id: stage.id });
        });
      }
    }

    return res.status(200).json({ people: allCandidates, total: allCandidates.length });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
