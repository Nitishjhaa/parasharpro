
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
   * Returns both the Sun Zodiac number and offset from Ascendant
   * @param {string} ascendantStr - e.g., "Leo, सिंह"
   * @param {number} sunHousePosition - e.g., 1 (Sun is in the 1st house from Ascendant in Sun Kundli)
   * @returns {{ sunZodiac: number, offset: number }}
   */
  
 export function getSunData(ascendantStr, sunHousePosition) {
    const ascNum = signToNumberMap[ascendantStr.trim()];
    if (!ascNum) throw new Error("Invalid Ascendant String");
  
    // Sun Kundli: Sun becomes 1st house
    const sunZodiac = ((ascNum + (sunHousePosition - 1) - 1) % 12) + 1;
  
    // Offset from Ascendant to Sun in Lagna
    const offset = (sunZodiac - ascNum + 12) % 12;
  
    return {
      sunZodiac,
      offset
    };
  }
  

  