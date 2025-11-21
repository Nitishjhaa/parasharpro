export const planetHindiMap = {
    Sun: "सूर्य",
    Moon: "चंद्र",
    Mars: "मंगल",
    Mercury: "बुध",
    Jupiter: "गुरु",
    Venus: "शुक्र",
    Saturn: "शनि",
    Rahu: "राहु",
    Ketu: "केतु"
};

export function getHindiGrah(englishName) {
    return planetHindiMap[englishName] || englishName || "";
}
