const signToNumberMap = {
  "Aries": 1,
  "Taurus": 2,
  "Gemini": 3,
  "Cancer": 4,
  "Leo": 5,
  "Virgo": 6,
  "Libra": 7,
  "Scorpio": 8,
  "Sagittarius": 9,
  "Capricorn": 10,
  "Aquarius": 11,
  "Pisces": 12,
};

/**
 * Returns both the Chandra Moon Zodiac number and offset from Ascendant
 * @param {string} ascendantStr - e.g., "Scorpio"
 * @param {number} moonHousePosition - e.g., 3 (Moon is in 3rd house from Ascendant in Lagna Kundli)
 * @returns {{ chandraMoonZodiac: number, offset: number }}
 */
 export function getChandraData(ascendantStr, moonHousePosition) {
  const ascNum = signToNumberMap[ascendantStr.trim()];
  if (!ascNum) throw new Error("Invalid Ascendant String");

  // Chandra Kundli: Moon becomes 1st house
  const chandraMoonZodiac = ((ascNum + (moonHousePosition - 1) - 1) % 12) + 1;

  // Offset from Ascendant to Moon in Lagna
  const offset = (chandraMoonZodiac - ascNum + 12) % 12;

  return {
    chandraMoonZodiac,
    offset
  };
}