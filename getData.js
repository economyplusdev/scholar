const axios = require('axios');
const fs = require('fs');

const pageSize = 2500;
const headers = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "no-cache",
  "content-type": "application/json",
  "origin": "https://bigfuture.collegeboard.org",
  "pragma": "no-cache",
  "priority": "u=1, i",
  "referer": "https://bigfuture.collegeboard.org/",
  "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
};

const criteria = {
  location: { country: "US" },
  includeFields: [
    "cbScholarshipId",
    "programTitleSlug",
    "programReferenceId",
    "programOrganizationName",
    "scholarshipMaximumAward",
    "programName",
    "openDate",
    "closeDate",
    "isMeritBased",
    "isNeedBased",
    "awardVerificationCriteriaDescription",
    "programSelfDescription",
    "eligibilityCriteriaDescription",
    "blurb"
  ]
};

const sortOptions = [
  [{ scholarshipMaximumAward: { order: "desc" } }],
  [{ scholarshipMaximumAward: { order: "asc" } }],
  [{ programName: { order: "asc" } }]
];

async function fetchScholarshipsWithSort(sortOption) {
  let offset = 0;
  let results = [];
  while (true) {
    const payload = {
      config: { size: pageSize, from: offset },
      sort: sortOption,
      criteria
    };
    const response = await axios.post(
      'https://scholarshipsearch-api.collegeboard.org/scholarships',
      payload,
      { headers }
    );
    const hits = response.data.data || response.data.hits?.hits || [];
    if (hits.length === 0) break;
    results = results.concat(hits.map(hit => hit._source || hit));
    offset += pageSize;
  }
  return results;
}

async function main() {
  let allResults = [];
  for (const sortOption of sortOptions) {
    console.log(`Fetching with sort: ${JSON.stringify(sortOption)}`);
    try {
      const res = await fetchScholarshipsWithSort(sortOption);
      console.log(`Fetched ${res.length} scholarships`);
      allResults = allResults.concat(res);
    } catch (e) {
      console.error('Error with sort option', sortOption, e.response ? e.response.data : e);
    }
  }
  
  const deduped = new Map();
  allResults.forEach(item => {
    const key = item.cbScholarshipId || item.id;
    if (key && !deduped.has(key)) deduped.set(key, item);
  });
  const finalResults = Array.from(deduped.values());
  console.log(`Total combined scholarships: ${finalResults.length}`);
  fs.writeFileSync('data.json', JSON.stringify(finalResults, null, 2), 'utf-8');
  console.log('Done writing data.json');
}

main();
