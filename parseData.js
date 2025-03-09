const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const getRandomColors = require('./modules/getRandomColors');

(async () => {
  try {
    const data = fs.readFileSync('data.json', 'utf-8');
    const scholarships = JSON.parse(data);
    scholarships.forEach(s => {
      s.requiresEssay = s.awardVerificationCriteriaDescription && s.awardVerificationCriteriaDescription.toLowerCase().includes("essay");
      s.requiresLetter = s.awardVerificationCriteriaDescription && s.awardVerificationCriteriaDescription.toLowerCase().includes("recommendation");
    });
    const total = scholarships.length;
    const letterRequiredCount = scholarships.filter(s => s.requiresLetter).length;
    const letterRequiredPercentage = total > 0 ? ((letterRequiredCount / total) * 100).toFixed(2) : 0;
    const bothRequiredCount = scholarships.filter(s => s.requiresEssay && s.requiresLetter).length;
    const bothRequiredPercentage = total > 0 ? ((bothRequiredCount / total) * 100).toFixed(2) : 0;
    console.log(`Percentage of scholarships that require a letter of recommendation: ${letterRequiredPercentage}%`);
    console.log(`Percentage of scholarships that require both an essay and a letter of recommendation: ${bothRequiredPercentage}%`);

    const categories = [
      { type: 'Black', keywords: ['african american', 'black', 'minority', 'diversity'] },
      { type: 'Women', keywords: ['women only', 'for women', 'female', 'women'] },
      { type: 'LGBT', keywords: ['lgbtqia', 'lgbtq+', 'lgbt', 'lgbtq'] },
      { type: 'Veterans', keywords: ['veteran', 'military', 'armed forces'] },
      { type: 'Native American', keywords: ['native american', 'indigenous', 'tribal'] },
      { type: 'Hispanic', keywords: ['hispanic', 'latino', 'latina', 'latinx'] },
      { type: 'Asian', keywords: ['asian', 'pacific islander', 'south asian', 'east asian'] },
      { type: 'First Generation', keywords: ['first generation', 'first-gen', 'low-income'] },
      { type: 'Disability', keywords: ['disability', 'disabled', 'handicap', 'special needs'] }
    ];
    function matchesCategory(scholarship, categoryKeywords) {
      const lowerKeywords = categoryKeywords.map(kw => kw.toLowerCase());
      const fields = [scholarship.eligibilityCriteriaDescription, scholarship.programSelfDescription, scholarship.blurb];
      for (const field of fields) {
        if (field && typeof field === 'string') {
          const lowerField = field.toLowerCase();
          for (const keyword of lowerKeywords) {
            if (lowerField.includes(keyword)) return true;
          }
        }
      }
      return false;
    }
    function assignCategory(scholarship) {
      for (const category of categories) {
        if (matchesCategory(scholarship, category.keywords)) return category.type;
      }
      return 'Other';
    }
    const overallNeedBasedCount = scholarships.filter(s => s.isNeedBased).length;
    const overallNeedBasedPercentage = total > 0 ? ((overallNeedBasedCount / total) * 100).toFixed(2) : 0;
    const assignedScholarships = scholarships.map(s => ({ ...s, assignedCategory: assignCategory(s) }));
    const groupMap = {};
    assignedScholarships.forEach(s => {
      if (!groupMap[s.assignedCategory]) groupMap[s.assignedCategory] = [];
      groupMap[s.assignedCategory].push(s);
    });
    const definedCategoryTypes = categories.map(c => c.type);
    if (!definedCategoryTypes.includes('Other')) definedCategoryTypes.push('Other');
    const output = definedCategoryTypes.map(type => {
      const group = groupMap[type] || [];
      const count = group.length;
      const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : 0;
      const needBasedCount = group.filter(s => s.isNeedBased).length;
      const needBasedPercentage = count > 0 ? ((needBasedCount / count) * 100).toFixed(2) : 0;
      return {
        type,
        count,
        percentage,
        needBasedCount,
        needBasedPercentage,
        scholarships: group.map(s => ({
          programName: s.programName,
          cbScholarshipId: s.cbScholarshipId
        }))
      };
    });
    output.forEach(category => {
      console.log(`${category.type}: ${category.percentage}% of scholarships (${category.count} total), ${category.needBasedPercentage}% need-based`);
    });
    console.log(`\nOverall Need-Based Scholarships: ${overallNeedBasedPercentage}% of all scholarships (${overallNeedBasedCount} out of ${total})`);
    const width = 800;
    const height = 600;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    if (!fs.existsSync('./images')) fs.mkdirSync('./images', { recursive: true });
    const labels = output.map(cat => cat.type);
    const dataPercentages = output.map(cat => parseFloat(cat.percentage));
    const backgroundColorsSpecial = getRandomColors(labels.length, 0.6);
    const borderColorsSpecial = getRandomColors(labels.length, 1);
    const configSpecialGroups = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Percentage of Scholarships',
          data: dataPercentages,
          backgroundColor: backgroundColorsSpecial,
          borderColor: borderColorsSpecial,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: 'Special Group Scholarships (%)' }
        }
      }
    };
    const imageBufferSpecial = await chartJSNodeCanvas.renderToBuffer(configSpecialGroups);
    fs.writeFileSync('./images/special_groups_pie_chart.png', imageBufferSpecial);
    const needBasedCount = overallNeedBasedCount;
    const meritBasedCount = total - overallNeedBasedCount;
    const labelsNeedBased = ['Need-based', 'Merit-based'];
    const backgroundColorsNeedBased = getRandomColors(labelsNeedBased.length, 0.6);
    const borderColorsNeedBased = getRandomColors(labelsNeedBased.length, 1);
    const configNeedBased = {
      type: 'pie',
      data: {
        labels: labelsNeedBased,
        datasets: [{
          label: 'Scholarship Type',
          data: [needBasedCount, meritBasedCount],
          backgroundColor: backgroundColorsNeedBased,
          borderColor: borderColorsNeedBased,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: 'Need-based vs Merit-based Scholarships' }
        }
      }
    };
    const imageBufferNeedBased = await chartJSNodeCanvas.renderToBuffer(configNeedBased);
    fs.writeFileSync('./images/need_based_vs_merit_pie_chart.png', imageBufferNeedBased);
    const validScholarships = scholarships.filter(s => s.scholarshipMaximumAward !== null && !isNaN(s.scholarshipMaximumAward));
    const sum = validScholarships.reduce((acc, s) => acc + Number(s.scholarshipMaximumAward), 0);
    const avg = validScholarships.length > 0 ? sum / validScholarships.length : 0;
    if (validScholarships.length > 0) {
      console.log(`Average Scholarship Maximum Award: ${Math.round(avg)}$`);
    } else {
      console.log("No valid scholarshipMaximumAward values.");
    }
    if (validScholarships.length > 0) {
      let awards = validScholarships.map(s => Number(s.scholarshipMaximumAward));
      let minAward = Math.min(...awards);
      let maxAward = Math.max(...awards);
      const numBins = 10;
      let binWidth = (maxAward - minAward) / numBins;
      if (binWidth === 0) { binWidth = 1; }
      let bins = new Array(numBins).fill(0);
      let binLabels = [];
      for (let i = 0; i < numBins; i++) {
        let binStart = minAward + i * binWidth;
        let binEnd = minAward + (i + 1) * binWidth;
        binLabels.push(`${binStart.toFixed(0)} - ${binEnd.toFixed(0)}`);
      }
      for (let award of awards) {
        let index = Math.floor((award - minAward) / binWidth);
        if (index >= numBins) index = numBins - 1;
        bins[index]++;
      }
      const configHistogram = {
        type: 'bar',
        data: {
          labels: binLabels,
          datasets: [{
            label: 'Count of Scholarships',
            data: bins,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { title: { display: true, text: 'Distribution of Scholarship Maximum Awards' } }
        }
      };
      const imageBufferHistogram = await chartJSNodeCanvas.renderToBuffer(configHistogram);
      fs.writeFileSync('./images/scholarship_awards_histogram_bar_chart.png', imageBufferHistogram);
    } else {
      console.log('No valid scholarshipMaximumAward values to generate histogram.');
    }
  } catch (error) {
    console.error(error);
  }
})();
