const fs = require('fs');

try {
  const data = fs.readFileSync('data.json', 'utf-8');
  const scholarships = JSON.parse(data);

  const categories = [
    { type: 'Black', keywords: ['african american', 'black', 'minority', 'diversity'] },
    { type: 'Women', keywords: ['women only', 'for women', 'female', 'women'] },
    { type: 'LGBT', keywords: ['lgbtqia', 'lgbtq+', 'lgbt', 'lgbtq'] },
    { type: 'Veterans', keywords: ['veteran', 'military', 'armed forces'] },
    { type: 'Native American', keywords: ['native american', 'indigenous', 'tribal'] }
  ];

  function matchesCategory(scholarship, categoryKeywords) {
    const lowerKeywords = categoryKeywords.map(kw => kw.toLowerCase());
    const fields = [
      scholarship.eligibilityCriteriaDescription,
      scholarship.programSelfDescription,
      scholarship.blurb
    ];
    for (const field of fields) {
      if (field && typeof field === 'string') {
        const lowerField = field.toLowerCase();
        for (const keyword of lowerKeywords) {
          if (lowerField.includes(keyword)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  const total = scholarships.length;
  const overallNeedBasedCount = scholarships.filter(s => s.isNeedBased).length;
  const overallNeedBasedPercentage = total > 0 ? ((overallNeedBasedCount / total) * 100).toFixed(2) : 0;

  const output = categories.map(category => {
    const matchedScholarships = scholarships.filter(s => matchesCategory(s, category.keywords));
    const count = matchedScholarships.length;
    const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : 0;
    const needBasedCount = matchedScholarships.filter(s => s.isNeedBased).length;
    const needBasedPercentage = count > 0 ? ((needBasedCount / count) * 100).toFixed(2) : 0;
    return {
      type: category.type,
      keywords: category.keywords,
      count,
      percentage,
      needBasedCount,
      needBasedPercentage,
      scholarships: matchedScholarships.map(s => ({
        programName: s.programName,
        cbScholarshipId: s.cbScholarshipId
      }))
    };
  });

  output.forEach(category => {
    console.log(
      `${category.type}: ${category.percentage}% of scholarships (${category.count} total), ` +
      `${category.needBasedPercentage}% need-based`
    );
  });
  
  console.log(`\nOverall Need-Based Scholarships: ${overallNeedBasedPercentage}% of all scholarships (${overallNeedBasedCount} out of ${total})`);
  
} catch (error) {
  console.error(error);
}
