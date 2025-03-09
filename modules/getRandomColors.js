const randomRGBA = require('./randomRGBA');

function getRandomColors(count, alpha) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(randomRGBA(alpha));
  }
  return colors;
}

module.exports = getRandomColors;
