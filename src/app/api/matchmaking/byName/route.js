import { NextResponse } from 'next/server';
import {
    getVarna,
    getVashya,
    getYoni,
    getNaadi,
    calculateGunMilanScore,
    calculateTaraPoints
} from '@/app/matchmatching/MatchUtils';

// Syllable to Nakshatra and Rashi mapping
// Based on common Vedic Astrology standards
const syllableMap = {
    // Mesha (Aries) - Ashwini, Bharani, Krittika
    'चु': { nakshatra: 'Ashwini', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 0, grahaMaitri: 'मंगल', gana: 'देव' },
    'CHU': { nakshatra: 'Ashwini', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 0, grahaMaitri: 'मंगल', gana: 'देव' },
    'CH': { nakshatra: 'Ashwini', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 0, grahaMaitri: 'मंगल', gana: 'देव' },
    'ला': { nakshatra: 'Ashwini', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 0, grahaMaitri: 'मंगल', gana: 'देव' },
    'LA': { nakshatra: 'Ashwini', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 0, grahaMaitri: 'मंगल', gana: 'देव' },
    'ली': { nakshatra: 'Bharani', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 1, grahaMaitri: 'मंगल', gana: 'मनुष्य' },
    'LI': { nakshatra: 'Bharani', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 1, grahaMaitri: 'मंगल', gana: 'मनुष्य' },
    'अ': { nakshatra: 'Krittika', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 2, grahaMaitri: 'मंगल', gana: 'दानव' },
    'A': { nakshatra: 'Krittika', rashi: 'मेष', rashiIndex: 0, nakshatraIndex: 2, grahaMaitri: 'मंगल', gana: 'दानव' },

    // Vrishabha (Taurus) - Krittika, Rohini, Mrigashira
    'इ': { nakshatra: 'Krittika', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 2, grahaMaitri: 'शुक्र', gana: 'दानव' },
    'I': { nakshatra: 'Krittika', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 2, grahaMaitri: 'शुक्र', gana: 'दानव' },
    'ओ': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },
    'O': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },
    'वा': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },
    'VA': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },
    'वी': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },
    'VI': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },
    'व': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },
    'V': { nakshatra: 'Rohini', rashi: 'वृष', rashiIndex: 1, nakshatraIndex: 3, grahaMaitri: 'शुक्र', gana: 'मनुष्य' },

    // Mithuna (Gemini) - Mrigashira, Ardra, Punarvasu
    'का': { nakshatra: 'Mrigashira', rashi: 'मिथुन', rashiIndex: 2, nakshatraIndex: 4, grahaMaitri: 'बुध', gana: 'देव' },
    'KA': { nakshatra: 'Mrigashira', rashi: 'मिथुन', rashiIndex: 2, nakshatraIndex: 4, grahaMaitri: 'बुध', gana: 'देव' },
    'के': { nakshatra: 'Punarvasu', rashi: 'मिथुन', rashiIndex: 2, nakshatraIndex: 6, grahaMaitri: 'बुध', gana: 'देव' },
    'KE': { nakshatra: 'Punarvasu', rashi: 'मिथुन', rashiIndex: 2, nakshatraIndex: 6, grahaMaitri: 'बुध', gana: 'देव' },
    'क': { nakshatra: 'Mrigashira', rashi: 'मिथुन', rashiIndex: 2, nakshatraIndex: 4, grahaMaitri: 'बुध', gana: 'देव' },
    'K': { nakshatra: 'Mrigashira', rashi: 'मिथुन', rashiIndex: 2, nakshatraIndex: 4, grahaMaitri: 'बुध', gana: 'देव' },

    // Karka (Cancer) - Punarvasu, Pushya, Ashlesha
    'ही': { nakshatra: 'Punarvasu', rashi: 'कर्क', rashiIndex: 3, nakshatraIndex: 6, grahaMaitri: 'चन्द्र', gana: 'देव' },
    'HI': { nakshatra: 'Punarvasu', rashi: 'कर्क', rashiIndex: 3, nakshatraIndex: 6, grahaMaitri: 'चन्द्र', gana: 'देव' },
    'हु': { nakshatra: 'Pushya', rashi: 'कर्क', rashiIndex: 3, nakshatraIndex: 7, grahaMaitri: 'चन्द्र', gana: 'देव' },
    'HU': { nakshatra: 'Pushya', rashi: 'कर्क', rashiIndex: 3, nakshatraIndex: 7, grahaMaitri: 'चन्द्र', gana: 'देव' },
    'ह': { nakshatra: 'Punarvasu', rashi: 'कर्क', rashiIndex: 3, nakshatraIndex: 6, grahaMaitri: 'चन्द्र', gana: 'देव' },
    'H': { nakshatra: 'Punarvasu', rashi: 'कर्क', rashiIndex: 3, nakshatraIndex: 6, grahaMaitri: 'चन्द्र', gana: 'देव' },

    // Simha (Leo) - Magha, Purva Phalguni, Uttara Phalguni
    'मा': { nakshatra: 'Magha', rashi: 'सिंह', rashiIndex: 4, nakshatraIndex: 9, grahaMaitri: 'सूर्य', gana: 'दानव' },
    'MA': { nakshatra: 'Magha', rashi: 'सिंह', rashiIndex: 4, nakshatraIndex: 9, grahaMaitri: 'सूर्य', gana: 'दानव' },
    'म': { nakshatra: 'Magha', rashi: 'सिंह', rashiIndex: 4, nakshatraIndex: 9, grahaMaitri: 'सूर्य', gana: 'दानव' },
    'M': { nakshatra: 'Magha', rashi: 'सिंह', rashiIndex: 4, nakshatraIndex: 9, grahaMaitri: 'सूर्य', gana: 'दानव' },

    // Kanya (Virgo) - Uttara Phalguni, Hasta, Chitra
    'पा': { nakshatra: 'UttaraPhalguni', rashi: 'कन्या', rashiIndex: 5, nakshatraIndex: 11, grahaMaitri: 'बुध', gana: 'मनुष्य' },
    'PA': { nakshatra: 'UttaraPhalguni', rashi: 'कन्या', rashiIndex: 5, nakshatraIndex: 11, grahaMaitri: 'बुध', gana: 'मनुष्य' },
    'प': { nakshatra: 'UttaraPhalguni', rashi: 'कन्या', rashiIndex: 5, nakshatraIndex: 11, grahaMaitri: 'बुध', gana: 'मनुष्य' },
    'P': { nakshatra: 'UttaraPhalguni', rashi: 'कन्या', rashiIndex: 5, nakshatraIndex: 11, grahaMaitri: 'बुध', gana: 'मनुष्य' },
    'ष': { nakshatra: 'Hasta', rashi: 'कन्या', rashiIndex: 5, nakshatraIndex: 12, grahaMaitri: 'बुध', gana: 'देव' },
    'SH': { nakshatra: 'Hasta', rashi: 'कन्या', rashiIndex: 5, nakshatraIndex: 12, grahaMaitri: 'बुध', gana: 'देव' },

    // Tula (Libra) - Chitra, Swati, Vishakha
    'रा': { nakshatra: 'Chitra', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 13, grahaMaitri: 'शुक्र', gana: 'दानव' },
    'RA': { nakshatra: 'Chitra', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 13, grahaMaitri: 'शुक्र', gana: 'दानव' },
    'री': { nakshatra: 'Chitra', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 13, grahaMaitri: 'शुक्र', gana: 'दानव' },
    'RI': { nakshatra: 'Chitra', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 13, grahaMaitri: 'शुक्र', gana: 'दानव' },
    'रू': { nakshatra: 'Swati', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 14, grahaMaitri: 'शुक्र', gana: 'देव' },
    'RU': { nakshatra: 'Swati', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 14, grahaMaitri: 'शुक्र', gana: 'देव' },
    'र': { nakshatra: 'Swati', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 14, grahaMaitri: 'शुक्र', gana: 'देव' },
    'R': { nakshatra: 'Swati', rashi: 'तुला', rashiIndex: 6, nakshatraIndex: 14, grahaMaitri: 'शुक्र', gana: 'देव' },

    // Vrishchika (Scorpio) - Vishakha, Anuradha, Jyeshtha
    'न': { nakshatra: 'Anuradha', rashi: 'वृश्चिक', rashiIndex: 7, nakshatraIndex: 16, grahaMaitri: 'मंगल', gana: 'देव' },
    'N': { nakshatra: 'Anuradha', rashi: 'वृश्चिक', rashiIndex: 7, nakshatraIndex: 16, grahaMaitri: 'मंगल', gana: 'देव' },
    'य': { nakshatra: 'Jyeshtha', rashi: 'वृश्चिक', rashiIndex: 7, nakshatraIndex: 17, grahaMaitri: 'मंगल', gana: 'दानव' },
    'Y': { nakshatra: 'Jyeshtha', rashi: 'वृश्चिक', rashiIndex: 7, nakshatraIndex: 17, grahaMaitri: 'मंगल', gana: 'दानव' },

    // Dhanu (Sagittarius) - Mula, Purva Ashadha, Uttara Ashadha
    'भा': { nakshatra: 'Mula', rashi: 'धनु', rashiIndex: 8, nakshatraIndex: 18, grahaMaitri: 'गुरु', gana: 'दानव' },
    'BHA': { nakshatra: 'Mula', rashi: 'धनु', rashiIndex: 8, nakshatraIndex: 18, grahaMaitri: 'गुरु', gana: 'दानव' },
    'भ': { nakshatra: 'Mula', rashi: 'धनु', rashiIndex: 8, nakshatraIndex: 18, grahaMaitri: 'गुरु', gana: 'दानव' },
    'B': { nakshatra: 'Mula', rashi: 'धनु', rashiIndex: 8, nakshatraIndex: 18, grahaMaitri: 'गुरु', gana: 'दानव' },

    // Makara (Capricorn) - Uttara Ashadha, Shravana, Dhanishta
    'ज': { nakshatra: 'UttaraAshadha', rashi: 'मकर', rashiIndex: 9, nakshatraIndex: 20, grahaMaitri: 'शनि', gana: 'मनुष्य' },
    'J': { nakshatra: 'UttaraAshadha', rashi: 'मकर', rashiIndex: 9, nakshatraIndex: 20, grahaMaitri: 'शनि', gana: 'मनुष्य' },
    'ख': { nakshatra: 'Shravana', rashi: 'मकर', rashiIndex: 9, nakshatraIndex: 21, grahaMaitri: 'शनि', gana: 'देव' },
    'KH': { nakshatra: 'Shravana', rashi: 'मकर', rashiIndex: 9, nakshatraIndex: 21, grahaMaitri: 'शनि', gana: 'देव' },

    // Kumbha (Aquarius) - Dhanishta, Shatabhisha, Purva Bhadrapada
    'स': { nakshatra: 'Shatabhisha', rashi: 'कुंभ', rashiIndex: 10, nakshatraIndex: 23, grahaMaitri: 'शनि', gana: 'दानव' },
    'S': { nakshatra: 'Shatabhisha', rashi: 'कुंभ', rashiIndex: 10, nakshatraIndex: 23, grahaMaitri: 'शनि', gana: 'दानव' },
    'द': { nakshatra: 'PurvaBhadrapada', rashi: 'कुंभ', rashiIndex: 10, nakshatraIndex: 24, grahaMaitri: 'शनि', gana: 'मनुष्य' },
    'D': { nakshatra: 'PurvaBhadrapada', rashi: 'कुंभ', rashiIndex: 10, nakshatraIndex: 24, grahaMaitri: 'शनि', gana: 'मनुष्य' },

    // Meena (Pisces) - Purva Bhadrapada, Uttara Bhadrapada, Revati
    'दी': { nakshatra: 'PurvaBhadrapada', rashi: 'मीन', rashiIndex: 11, nakshatraIndex: 24, grahaMaitri: 'गुरु', gana: 'मनुष्य' },
    'DI': { nakshatra: 'PurvaBhadrapada', rashi: 'मीन', rashiIndex: 11, nakshatraIndex: 24, grahaMaitri: 'गुरु', gana: 'मनुष्य' },
};

function getAstroData(name) {
    if (!name) return null;

    const upperName = name.toUpperCase();

    let syllable = upperName.substring(0, 3);
    let data = syllableMap[syllable];

    if (!data) {
        syllable = upperName.substring(0, 2);
        data = syllableMap[syllable];
    }

    if (!data) {
        syllable = upperName.substring(0, 1);
        data = syllableMap[syllable];
    }
    if (!data) {
        syllable = name.substring(0, 2);
        data = syllableMap[syllable];
        if (!data) {
            syllable = name.substring(0, 1);
            data = syllableMap[syllable];
        }
    }

    if (!data) {
        data = syllableMap['A'];
    }

    return {
        ...data,
        varna: getVarna(data.rashiIndex),
        vashya: getVashya(data.rashiIndex),
        yoni: getYoni(data.nakshatraIndex),
        nadi: getNaadi(data.nakshatraIndex),
        bhakoot: data.rashi,
    };
}

export async function POST(req) {
    try {
        const { boyName, girlName } = await req.json();
        console.log(boyName, girlName)

        if (!boyName || !girlName) {
            return NextResponse.json({ error: 'Boy name and Girl name are required' }, { status: 400 });
        }

        const boyData = getAstroData(boyName);
        const girlData = getAstroData(girlName);

        if (!boyData || !girlData) {
            return NextResponse.json({ error: 'Astrological data not found for these names' }, { status: 404 });
        }

        const gunMilan = calculateGunMilanScore(boyData, girlData);
        const tara = calculateTaraPoints(girlData.nakshatra, boyData.nakshatra);

        const result = {
            boy: {
                name: boyName,
                ...boyData
            },
            girl: {
                name: girlName,
                ...girlData
            },
            gunMilan,
            tara,
            totalScore: gunMilan.totalScore
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Matchmaking error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
