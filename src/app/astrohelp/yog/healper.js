function evaluateGuruPushya(weekdayIdx, nakshatra) {
    return {
        present: weekdayIdx === 4 && nakshatra === "Pushya",
        name: "गुरु पुष्य",
        effects:
            "यह अत्यंत शुभ योग माना जाता है। इसमें शिक्षा, धन निवेश, व्यापार आरंभ, वाहन खरीद और आध्यात्मिक कार्य शुभ माने जाते हैं।"
    };
}

function evaluateRaviPushya(weekdayIdx, nakshatra) {
    return {
        present: weekdayIdx === 0 && nakshatra === "Pushya",
        name: "रवि पुष्य",
        effects:
            "यह योग धार्मिक कार्यों, दान, पूजा-पाठ और आध्यात्मिक साधना, संपत्ति खरीद, व्यापार विस्तार, सरकारी कार्य और नए कार्यों की शुरुआत के लिए श्रेष्ठ माना जाता है।"
    };
}

function evaluateSarvarthaSiddhi(weekdayIdx, nakshatra) {
    const rules = {
        0: ["Hasta", "Mula", "UttaraPhalguni"],
        1: ["Rohini", "Mrigashira", "Pushya"],
        2: ["Ashwini", "UttaraBhadrapada", "Krittika"],
        3: ["Rohini", "Anuradha", "Hasta"],
        4: ["Pushya", "Punarvasu", "Revati"],
        5: ["Anuradha", "Revati", "Ashwini"],
        6: ["Rohini", "Swati", "Shravana"]
    };

    return {
        present: (rules[weekdayIdx] || []).includes(nakshatra),
        name: "सर्वार्थ सिद्धि",
        effects:
            "इस योग में किए गए कार्यों में सफलता मिलने की संभावना अधिक होती है"
    };
}

function evaluateAmritSiddhi(weekdayIdx, nakshatra) {
    const rules = {
        0: "Hasta",
        1: "Mrigashira",
        2: "Ashwini",
        3: "Anuradha",
        4: "Pushya",
        5: "Revati",
        6: "Rohini"
    };

    return {
        present: rules[weekdayIdx] === nakshatra,
        name: "अमृत सिद्धि",
        effects:
            "इस योग को बहुत शुभ माना जाता है। इस योग में किए गए सभी कार्य सफल होते हैं।"
    };
}

function evaluateRaviYoga(weekdayIdx, nakshatra) {
    return {
        present:
            weekdayIdx === 0 &&
            ["Hasta", "Ashwini", "Mrigashira", "Pushya", "Revati"].includes(
                nakshatra
            ),
        name: "रवि योग",
        effects:
            "अनेक दोषों का नाश करने वाला तथा सफलता प्रदान करने वाला शुभ योग माना जाता है।",
    };
}

function evaluatePanchak(nakshatra) {
    const map = {
        Dhanishta: "रोग पंचक",
        Shatabhisha: "अग्नि पंचक",
        PurvaBhadrapada: "राज पंचक",
        UttaraBhadrapada: "चोर पंचक",
        Revati: "मृत्यु पंचक"
    };

    return {
        present: !!map[nakshatra],
        type: map[nakshatra] || null,
        definition:
            "धनिष्ठा के उत्तरार्ध से रेवती नक्षत्र तक की अवधि को पंचक कहा जाता है।",
        effects:
            "इस पंचक में किसी भी शुभ कार्य को करने से बचने की सलाह दी जाती है। खासकर किसी व्यक्ति के दाह संस्कार में विशेष ध्यान रखने का विधान है, ताकि नकारात्मक प्रभाव को कम किया जा सके।"
    };
}

export { evaluateGuruPushya, evaluateRaviPushya, evaluateSarvarthaSiddhi, evaluateAmritSiddhi, evaluateRaviYoga, evaluatePanchak };