import 'dotenv/config';
import cron from 'node-cron';
import app from './api.js';
import { runFetch } from './runner.js';

const PORT = process.env.PORT || 3000;

if (!process.env.RAPIDAPI_KEY) {
  console.error('Missing RAPIDAPI_KEY in .env');
  process.exit(1);
}

// daily fetch at midnight IST (18:30 UTC)
cron.schedule('30 18 * * *', () => {
  console.log('[cron] Starting scheduled job fetch...');
  runFetch().catch(console.error);
});

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
  console.log('[server] POST /fetch to trigger manually');
});
