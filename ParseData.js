const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

(async () => {
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

    const width = 800;
    const height = 600;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    const labels = output.map(cat => cat.type);
    const dataPercentages = output.map(cat => parseFloat(cat.percentage));
    const configuration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Percentage of Scholarships',
          data: dataPercentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Special Group Scholarships (%)'
          }
        }
      }
    };

    if (!fs.existsSync('./images')) {
      fs.mkdirSync('./images', { recursive: true });
    }

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync('./images/special_groups_pie_chart.png', imageBuffer);
    console.log('Pie chart saved to ./images/special_groups_pie_chart.png');
  } catch (error) {
    console.error(error);
  }
})();
