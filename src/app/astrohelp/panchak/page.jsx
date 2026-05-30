export const panchakInfo = {
    title: "पंचक नक्षत्र",

    description:
        "जब चंद्रमा धनिष्ठा नक्षत्र के उत्तरार्ध से लेकर शतभिषा, पूर्व भाद्रपदा, उत्तर भाद्रपदा और रेवती नक्षत्र तक भ्रमण करता है, तब उस अवधि को पंचक कहा जाता है। ज्योतिष शास्त्र में पंचक को विशेष विचारणीय काल माना गया है। इस दौरान कुछ कार्यों को करने से बचने की सलाह दी जाती है, जबकि कई सामान्य एवं शुभ कार्य किए जा सकते हैं।",

    nakshatras: [
        "धनिष्ठा (उत्तरार्ध)",
        "शतभिषा",
        "पूर्व भाद्रपदा",
        "उत्तर भाद्रपदा",
        "रेवती",
    ],

    avoidWorks: [
        "घर की छत डालना",
        "लकड़ी का संग्रह करना",
        "चारपाई या पलंग बनवाना",
        "दक्षिण दिशा की यात्रा करना",
        "अंत्येष्टि संबंधी कुछ विशेष कार्य",
        "बड़े निर्माण कार्यों की शुरुआत",
    ],

    allowedWorks: [
        "पूजा-पाठ एवं धार्मिक कार्य",
        "मंत्र जाप एवं साधना",
        "दैनिक व्यापारिक कार्य",
        "शिक्षा एवं अध्ययन",
        "सामान्य यात्रा",
        "दान-पुण्य एवं सेवा कार्य",
        "ग्रह शांति एवं आध्यात्मिक कार्य",
    ],

    note:
        "पंचक के प्रभाव का विचार क्षेत्रीय परंपराओं एवं विभिन्न ज्योतिषीय मतों के अनुसार भिन्न हो सकता है। किसी विशेष कार्य के लिए संपूर्ण मुहूर्त का विचार करना अधिक उचित माना जाता है।",
};


export default function PanchakPage() {
    return (
        <div className="bg-yellow-200 max-w-6xl mx-auto p-6">
            <h2 className="text-black text-2xl font-bold text-center ">
                पंचक नक्षत्र
            </h2>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="rounded-3xl border bg-white p-6 shadow-sm mb-4">
                    <h1 className="text-xl font-bold text-black mb-4">
                        {panchakInfo.title}
                    </h1>

                    <p className="text-gray-700 leading-8">
                        {panchakInfo.description}
                    </p>
                </div>

                {/* Panchak Nakshatras */}
                <div className="rounded-3xl border bg-white p-6 shadow-sm mb-4">
                    <h2 className="text-xl font-semibold mb-4 text-black">
                        पंचक में आने वाले नक्षत्र
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {panchakInfo.nakshatras.map((nakshatra) => (
                            <span
                                key={nakshatra}
                                className="px-3 py-2 rounded-full border bg-orange-50 text-black"
                            >
                                {nakshatra}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Avoid */}
                <div className="rounded-3xl border bg-white p-6 shadow-sm mb-4">
                    <h2 className="text-xl font-semibold text-black mb-4">
                        पंचक में वर्जित माने जाने वाले कार्य
                    </h2>

                    <ul className="space-y-3">
                        {panchakInfo.avoidWorks.map((work) => (
                            <li key={work} className="flex gap-3 text-black">
                                <span>- {work}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Allowed */}
                <div className="rounded-3xl border bg-white p-6 shadow-sm mb-4">
                    <h2 className="text-xl font-semibold text-black mb-4">
                        पंचक में किए जा सकने वाले कार्य
                    </h2>

                    <ul className="space-y-3">
                        {panchakInfo.allowedWorks.map((work) => (
                            <li key={work} className="flex gap-3 text-black">
                                <span>- {work}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Note */}
                <div className="rounded-3xl border-l-4 border-orange-500 bg-orange-50 p-5">
                    <p className="leading-7 text-black">
                        <strong>विशेष सूचना:</strong> {panchakInfo.note}
                    </p>
                </div>
            </div>
        </div>
    );
}