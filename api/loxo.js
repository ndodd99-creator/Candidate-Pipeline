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
  const USER_ID = 1895007;

  try {
    // Fetch multiple pages to get all people
    let allPeople = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 10) {
      const url = `https://${DOMAIN}/api/${SLUG}/people?per_page=100&page=${page}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) break;

      const data = await response.json();
      const people = data.people || data.data || [];
      allPeople = allPeople.concat(people);

      if (people.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Filter to only Nathanial's candidates with an active pipeline stage
    const STAGE_IDS = ['4115','4117','4118','4119','5512','5514','5515'];
    const myCandidates = allPeople.filter(p =>
      (String(p.owned_by_id) === String(USER_ID) || String(p.updated_by_id) === String(USER_ID) || String(p.created_by_id) === String(USER_ID)) &&
      p.workflow_stage_id &&
      STAGE_IDS.includes(String(p.workflow_stage_id))
    );

    return res.status(200).json({ people: myCandidates, total: myCandidates.length });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
