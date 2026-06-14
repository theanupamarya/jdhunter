import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';

const DB_DIR = path.resolve('data');
mkdirSync(DB_DIR, { recursive: true });

const db = new Database(path.join(DB_DIR, 'jobs.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT,
    company TEXT,
    location TEXT,
    remote INTEGER,
    salary_min REAL,
    salary_max REAL,
    salary_currency TEXT,
    description TEXT,
    skills TEXT,
    apply_link TEXT,
    posted_at TEXT,
    source TEXT,
    fetched_at TEXT DEFAULT (datetime('now'))
  )
`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO jobs
    (id, title, company, location, remote, salary_min, salary_max,
     salary_currency, description, skills, apply_link, posted_at, source)
  VALUES
    (@id, @title, @company, @location, @remote, @salary_min, @salary_max,
     @salary_currency, @description, @skills, @apply_link, @posted_at, @source)
`);

export function saveJobs(jobs) {
  const insertMany = db.transaction((rows) => {
    for (const job of rows) {
      insert.run({ ...job, skills: JSON.stringify(job.skills ?? []), remote: job.remote ? 1 : 0 });
    }
  });
  insertMany(jobs);
}

export function getJobs({ limit = 50, offset = 0, remote, search } = {}) {
  let query = 'SELECT * FROM jobs WHERE 1=1';
  const params = [];

  if (remote !== undefined) {
    query += ' AND remote = ?';
    params.push(remote ? 1 : 0);
  }
  if (search) {
    query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  query += ' ORDER BY posted_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return db.prepare(query).all(...params).map(deserialize);
}

export function getJobById(id) {
  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
  return row ? deserialize(row) : null;
}

export function getJobCount() {
  return db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
}

function deserialize(row) {
  return { ...row, skills: JSON.parse(row.skills || '[]'), remote: Boolean(row.remote) };
}
