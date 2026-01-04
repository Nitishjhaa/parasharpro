const nakshatraHindiNames = {
  Ashwini: "अश्विनी",
  Bharani: "भरणी",
  Krittika: "कृतिका",
  Rohini: "रोहिणी",
  Mrigashira: "मृगशिरा",
  Ardra: "अर्द्रा",
  Punarvasu: "पुनर्वसु",
  Pushya: "पुष्य",
  Ashlesha: "आश्लेषा",
  Magha: "मघा",
  Purva_Phalguni: "पूर्वाफाल्गुनी",
  Uttara_Phalguni: "उत्तराफाल्गुनी",
  Hasta: "हस्त",
  Chitra: "चित्रा",
  Swati: "स्वाती",
  Vishakha: "विशाखा",
  Anuradha: "अनुराधा",
  Jyeshtha: "ज्येष्ठा",
  Mula: "मूल",
  Purva_Ashadha: "पूर्वाषाढ़ा",
  Uttara_Ashadha: "उत्तराषाढ़ा",
  Shravana: "श्रवण",
  Dhanishta: "धनिष्ठा",
  Shatabhisha: "शतभिषा",
  Purva_Bhadrapada: "पूर्वभाद्रपदा",
  Uttara_Bhadrapada: "उत्तराभाद्रपद",
  Revati: "रेवती",
};

const nakshatraNonCompatibleMap = {
  Ashwini: [],
  Bharani: ["Rohini", "Pushya", "Ashlesha", "Ardra", "Jyeshtha"],
  Krittika: ["Mrigashira", "Ardra", "Mula", "PurvaPhalguni"],
  Rohini: ["Ardra", "Mula", "PurvaPhalguni", "Pushya", "Magha", "Swati"],
  Mrigashira: ["PurvaPhalguni", "Punarvasu", "Pushya", "UttaraPhalguni"],
  Ardra: ["Pushya", "UttaraPhalguni", "Shravana", "Magha"],
  Punarvasu: ["Pushya", "Ashlesha", "Krittika", "Shatabhisha"],
  Pushya: ["Shravana", "Shatabhisha", "Chitra", "Magha", "UttaraPhalguni"],
  Ashlesha: ["PurvaPhalguni", "Hasta", "Shatabhisha", "PurvaBhadrapada"],
  Magha: ["UttaraPhalguni", "Chitra", "Vishakha", "UttaraBhadrapada", "Rohini"],
  PurvaPhalguni: ["Ashlesha", "Hasta", "Swati", "Mrigashira"],
  UttaraPhalguni: ["Chitra", "Vishakha", "PurvaBhadrapada", "Punarvasu"],
  Hasta: ["Ashwini", "Mula", "Magha", "Anuradha", "Swati", "Bharani"],
  Chitra: ["Jyeshtha", "PurvaAshadha", "Krittika", "Vishakha"],
  Swati: ["Anuradha", "Mula", "UttaraAshadha", "Rohini", "Mrigashira"],
  Vishakha: ["Rohini", "Magha", "PurvaAshadha", "Shravana"],
  Anuradha: ["Mula", "UttaraAshadha", "Ardra", "Punarvasu"],
  Jyeshtha: ["PurvaAshadha", "Shravana", "Ardra", "UttaraPhalguni", "Shatabhisha", "Punarvasu"],
  Mula: [],
  PurvaAshadha: ["Shravana", "Shatabhisha", "UttaraBhadrapada", "Pushya", "Ashlesha", "Chitra"],
  UttaraAshadha: ["Dhanishta", "Shatabhisha", "PurvaBhadrapada", "Revati", "Magha", "Swati"],
  Shravana: ["Shatabhisha", "UttaraBhadrapada", "Ashwini", "Magha", "PurvaPhalguni"],
  Dhanishta: ["PurvaBhadrapada", "Revati", "Anuradha", "Bharani"],
  Shatabhisha: ["UttaraBhadrapada", "Ashwini", "Krittika", "Dhanishta"],
  PurvaBhadrapada: ["Revati", "Bharani", "Mula"],
  UttaraBhadrapada: ["Ashwini", "Krittika", "Mrigashira", "PurvaAshadha"],
  Revati: ["Bharani", "Rohini", "Shravana", "PurvaAshadha"]
};


export function getNonCompatibleNakshatrasInHindi(nakshatraEnglish) {
  const incompatibleList = nakshatraNonCompatibleMap[nakshatraEnglish] || [];
  return incompatibleList.map(name => nakshatraHindiNames[name] || name);
}

export function isMutuallyNonCompatible(boyNakshatra, girlNakshatra) {
  const girlInHindi = nakshatraHindiNames[girlNakshatra];
  const boyInHindi = nakshatraHindiNames[boyNakshatra];

  const girlNonCompatible = getNonCompatibleNakshatrasInHindi(girlNakshatra);
  const boyNonCompatible = getNonCompatibleNakshatrasInHindi(boyNakshatra);

  const boyInGirlList = girlNonCompatible.includes(boyInHindi);
  const girlInBoyList = boyNonCompatible.includes(girlInHindi);

  return {
    boyInGirlList,
    girlInBoyList,
    isMutual: boyInGirlList && girlInBoyList,
    details: {
      boy: {
        name: boyNakshatra,
        inHindi: boyInHindi,
        girlHasBoyInIncompatibilityList: boyInGirlList,
      },
      girl: {
        name: girlNakshatra,
        inHindi: girlInHindi,
        boyHasGirlInIncompatibilityList: girlInBoyList,
      },
    },
  };
}

export function hasSunSaturnRahuDosha(sunHouseNumber, saturnHouseNumber, rahuHouseNumber) {
  const doshaHouses = [1, 4, 7, 8, 12];
  const affected = [];

  const isSunAffected = doshaHouses.includes(sunHouseNumber);
  const isSaturnAffected = doshaHouses.includes(saturnHouseNumber);
  const isRahuAffected = doshaHouses.includes(rahuHouseNumber);

  if (isSunAffected) affected.push("सूर्य");
  if (isSaturnAffected) affected.push("शनि");
  if (isRahuAffected) affected.push("राहु");

  if (isSunAffected || isSaturnAffected || isRahuAffected) {
    return {
      result: true,
      affectedPlanets: affected
    };
  }

  return {
    result: false,
    affectedPlanets: []
  };
}


// tara

const nakshatras = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "PurvaPhalguni", "UttaraPhalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "PurvaAshadha",
  "UttaraAshadha", "Shravana", "Dhanishta", "Shatabhisha", "PurvaBhadrapada",
  "UttaraBhadrapada", "Revati"
];

// have to fix the names of the uttra and poorva
const taraTypes = [
  "जन्म",     // Janma
  "संपत्त",   // Sampat
  "विपत्त",   // Vipat
  "क्षेम",    // Kshema
  "प्रत्यारी", // Pratyari
  "साधक",     // Sadhaka
  "नैधन",     // Naidhana
  "मित्र",     // Mitra
  "अति-मित्र"  // Ati-Mitra
];

const auspicious = new Set([
  "संपत्त",
  "क्षेम",
  "साधक",
  "मित्र",
  "अति-मित्र"
]);

function getNakshatraIndex(name) {
  console.log(name)
  const index = nakshatras.findIndex(n => n.toLowerCase() === name.toLowerCase());
  if (index === -1) throw new Error(`Invalid Nakshatra name: ${name}`);
  return index;
}

function getTaraType(fromIndex, toIndex) {
  const distanceCount = ((toIndex - fromIndex + 27) % 27) + 1;
  const taraIndex = (distanceCount - 1) % 9;
  return taraTypes[taraIndex];
}


export function calculateTaraPoints(girlNakshatra, boyNakshatra) {
  const gIndex = getNakshatraIndex(girlNakshatra);
  const bIndex = getNakshatraIndex(boyNakshatra);

  const taraGirlToBoy = getTaraType(gIndex, bIndex);
  const taraBoyToGirl = getTaraType(bIndex, gIndex);

  const isGirlToBoyAuspicious = auspicious.has(taraGirlToBoy);
  const isBoyToGirlAuspicious = auspicious.has(taraBoyToGirl);

  let points = 0;
  if (taraGirlToBoy === taraBoyToGirl) {
    points = 3;
  }
  if (isGirlToBoyAuspicious && isBoyToGirlAuspicious) {
    points = 3;

  } else if (isGirlToBoyAuspicious || isBoyToGirlAuspicious) {
    points = 1.5;
  }

  return {
    points,
    taraGirlToBoy,
    taraBoyToGirl
  };
}

// ---------- NORMALIZER ----------
const normalize = (v) => v?.trim?.() ?? v;

// ---------- YONI ----------
export const getYoni = (nakshatraIndex) => {
  nakshatraIndex = nakshatraIndex + 1;

  const yoniMap = {
    अश्व: [1, 24],
    गज: [2, 27],
    मेष: [3, 8],
    सर्प: [4, 5],
    शवान: [6, 19],
    मर्जार: [7, 9],
    मूसक: [10, 11],
    गौ: [12, 26],
    महिष: [13, 15],
    व्याघ्र: [14, 16],
    मृग: [17, 18],
    वानर: [20, 22],
    नकुल: [21],
    सिंह: [23, 25],
  };

  for (const [yoni, list] of Object.entries(yoniMap)) {
    if (list.includes(nakshatraIndex)) {
      return normalize(yoni);
    }
  }
  return "";
};

// ---------- NAADI ----------
export const getNaadi = (nakshatraIndex) => {
  nakshatraIndex += 1;

  const naadiMap = {
    आद्य: [1, 6, 7, 12, 13, 18, 19, 24, 25],
    मध्य: [2, 5, 8, 11, 14, 17, 20, 23, 26],
    अन्त्य: [3, 4, 9, 10, 15, 16, 21, 22, 27],
  };

  for (const [k, v] of Object.entries(naadiMap)) {
    if (v.includes(nakshatraIndex)) return normalize(k);
  }
};

// ---------- VARNA ----------
export const getVarna = (rashiIndex) => {
  rashiIndex += 1;

  const map = {
    ब्राह्मण: [4, 8, 12],
    क्षत्रिय: [1, 5, 9],
    वैश्य: [2, 6, 10],
    शूद्र: [3, 7, 11],
  };

  for (const [k, v] of Object.entries(map)) {
    if (v.includes(rashiIndex)) return normalize(k);
  }
};

// ---------- VASHYA ----------
export const getVashya = (rashiIndex) => {
  rashiIndex += 1;

  const map = {
    चतुष्पद: [1, 2],
    मानव: [3, 6, 7, 9, 11],
    जलचर: [4, 10, 12],
    वनचर: [5],
    कीट: [8],
  };

  for (const [k, v] of Object.entries(map)) {
    if (v.includes(rashiIndex)) return normalize(k);
  }
};

// gun cal
const gunScoreTables = {
  varna: {
    ब्राह्मण: { ब्राह्मण: 1, क्षत्रिय: 1, वैश्य: 1, शूद्र: 1 },
    क्षत्रिय: { ब्राह्मण: 0, क्षत्रिय: 1, वैश्य: 1, शूद्र: 1 },
    वैश्य: { ब्राह्मण: 0, क्षत्रिय: 0, वैश्य: 1, शूद्र: 1 },
    शूद्र: { ब्राह्मण: 0, क्षत्रिय: 0, वैश्य: 0, शूद्र: 1 }
  },

  vashya: {
    चतुष्पद: { चतुष्पद: 2, मानव: 1, जलचर: 1, वनचर: 0, कीट: 1 },
    मानव: { चतुष्पद: 1, मानव: 2, जलचर: 0.5, वनचर: 0, कीट: 1 },
    जलचर: { चतुष्पद: 1, मानव: 0.5, जलचर: 2, वनचर: 1, कीट: 1 },
    वनचर: { चतुष्पद: 0, मानव: 0, जलचर: 1, वनचर: 2, कीट: 0 },
    कीट: { चतुष्पद: 1, मानव: 1, जलचर: 0, वनचर: 0, कीट: 2 }
  },

  yoni: {
    अश्व: {
      अश्व: 4, गज: 2, मेष: 3, सर्प: 2, शवान: 2, मर्जार: 3, मूसक: 3,
      गौ: 3, महिष: 0, व्याघ्र: 1, मृग: 3, वानर: 2, नकुल: 2, सिंह: 1
    },
    गज: {
      अश्व: 2, गज: 4, मेष: 3, सर्प: 2, शवान: 2, मर्जार: 3, मूसक: 3,
      गौ: 3, महिष: 3, व्याघ्र: 1, मृग: 2, वानर: 3, नकुल: 2, सिंह: 0
    },
    मेष: {
      अश्व: 3, गज: 3, मेष: 4, सर्प: 3, शवान: 2, मर्जार: 3, मूसक: 1,
      गौ: 3, महिष: 3, व्याघ्र: 1, मृग: 3, वानर: 0, नकुल: 3, सिंह: 1
    },
    सर्प: {
      अश्व: 2, गज: 2, मेष: 2, सर्प: 4, शवान: 2, मर्जार: 2, मूसक: 1,
      गौ: 1, महिष: 2, व्याघ्र: 2, मृग: 2, वानर: 2, नकुल: 0, सिंह: 2
    },
    शवान: {
      अश्व: 2, गज: 2, मेष: 2, सर्प: 2, शवान: 4, मर्जार: 1, मूसक: 1,
      गौ: 2, महिष: 2, व्याघ्र: 1, मृग: 0, वानर: 2, नकुल: 2, सिंह: 1
    },
    मर्जार: {
      अश्व: 2, गज: 2, मेष: 3, सर्प: 2, शवान: 1, मर्जार: 4, मूसक: 0,
      गौ: 2, महिष: 2, व्याघ्र: 1, मृग: 2, वानर: 2, नकुल: 2, सिंह: 2
    },
    मूसक: {
      अश्व: 2, गज: 2, मेष: 2, सर्प: 1, शवान: 1, मर्जार: 0, मूसक: 4,
      गौ: 2, महिष: 2, व्याघ्र: 2, मृग: 2, वानर: 2, नकुल: 2, सिंह: 1
    },
    गौ: {
      अश्व: 3, गज: 2, मेष: 3, सर्प: 1, शवान: 2, मर्जार: 2, मूसक: 2,
      गौ: 4, महिष: 3, व्याघ्र: 0, मृग: 3, वानर: 2, नकुल: 3, सिंह: 1
    },
    महिष: {
      अश्व: 0, गज: 3, मेष: 3, सर्प: 2, शवान: 2, मर्जार: 2, मूसक: 2,
      गौ: 3, महिष: 4, व्याघ्र: 1, मृग: 2, वानर: 2, नकुल: 2, सिंह: 3
    },
    व्याघ्र: {
      अश्व: 1, गज: 2, मेष: 1, सर्प: 2, शवान: 1, मर्जार: 1, मूसक: 2,
      गौ: 0, महिष: 1, व्याघ्र: 4, मृग: 2, वानर: 1, नकुल: 2, सिंह: 2
    },
    मृग: {
      अश्व: 3, गज: 2, मेष: 3, सर्प: 2, शवान: 0, मर्जार: 2, मूसक: 2,
      गौ: 3, महिष: 2, व्याघ्र: 1, मृग: 4, वानर: 2, नकुल: 2, सिंह: 2
    },
    वानर: {
      अश्व: 2, गज: 3, मेष: 0, सर्प: 2, शवान: 2, मर्जार: 2, मूसक: 2,
      गौ: 2, महिष: 2, व्याघ्र: 1, मृग: 2, वानर: 4, नकुल: 2, सिंह: 3
    },
    नकुल: {
      अश्व: 2, गज: 2, मेष: 3, सर्प: 0, शवान: 2, मर्जार: 2, मूसक: 2,
      गौ: 3, महिष: 2, व्याघ्र: 2, मृग: 2, वानर: 2, नकुल: 4, सिंह: 2
    },
    सिंह: {
      अश्व: 1, गज: 0, मेष: 1, सर्प: 2, शवान: 1, मर्जार: 2, मूसक: 1,
      गौ: 1, महिष: 3, व्याघ्र: 2, मृग: 2, वानर: 2, नकुल: 2, सिंह: 4
    }
  },
  grahaMaitri: {
    सूर्य: { सूर्य: 5, चन्द्र: 5, मंगल: 5, बुध: 4, गुरु: 5, शुक्र: 0, शनि: 0 },
    चन्द्र: { सूर्य: 5, चन्द्र: 5, मंगल: 4, बुध: 1, गुरु: 4, शुक्र: 0.5, शनि: 0.5 },
    मंगल: { सूर्य: 5, चन्द्र: 4, मंगल: 5, बुध: 0.5, गुरु: 5, शुक्र: 3, शनि: 0.5 },
    बुध: { सूर्य: 4, चन्द्र: 1, मंगल: 0.5, बुध: 5, गुरु: 0.5, शुक्र: 5, शनि: 4 },
    गुरु: { सूर्य: 5, चन्द्र: 4, मंगल: 5, बुध: 0.5, गुरु: 5, शुक्र: 0.5, शनि: 3 },
    शुक्र: { सूर्य: 0, चन्द्र: 0.5, मंगल: 3, बुध: 5, गुरु: 0.5, शुक्र: 5, शनि: 5 },
    शनि: { सूर्य: 0, चन्द्र: 0.5, मंगल: 0.5, बुध: 4, गुरु: 3, शुक्र: 5, शनि: 5 }
  },

  gana: {
    देव: { देव: 6, मनुष्य: 6, दानव: 0 },
    मनुष्य: { देव: 5, मनुष्य: 6, दानव: 0 },
    दानव: { देव: 0, मनुष्य: 0, दानव: 6 }
  },


  bhakoot: {
    मेष: { मेष: 7, वृष: 0, मिथुन: 7, कर्क: 7, सिंह: 0, कन्या: 0, तुला: 7, वृश्चिक: 0, धनु: 0, मकर: 7, कुंभ: 7, मीन: 0 },
    वृष: { मेष: 0, वृष: 7, मिथुन: 0, कर्क: 7, सिंह: 7, कन्या: 0, तुला: 0, वृश्चिक: 7, धनु: 0, मकर: 0, कुंभ: 7, मीन: 7 },
    मिथुन: { मेष: 7, वृष: 0, मिथुन: 7, कर्क: 0, सिंह: 7, कन्या: 7, तुला: 0, वृश्चिक: 0, धनु: 7, मकर: 0, कुंभ: 0, मीन: 7 },
    कर्क: { मेष: 7, वृष: 7, मिथुन: 0, कर्क: 7, सिंह: 0, कन्या: 7, तुला: 7, वृश्चिक: 0, धनु: 0, मकर: 7, कुंभ: 0, मीन: 0 },
    सिंह: { मेष: 0, वृष: 7, मिथुन: 7, कर्क: 0, सिंह: 7, कन्या: 7, तुला: 7, वृश्चिक: 7, धनु: 0, मकर: 0, कुंभ: 7, मीन: 0 },
    कन्या: { मेष: 0, वृष: 0, मिथुन: 7, कर्क: 7, सिंह: 0, कन्या: 7, तुला: 0, वृश्चिक: 7, धनु: 7, मकर: 0, कुंभ: 0, मीन: 7 },
    तुला: { मेष: 7, वृष: 0, मिथुन: 0, कर्क: 7, सिंह: 7, कन्या: 0, तुला: 7, वृश्चिक: 0, धनु: 7, मकर: 7, कुंभ: 0, मीन: 0 },
    वृश्चिक: { मेष: 0, वृष: 7, मिथुन: 0, कर्क: 0, सिंह: 7, कन्या: 7, तुला: 0, वृश्चिक: 7, धनु: 0, मकर: 7, कुंभ: 7, मीन: 0 },
    धनु: { मेष: 0, वृष: 0, मिथुन: 7, कर्क: 0, सिंह: 0, कन्या: 0, तुला: 7, वृश्चिक: 7, धनु: 7, मकर: 0, कुंभ: 7, मीन: 7 },
    मकर: { मेष: 7, वृष: 0, मिथुन: 0, कर्क: 7, सिंह: 0, कन्या: 0, तुला: 7, वृश्चिक: 7, धनु: 0, मकर: 7, कुंभ: 0, मीन: 7 },
    कुंभ: { मेष: 7, वृष: 7, मिथुन: 7, कर्क: 0, सिंह: 7, कन्या: 0, तुला: 0, वृश्चिक: 7, धनु: 7, मकर: 7, कुंभ: 7, मीन: 0 },
    मीन: { मेष: 0, वृष: 7, मिथुन: 7, कर्क: 0, सिंह: 0, कन्या: 7, तुला: 0, वृश्चिक: 0, धनु: 7, मकर: 7, कुंभ: 0, मीन: 7 }
  },
  nadi: {
    आद्य: { आद्य: 0, मध्य: 8, अन्त्य: 8 },
    मध्य: { आद्य: 8, मध्य: 0, अन्त्य: 8 },
    अन्त्य: { आद्य: 8, मध्य: 8, अन्त्य: 0 }
  },
};

// ---------- GUN MILAN ----------
export function calculateGunMilanScore(boyData, girlData) {
  const getScore = (table, boyVal, girlVal) =>
    table?.[normalize(boyVal)]?.[normalize(girlVal)] ?? 0;

  const scores = {
    varna: getScore(gunScoreTables.varna, boyData.varna, girlData.varna),
    vashya: getScore(gunScoreTables.vashya, boyData.vashya, girlData.vashya),
    yoni: getScore(gunScoreTables.yoni, boyData.yoni, girlData.yoni),
    grahaMaitri: getScore(
      gunScoreTables.grahaMaitri,
      normalize(boyData.grahaMaitri).replace("चंद्र", "चन्द्र"),
      normalize(girlData.grahaMaitri).replace("चंद्र", "चन्द्र")
    ),
    gana: getScore(
      gunScoreTables.gana,
      normalize(boyData.gana).replace("राक्षस", "दानव"),
      normalize(girlData.gana).replace("राक्षस", "दानव")
    ),
    bhakoot: getScore(gunScoreTables.bhakoot, boyData.bhakoot, girlData.bhakoot),
    nadi: getScore(gunScoreTables.nadi, boyData.nadi, girlData.nadi),
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return {
    individualScores: scores,
    totalScore,
  };
}

export const rashiTattvas = ({asc, moon, venus}) => {

  const ascNumber = asc;
  const moonNumber = moon;
  const venusNumber = venus;

  const tatvaMap = {
    1: "अग्नि",
    2: "पृथ्वी",
    3: "वायु",
    4: "जल",
    5: "अग्नि",
    6: "पृथ्वी",
    7: "वायु",
    8: "जल",
    9: "अग्नि",
    10: "पृथ्वी",
    11: "वायु",
    12: "जल"
  }

  const ascTatva = tatvaMap[ascNumber];
  const moonTatva = tatvaMap[moonNumber];
  const venusTatva = tatvaMap[venusNumber];

  return {
    ascTatva,
    moonTatva,
    venusTatva
  }

};
