import { fetchJobs } from './fetcher.js';
import { saveJobs } from './db.js';

const QUERIES = [
  'Node.js backend developer',
  'Senior Node.js engineer',
  'Backend engineer Node.js AI',
];

export async function runFetch() {
  const allJobs = [];

  for (const query of QUERIES) {
    console.log(`[fetch] "${query}"...`);
    try {
      const jobs = await fetchJobs({ query, location: 'remote', numPages: 2 });
      console.log(`[fetch]   → ${jobs.length} jobs`);
      allJobs.push(...jobs);
    } catch (err) {
      console.error(`[fetch] Error: ${err.message}`);
    }
  }

  const seen = new Set();
  const unique = allJobs.filter((j) => {
    if (seen.has(j.id)) return false;
    seen.add(j.id);
    return true;
  });

  saveJobs(unique);
  console.log(`[fetch] Saved ${unique.length} unique jobs to DB`);
  return unique.length;
}
