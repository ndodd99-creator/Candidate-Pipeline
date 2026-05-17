export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const DOMAIN = 'pod6.app.loxo.co';
  const SLUG = 'scene-1';
  const API_KEY = 'd8b8828b6120c2f3f3f9503b85a83db28ae62c16910710885463290fe0ce5386ccaacf9cd19bd9746459730ae7def151a6ec93cf23c458034dd86a7612539aec617bd0aca733869fad21c0336e07693d793db21352a90be0b37f990d816cdb24b865b9c3312ac63d5774ff9617f5b48e034bbedb5819c88c6a40523eee13d407';
  const USER_ID = '1895007';

  const STAGE_IDS = ['4115','4117','4118','4119','5512','5514','5515'];

  try {
    // Step 1: Get your jobs
    const jobsRes = await fetch(`https://${DOMAIN}/api/${SLUG}/jobs?owned_by_id=${USER_ID}&per_page=100`, {
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
    });

    if (!jobsRes.ok) {
      const t = await jobsRes.text();
      return res.status(jobsRes.status).json({ error: 'Jobs failed', status: jobsRes.status, body: t });
    }

    const jobsData = await jobsRes.json();
    const jobs = jobsData.jobs || jobsData.data || jobsData || [];

    // Step 2: For each job get candidates - limit to 30 jobs to avoid timeout
    const allCandidates = [];
    for (const job of jobs.slice(0, 30)) {
      try {
        const cRes = await fetch(`https://${DOMAIN}/api/${SLUG}/jobs/${job.id}/candidates?per_page=100`, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        if (cRes.ok) {
          const cData = await cRes.json();
          const cands = cData.candidates || cData.data || [];
          cands.forEach(c => {
            // Only include active pipeline stages
            if (STAGE_IDS.includes(String(c.workflow_stage_id))) {
              allCandidates.push({
                ...c,
                job_title_role: job.title || job.name || '',
                job_company: job.company_name || '',
              });
            }
          });
        }
      } catch(e) { /* skip failed jobs */ }
    }

    return res.status(200).json({ people: allCandidates, total: allCandidates.length, jobs_checked: jobs.length });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
