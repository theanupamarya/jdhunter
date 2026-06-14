import axios from 'axios';

const BASE_URL = 'https://jsearch.p.rapidapi.com/search';

const HEADERS = {
  'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
};

export async function fetchJobs({ query, location = 'remote', page = 1, numPages = 3 }) {
  const jobs = [];

  for (let p = 1; p <= numPages; p++) {
    const { data } = await axios.get(BASE_URL, {
      headers: HEADERS,
      params: {
        query: `${query} ${location}`,
        page: p,
        num_pages: 1,
        date_posted: 'month',
      },
    });

    if (!data.data?.length) break;

    const mapped = data.data.map((j) => ({
      id: j.job_id,
      title: j.job_title,
      company: j.employer_name,
      location: j.job_city || j.job_country,
      remote: j.job_is_remote,
      salary_min: j.job_min_salary,
      salary_max: j.job_max_salary,
      salary_currency: j.job_salary_currency,
      description: j.job_description,
      skills: j.job_required_skills ?? [],
      apply_link: j.job_apply_link,
      posted_at: j.job_posted_at_datetime_utc,
      source: j.job_publisher,
    }));

    jobs.push(...mapped);
  }

  return jobs;
}
