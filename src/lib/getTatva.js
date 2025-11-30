// lib/getTatva.js

export const rashiTattvas = {
    1: "अग्नि",
    2: "पृथ्वी",
    3: "वायु",
    4: "जल",
    5: "अग्नि",
    6: "পृथ्वी",
    7: "वायु",
    8: "जल",
    9: "अग्नि",
    10: "पृथ्वी",
    11: "वायु",
    12: "जल"
};

/**
 * FRONTEND ONLY
 * Compute planet tatva from kundali API response
 * 
 * LOGIC:
 *  rashiNumber = ((ascRashiIndex + house - 1) % 12) + 1
 *  tatva = rashiTattvas[rashiNumber]
 */
export function computePlanetTatvas(kundali) {
    if (!kundali) return {};

    // Ascendant object
    const asc = kundali.ascendant || kundali.raw?.ascendant;

    // Ascendant rashiIndex (0–11)
    const ascRashiIndex = asc?.rashiIndex ?? 0;

    // Convert to rashi number 1–12
    const ascRashiNumber = ascRashiIndex + 1;

    // Final tatva of ascendant
    const ascTatva = rashiTattvas[ascRashiNumber];

    // Planet list
    const planets = kundali.planets || kundali.raw?.planets || {};

    const out = {};

    for (const [name, data] of Object.entries(planets)) {
        const house = data.house; // 1–12

        if (!house) {
            out[name] = { tatva: null, rashiNumber: null, house: null, ascTatva };
            continue;
        }

        // House → actual rashi number
        const rashiNumber = ((ascRashiIndex + house - 1) % 12) + 1;

        out[name] = {
            tatva: rashiTattvas[rashiNumber],
            rashiNumber,
            house,
        };
    }

    return {out, ascTatva};
}
