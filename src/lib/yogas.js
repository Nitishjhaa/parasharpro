export const getDrishtiFromHouses = ({
    sunHousePosition, moonHousePosition, marsHousePosition, mercuryHousePosition, jupiterHousePosition, venusHousePosition, saturnHousePosition, rahuHousePosition, ketuHousePosition }) => {
    const mod12 = (val) => ((val - 1) % 12) + 1;

    const getPlanetaryDrishti = (planetPositions) => {
        const drishtiData = {};

        for (const [planet, position] of Object.entries(planetPositions)) {
            if (!position || typeof position !== 'number') continue;

            const drishti = {
                purnDrishti: [],
                'ekPaadDrishti': [],
                'doPaadDrishti': [],
                'teenPaadDrishti': []
            };

            // Default Drishti
            drishti['ekPaadDrishti'].push(mod12(position + 2));
            drishti['ekPaadDrishti'].push(mod12(position + 9));

            drishti['doPaadDrishti'].push(mod12(position + 4));
            drishti['doPaadDrishti'].push(mod12(position + 8));

            drishti['teenPaadDrishti'].push(mod12(position + 3));
            drishti['teenPaadDrishti'].push(mod12(position + 7));

            drishti.purnDrishti.push(mod12(position + 6));

            if (planet === 'Mars') {
                drishti.purnDrishti.push(mod12(position + 3));
                drishti.purnDrishti.push(mod12(position + 7));
            }

            if (planet === 'Jupiter') {
                drishti.purnDrishti.push(mod12(position + 4));
                drishti.purnDrishti.push(mod12(position + 8));
            }

            if (planet === 'Saturn') {
                drishti.purnDrishti.push(mod12(position + 2));
                drishti.purnDrishti.push(mod12(position + 9));
            }

            for (let key in drishti) {
                drishti[key] = [...new Set(drishti[key])].sort((a, b) => a - b);
            }

            drishtiData[planet] = drishti;
        }
        return drishtiData;
    };

    const planetPositions = {
        Sun: sunHousePosition,
        Moon: moonHousePosition,
        Mars: marsHousePosition,
        Mercury: mercuryHousePosition,
        Jupiter: jupiterHousePosition,
        Venus: venusHousePosition,
        Saturn: saturnHousePosition,
        Rahu: rahuHousePosition,
        Ketu: ketuHousePosition
    };

    return getPlanetaryDrishti(planetPositions);
};

export const allOtherYogas = ({
    Lagnesh, Dwityesh, Trityesh, Chaturthesh, Panchamesh, Shashthesh, Saptamesh, Ashtamesh, Navamesh, Dashmesh, Ekadashesh, Dwadashesh, LagneshPosition, DwityeshPosition, TrityeshPosition, ChaturtheshPosition, PanchameshPosition, ShashtheshPosition, SaptameshPosition, AshtameshPosition, NavameshPosition, DashmeshPosition, EkadasheshPosition, DwadasheshPosition, sunHousePosition, moonHousePosition, marsHousePosition, mercuryHousePosition, jupiterHousePosition, venusHousePosition, saturnHousePosition, rahuHousePosition, ketuHousePosition, sunRashi, marsRashi, moonRashi, mercuryRashi, jupiterRashi, venusRashi, saturnRashi, rahuRashi, ketuRashi, birthDate, birthTime, sunDristi, moonDristi, marsDristi, mercuryDristi, jupiterDristi, venusDristi, saturnDristi, rahuDristi, ketuDristi, ascendantNumber, //hindiMonths, paksha
}) => {
    const allMessages = [];

    const isNightTime = (birthDate, birthTime) => {
        const fullDateString = `${birthDate}T${birthTime}`;

        const fullDate = new Date(fullDateString);

        const hour = fullDate.getHours();

        if (hour >= 20 || hour < 4) {
            return true;
        }
        return false;
    }

    //1st yogas logic var
    const merc_satdiff = (mercuryHousePosition - saturnHousePosition + 12) % 12;
    const isSaturnDrishtiOn6or12 = saturnDristi?.some(dristi => dristi === 6 || dristi === 12);
    const sun_moondiff = (sunHousePosition - moonHousePosition + 12) % 12;

    // 2nd Logic var
    const allowedHouses = [1, 2, 3, 7, 8, 10, 11];
    const sunFriendsAscNumber = [1, 8, 4, 9, 12];
    const moonjupiterHousePositions = [2, 4, 5, 9, 11];
    const lessTalkingmercury = [4, 8, 12]
    const planetHouses = [sunHousePosition, moonHousePosition, marsHousePosition, mercuryHousePosition, jupiterHousePosition, venusHousePosition, saturnHousePosition, rahuHousePosition, ketuHousePosition];
    const allPlanetsInAllowedHouses = planetHouses.every(house => allowedHouses.includes(house));
    const planetsInAllowedHousesCount = planetHouses.filter(house => allowedHouses.includes(house)).length;

    // 4th Logic var
    const isMoonAndVenusInFirst = moonHousePosition === 1 && moonHousePosition === venusHousePosition;

    // 6th logic var
    const jobYogBhav = [3, 6, 11]
    const dwadasheshGoodHouses = [1, 2, 4, 5, 9, 10];
    const grahaHouses = [moonHousePosition, mercuryHousePosition, jupiterHousePosition, venusHousePosition];
    const hasJobYog = grahaHouses.some(house => jobYogBhav.includes(house));
    const isMarsYog = jobYogBhav.includes(marsHousePosition) && [1, 8].includes(marsRashi);
    const isSaturnYog = jobYogBhav.includes(saturnHousePosition) && [10, 11].includes(saturnRashi);


    // 1st logic
    if (merc_satdiff === 4 && (ShashtheshPosition === 6 || ShashtheshPosition === 8 || ShashtheshPosition === 12)) {
        allMessages.push({
            type: "Low Hearing",
            message: "कम सुनाई देनें का योग।"
        });
    }

    if (venusHousePosition === 12 && mercuryHousePosition === 12) {
        allMessages.push({
            type: "Low Hearing",
            message: "कम सुनाई देनें का योग।"
        });
    }

    if (isNightTime(birthDate, birthTime) && mercuryHousePosition === 6 && venusHousePosition === 10) {
        allMessages.push({
            type: "Low Hearing",
            message: "कम सुनाई देनें का योग।"
        });
    }

    if ((ShashtheshPosition === 6 || ShashtheshPosition === 12) && !isSaturnDrishtiOn6or12) {
        allMessages.push({
            type: "Low Hearing",
            message: "कम सुनाई देनें का योग।"
        });
    }

    // 2nd Logic
    if (allPlanetsInAllowedHouses && planetsInAllowedHousesCount <= 2) {
        allMessages.push({
            number: "1",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (sunFriendsAscNumber.includes(ascendantNumber) && sunHousePosition === moonHousePosition) {
        allMessages.push({
            number: "2",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (moonHousePosition === jupiterHousePosition && moonjupiterHousePositions.includes(moonHousePosition)) {
        allMessages.push({
            number: "3",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (mercuryHousePosition === 5 && [2, 5, 7].includes(ascendantNumber) && moonHousePosition === marsHousePosition && moonHousePosition === 11) {
        allMessages.push({
            number: "4",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if ([3, 6, 8, 11].includes(sun_moondiff) && EkadasheshPosition === 11) {
        allMessages.push({
            number: "5",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (AshtameshPosition === 2 && DwityeshPosition === 8) {
        allMessages.push({
            number: "6",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (ShashtheshPosition === 11 && ShashtheshPosition === EkadasheshPosition) {
        allMessages.push({
            number: "7",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (PanchameshPosition === 5 && EkadasheshPosition === 5 && (rahuHousePosition === 5 || ketuHousePosition === 5)) {
        allMessages.push({
            number: "8",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (Panchamesh === "Venus" && (PanchameshPosition === ShashtheshPosition) && ShashtheshPosition === 11) {
        allMessages.push({
            number: "9",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    if (moonHousePosition === 5 && venusHousePosition === 11) {
        allMessages.push({
            number: "10",
            type: "शेयर बाजार में अच्छे फ़ायदे का योग",
            message: "स्टॉक मार्केट में पैसा लगाने से अच्छा फायदा होगा"
        });
    }

    // 3rd logic
    // if (hindiMonths === "अमावस्या" && lessTalkingmercury.includes(mercuryHousePosition)) {
    //     allMessages.push({
    //         number: "11",
    //         type: "बिना सोचे-समझे बोलने का योग",
    //         message: " या तो ये जातक काम बोलता है या फिर बिना सोचे समझे बोल देता है"
    //     })
    // }

    if (mercuryHousePosition === ShashtheshPosition) {
        allMessages.push({
            number: "12",
            type: "बिना सोचे-समझे बोलने का योग",
            message: "या तो ये जातक काम बोलता है या फिर बिना सोचे समझे बोल देता है"
        })
    }

    if (jupiterHousePosition === ShashtheshPosition && jupiterHousePosition === 1) {
        allMessages.push({
            number: "13",
            type: "बिना सोचे-समझे बोलने का योग",
            message: "या तो ये जातक काम बोलता है या फिर बिना सोचे समझे बोल देता है"
        })
    }


    if (marsHousePosition === saturnHousePosition && (moonHousePosition === rahuHousePosition || moonHousePosition === ketuHousePosition)) {
        allMessages.push({
            number: "14",
            type: "बिना सोचे-समझे बोलने का योग",
            message: "या तो ये जातक काम बोलता है या फिर बिना सोचे समझे बोल देता है"
        })
    }

    // if ((paksha === "शुक्ल पक्ष") && (moonHousePosition === marsHousePosition && moonHousePosition === 1)) {
    //     allMessages.push({
    //         number: "15",
    //         type: "बिना सोचे-समझे बोलने का योग",
    //         message: " या तो ये जातक काम बोलता है या फिर बिना सोचे समझे बोल देता है"
    //     })
    // }

    if (sunHousePosition === mercuryHousePosition && sunRashi === 5) {
        allMessages.push({
            number: "16",
            type: "बिना सोचे-समझे बोलने का योग",
            message: "या तो ये जातक काम बोलता है या फिर बिना सोचे समझे बोल देता है"
        })
    }

    if ((saturnHousePosition === 2 || rahuHousePosition === 2 || ketuHousePosition === 2) && (DwityeshPosition === saturnHousePosition || DwityeshPosition === rahuHousePosition || DwityeshPosition === ketuHousePosition)) {
        allMessages.push({
            number: "17",
            type: "बिना सोचे-समझे बोलने का योग",
            message: "या तो ये जातक काम बोलता है या फिर बिना सोचे समझे बोल देता है"
        })
    }

    // 4th logic
    if (LagneshPosition === 6 && AshtameshPosition === LagneshPosition) {
        allMessages.push({
            number: "18",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        })
    }

    if (venusHousePosition === 6 || venusHousePosition === 8) {
        allMessages.push({
            number: "19",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if (saturnDristi?.includes(venusHousePosition) && (venusHousePosition === 8 || venusHousePosition === 1)) {
        allMessages.push({
            number: "20",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if (moonHousePosition === venusHousePosition && [6, 7, 8, 12].includes(venusHousePosition)) {
        allMessages.push({
            number: "21",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if ((moonHousePosition === venusHousePosition) && (moonHousePosition === 12 || moonHousePosition === 7)) {
        allMessages.push({
            number: "22",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if ((moonHousePosition === marsHousePosition) && (moonHousePosition === 1) && (jupiterDristi?.includes(moonHousePosition) || venusDristi?.includes(moonHousePosition))) {
        allMessages.push({
            number: "23",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if ([5, 9].includes(sunHousePosition) && (saturnDristi?.includes(sunHousePosition) || rahuDristi?.includes(sunHousePosition) || ketuDristi?.includes(sunHousePosition))) {
        allMessages.push({
            number: "24",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if (marsHousePosition === 12 || saturnHousePosition === 2) {
        allMessages.push({
            number: "25",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if ((DwityeshPosition === saturnHousePosition || DwityeshPosition === marsHousePosition) || (DwadasheshPosition === saturnHousePosition || DwadasheshPosition === marsHousePosition)) {
        allMessages.push({
            number: "26",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if ((venusHousePosition === 1 || venusHousePosition === 8) && (saturnDristi?.includes(venusHousePosition) || marsDristi?.includes(venusHousePosition))) {
        allMessages.push({
            number: "27",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if ((DwityeshPosition === moonHousePosition && isMoonAndVenusInFirst) ||
        (DwadasheshPosition === moonHousePosition && isMoonAndVenusInFirst)) {
        allMessages.push({
            number: "28",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    if ((moonRashi === 5 && moonHousePosition === 7 && marsDristi?.includes(moonHousePosition)) || (sunRashi === 4 && sunHousePosition === 7 && marsDristi?.includes(sunHousePosition))) {
        allMessages.push({
            number: "29",
            type: "किसी भी प्रकार की आंखों की समस्या",
            message: "इस योग के कारण आंखों में चश्मा लगना या आंखे लाल रहना या किसी ना किसी प्रकार की आंखों में दिक्कत रहती है"
        });
    }

    // 5th logic
    if (marsHousePosition === saturnHousePosition && marsHousePosition === 1) {
        allMessages.push({
            number: "30",
            type: "comfort/pleasure concern",
            message: "Always have health concern"
        })
    }

    if (ShashtheshPosition === 6 || DwadasheshPosition === 12) {
        allMessages.push({
            number: "31",
            type: "comfort/pleasure concern",
            message: "absence of comfort/pleasure"
        })
    }

    // 6th logic
    if (dwadasheshGoodHouses.includes(DwadasheshPosition) && hasJobYog) {
        allMessages.push({
            number: "32",
            type: "job",
            message: "job yoga in deewani mekhma"
        });
    }

    if (dwadasheshGoodHouses.includes(DwadasheshPosition) && (isMarsYog || isSaturnYog)) {
        allMessages.push({
            number: "33",
            type: "job",
            message: "job yog in police department"
        });
    }

    return allMessages;

}