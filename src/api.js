import express from 'express';
import { getJobs, getJobById, getJobCount } from './db.js';
import { runFetch } from './runner.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', jobs: getJobCount() });
});

app.get('/jobs', (req, res) => {
  const { limit = 50, offset = 0, remote, search } = req.query;
  const jobs = getJobs({
    limit: Number(limit),
    offset: Number(offset),
    remote: remote === undefined ? undefined : remote === 'true',
    search,
  });
  res.json({ count: jobs.length, jobs });
});

app.get('/jobs/:id', (req, res) => {
  const job = getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

app.post('/fetch', async (_req, res) => {
  try {
    const count = await runFetch();
    res.json({ message: `Fetched and saved ${count} jobs` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
