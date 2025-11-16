// lib/getPlanetaryDrishti.js

function mod12(num) {
    return ((num - 1 + 12) % 12) + 1;
}

/**
 * Input: kundali.planets.{Sun, Moon, ...}.house
 * Output: {
 *   Sun: { purnDrishti: [...], ekPaadDrishti: [...], ... },
 *   Moon: {...},
 *   ...
 * }
 */
export function getPlanetaryDrishti(kundali) {
    if (!kundali) return {};

    const planets = kundali.planets || kundali.raw?.planets || {};
    const drishtiData = {};

    for (const [planet, data] of Object.entries(planets)) {
        const position = data.house; // 1..12

        if (!position) continue;

        const drishti = {
            purnDrishti: [],
            ekPaadDrishti: [],
            doPaadDrishti: [],
            teenPaadDrishti: []
        };

        // Default Drishti
        drishti.ekPaadDrishti.push(mod12(position + 2));
        drishti.ekPaadDrishti.push(mod12(position + 9));

        drishti.doPaadDrishti.push(mod12(position + 4));
        drishti.doPaadDrishti.push(mod12(position + 8));

        drishti.teenPaadDrishti.push(mod12(position + 3));
        drishti.teenPaadDrishti.push(mod12(position + 7));

        drishti.purnDrishti.push(mod12(position + 6));

        // Special Fälle
        if (planet === "Mars") {
            drishti.purnDrishti.push(mod12(position + 3));
            drishti.purnDrishti.push(mod12(position + 7));
        }

        if (planet === "Jupiter") {
            drishti.purnDrishti.push(mod12(position + 4));
            drishti.purnDrishti.push(mod12(position + 8));
        }

        if (planet === "Saturn") {
            drishti.purnDrishti.push(mod12(position + 2));
            drishti.purnDrishti.push(mod12(position + 9));
        }

        // Remove duplicates & sort
        for (let key in drishti) {
            drishti[key] = [...new Set(drishti[key])].sort((a, b) => a - b);
        }

        drishtiData[planet] = drishti;
    }

    return drishtiData;
}
