// ---- RASHI FUNCTION ----
export const rashi = (rashiIndex) => {
    if (rashiIndex === undefined || rashiIndex === null) {
        return "rashi index not found";
    }

    const rashiHiName = {
        0: "मेष",
        1: "वृष",
        2: "मिथुन",
        3: "कर्क",
        4: "सिंह",
        5: "कन्या",
        6: "तुला",
        7: "वृश्चिक",
        8: "धनु",
        9: "मकर",
        10: "कुंभ",
        11: "मीन",
    };

    return rashiHiName[rashiIndex] ?? "invalid rashi index";
};

// ---- ANOTHER FUNCTION EXAMPLE ----
export const nakshatra = (nakIndex) => {
    const list = {
        0: "अश्विनी",
        1: "भरणी",
        2: "कृत्तिका",
        3: "रोहिणी",
        4: "मृगशिरा",
        5: "आर्द्रा",
        6: "पुनर्वसू",
        7: "पुष्य",
        8: "अश्लेषा",
        9: "मघा",
        10: "पूर्वा फाल्गुनी",
        11: "उत्तर फाल्गुनी",
        12: "हस्त",
        13: "चित्रा",
        14: "स्वाती",
        15: "विशाखा",
        16: "अनुराधा",
        17: "ज्येष्ठा",
        18: "मूला",
        19: "पूर्वाषाढ़ा",
        20: "उत्तराषाढ़ा",
        21: "श्रवण",
        22: "धनिष्ठा",
        23: "शतभिषा",
        24: "पूर्वा भाद्रपदा",
        25: "उत्तर भाद्रपदा",
        26: "रेवती",
    };

    return list[nakIndex] ?? "invalid nakshatra index";
};

// ---- ANOTHER FUNCTION EXAMPLE ----
export const planetName = (planetIndex) => {
    const planets = {
        0: "सूर्य",
        1: "चंद्र",
        2: "मंगल",
        3: "बुध",
        4: "गुरु",
        5: "शुक्र",
        6: "शनि",
        7: "राहु",
        8: "केतु",
    };

    return planets[planetIndex] ?? "invalid planet index";
};
