const getPanchangDetails = require('../src/lib/panchang.js').default;

function testHour(hour) {
  const hrStr = hour.toString().padStart(2, '0');
  try {
      const details = getPanchangDetails("2026-05-30", `${hrStr}:00:00`, 28.6139, 77.2090);
      console.log(`${hrStr}:00 - Tithi: ${details.tithi.name} (${details.englishTithi}), Nakshatra: ${details.englishNakshatra}`);
  } catch (err) {
      console.error(err);
  }
}

testHour(8);
testHour(12);
testHour(16);
