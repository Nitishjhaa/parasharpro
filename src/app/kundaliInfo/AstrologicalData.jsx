import { getHindiGrah } from '@/lib/grah'


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

// ---- ghaat chakra ----

export const getGhaatChakraByRashi = (rashiNumber, gender) => {
    const rashiList = [
        "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
        "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
    ];

    const ghaatChakar = []

    const ghaatChakraData = {
        "मेष": {
            घातमास: "कात्तिक", घाततिथि: "1, 6, 11", घातवार: "रविवार", घातनक्षत्र: "मघा",
            घातयोग: "विष्कुम्भ", घातकरण: "बव", प्रहर: "1", पुरुषराशि: "मेष", स्त्रीराशि: "मेष"
        },
        "वृषभ": {
            घातमास: "मार्गशीर्ष", घाततिथि: "5, 10, 15", घातवार: "शनिवार", घातनक्षत्र: "हस्त",
            घातयोग: "शुक्ल", घातकरण: "शकुनि", प्रहर: "4", पुरुषराशि: "कन्या", स्त्रीराशि: "धनु"
        },
        "मिथुन": {
            घातमास: "आषाढ", घाततिथि: "2, 7, 12", घातवार: "सोमवार", घातनक्षत्र: "स्वाति",
            घातयोग: "परिघ", घातकरण: "कौलव", प्रहर: "3", पुरुषराशि: "कुम्भ", स्त्रीराशि: "धनु"
        },
        "कर्क": {
            घातमास: "पोष", घाततिथि: "2, 7, 12", घातवार: "बुधवार", घातनक्षत्र: "अनुराधा",
            घातयोग: "व्याघात", घातकरण: "नाग", प्रहर: "1", पुरुषराशि: "सिंह", स्त्रीराशि: "मीन"
        },
        "सिंह": {
            घातमास: "ज्येष्ठ", घाततिथि: "3, 8, 13", घातवार: "शनिवार", घातनक्षत्र: "मूल",
            घातयोग: "धृति", घातकरण: "बव", प्रहर: "1", पुरुषराशि: "मकर", स्त्रीराशि: "वृश्चिक"
        },
        "कन्या": {
            घातमास: "भाद्रपद", घाततिथि: "5, 10, 15", घातवार: "शनिवार", घातनक्षत्र: "श्रवण",
            घातयोग: "शुक्ल", घातकरण: "कौलव", प्रहर: "1", पुरुषराशि: "मिथुन", स्त्रीराशि: "वृश्चिक"
        },
        "तुला": {
            घातमास: "माघ", घाततिथि: "4, 9, 14", घातवार: "गुरुवार", घातनक्षत्र: "शतभिषा",
            घातयोग: "शुक्ल", घातकरण: "तैतिल", प्रहर: "4", पुरुषराशि: "धनु", स्त्रीराशि: "मीन"
        },
        "वृश्चिक": {
            घातमास: "आष्विन", घाततिथि: "1, 6, 11", घातवार: "शुक्रवार", घातनक्षत्र: "रेवती",
            घातयोग: "व्यतिपात", घातकरण: "गर", प्रहर: "1", पुरुषराशि: "वृषभ", स्त्रीराशि: "धनु"
        },
        "धनु": {
            घातमास: "श्रावण", घाततिथि: "3, 8, 13", घातवार: "शुक्रवार", घातनक्षत्र: "भरणी",
            घातयोग: "वज्र", घातकरण: "तैतिल", प्रहर: "1", पुरुषराशि: "मीन", स्त्रीराशि: "कन्या"
        },
        "मकर": {
            घातमास: "वैशाख", घाततिथि: "4, 9, 14", घातवार: "मंगलवार", घातनक्षत्र: "रोहिणी",
            घातयोग: "वैघृति", घातकरण: "शकुनि", प्रहर: "4", पुरुषराशि: "सिंह", स्त्रीराशि: "वृश्चिक"
        },
        "कुंभ": {
            घातमास: "चैत्र", घाततिथि: "3, 8, 13", घातवार: "गुरुवार", घातनक्षत्र: "आर्द्रा",
            घातयोग: "गण्ड", घातकरण: "किंस्तुघ्न", प्रहर: "3", पुरुषराशि: "धनु", स्त्रीराशि: "मिथुन"
        },
        "मीन": {
            घातमास: "फाल्गुन", घाततिथि: "5, 10, 15", घातवार: "शुक्रवार", घातनक्षत्र: "आश्लेषा",
            घातयोग: "वज्र", घातकरण: "चतुष्पाद", प्रहर: "4", पुरुषराशि: "कुंभ", स्त्रीराशि: "कुंभ"
        }
    };

    const index = rashiNumber;

    const rashiName = rashiList[index];

    if (!rashiName || !ghaatChakraData[rashiName]) {
        return "Invalid Rashi number. It must be between 1 and 12.";
    }

    if (gender === 'Male') {
        ghaatChakar.push({
            घातमास: ghaatChakraData[rashiName].घातमास,
            घाततिथि: ghaatChakraData[rashiName].घाततिथि,
            घातवार: ghaatChakraData[rashiName].घातवार,
            घातनक्षत्र: ghaatChakraData[rashiName].घातनक्षत्र,
            घातयोग: ghaatChakraData[rashiName].घातयोग,
            घातकरण: ghaatChakraData[rashiName].घातकरण,
            प्रहर: ghaatChakraData[rashiName].प्रहर,
            पुरुषराशि: ghaatChakraData[rashiName].पुरुषराशि,
            स्त्रीराशि: ghaatChakraData[rashiName].स्त्रीराशि

        });

        return ghaatChakar;
    }

    else if (gender === 'Female') {
        ghaatChakar.push({
            घातमास: ghaatChakraData[rashiName].घातमास,
            घाततिथि: ghaatChakraData[rashiName].घाततिथि,
            घातवार: ghaatChakraData[rashiName].घातवार,
            घातनक्षत्र: ghaatChakraData[rashiName].घातनक्षत्र,
            घातयोग: ghaatChakraData[rashiName].घातयोग,
            घातकरण: ghaatChakraData[rashiName].घातकरण,
            प्रहर: ghaatChakraData[rashiName].प्रहर,
            पुरुषराशि: ghaatChakraData[rashiName].पुरुषराशि,
            स्त्रीराशि: ghaatChakraData[rashiName].स्त्रीराशि
        });

        return ghaatChakar;
    }
}

export const getMoonPaaye = (h) => {

    // Paaye by Moon house
    if (h === 1 || h === 6 || h === 11) return "सोना";
    if (h === 2 || h === 5 || h === 9) return "चाँदी";
    if (h === 3 || h === 7 || h === 10) return "ताँबा";
    if (h === 4 || h === 8 || h === 12) return "लोहा";

};

export const getNakPaaye = (nak) => {

    const goldPaaye = ['Revati', 'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira'];
    const silverPaaye = ['Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva_Phalguni', 'Uttara_Phalguni', 'Hasta', 'Chitra', 'Swati'];
    const copperPaaye = ['Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva_Ashadha', 'Uttara_Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha'];
    const IronPaaye = ['Purva_Bhadrapada', 'Uttara_Bhadrapada'];

    // Paaye by Nakshatra
    if (goldPaaye.includes(nak)) return "सोना";
    if (silverPaaye.includes(nak)) return "चाँदी";
    if (copperPaaye.includes(nak)) return "ताँबा";
    if (IronPaaye.includes(nak)) return "लोहा";


};


export const getLords = (type, value) => {

    const rashiLords = {
        Aries: "Mars",
        Taurus: "Venus",
        Gemini: "Mercury",
        Cancer: "Moon",
        Leo: "Sun",
        Virgo: "Mercury",
        Libra: "Venus",
        Scorpio: "Mars",
        Sagittarius: "Jupiter",
        Capricorn: "Saturn",
        Aquarius: "Saturn",
        Pisces: "Jupiter"
    };

    const nakshatraLords = {
        Ashwini: "Ketu",
        Bharani: "Venus",
        Krittika: "Sun",
        Rohini: "Moon",
        Mrigashira: "Mars",
        Ardra: "Rahu",
        Punarvasu: "Jupiter",
        Pushya: "Saturn",
        Ashlesha: "Mercury",
        Magha: "Ketu",
        Purva_Phalguni: "Venus",
        Uttara_Phalguni: "Sun",
        Hasta: "Moon",
        Chitra: "Mars",
        Swati: "Rahu",
        Vishakha: "Jupiter",
        Anuradha: "Saturn",
        Jyeshtha: "Mercury",
        Mula: "Ketu",
        Purva_Ashadha: "Venus",
        Uttara_Ashadha: "Sun",
        Shravana: "Moon",
        Dhanishta: "Mars",
        Shatabhisha: "Rahu",
        Purva_Bhadrapada: "Jupiter",
        Uttara_Bhadrapada: "Saturn",
        Revati: "Mercury"
    };

    if (type === "lagna" || type === "rashi") {
        return getHindiGrah(rashiLords[value]) || "Unknown";
    }

    if (type === "nakshatra") {
        return getHindiGrah(nakshatraLords[value]) || "Unknown";
    }

    return "Invalid type";
}

