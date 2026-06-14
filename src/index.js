import 'dotenv/config';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fetchJobs } from './fetcher.js';

const QUERIES = [
  'Node.js backend developer',
  'Senior Node.js engineer',
  'Backend engineer Node.js AI',
];

const OUTPUT_DIR = path.resolve('data');

async function run() {
  if (!process.env.RAPIDAPI_KEY) {
    console.error('Missing RAPIDAPI_KEY in .env');
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const allJobs = [];

  for (const query of QUERIES) {
    console.log(`Fetching: "${query}"...`);
    try {
      const jobs = await fetchJobs({ query, location: 'remote', numPages: 2 });
      console.log(`  → ${jobs.length} jobs found`);
      allJobs.push(...jobs);
    } catch (err) {
      console.error(`  Error fetching "${query}":`, err.message);
    }
  }

  // deduplicate by job id
  const seen = new Set();
  const unique = allJobs.filter((j) => {
    if (seen.has(j.id)) return false;
    seen.add(j.id);
    return true;
  });

  const outPath = path.join(OUTPUT_DIR, 'jobs.json');
  await writeFile(outPath, JSON.stringify(unique, null, 2));

  console.log(`\nSaved ${unique.length} unique jobs → ${outPath}`);
}

run();
