# JD Hunter

A Node.js tool that fetches backend job postings (Node.js / AI / remote) from LinkedIn and Indeed via the JSearch API, deduplicates them, and saves structured JSON for skill-gap analysis.

## Setup

```bash
npm install
cp .env.example .env
# Add your RapidAPI key to .env
```

Get a free API key at [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch).

## Usage

```bash
npm start
```

Fetches jobs matching Node.js backend / senior Node.js / Backend + AI roles (remote), saves to `data/jobs.json`.

## Output shape

```json
{
  "id": "...",
  "title": "Senior Node.js Engineer",
  "company": "Acme Corp",
  "location": "Remote",
  "remote": true,
  "salary_min": 80000,
  "salary_max": 120000,
  "salary_currency": "USD",
  "description": "...",
  "skills": ["Node.js", "PostgreSQL", "AWS"],
  "apply_link": "https://...",
  "posted_at": "2024-06-01T00:00:00.000Z",
  "source": "LinkedIn"
}
```

## Stack

- Node.js (ESM)
- Axios
- JSearch API via RapidAPI
