import React from 'react'

const page = () => {

    const stotram = [
        {
            name: "आदित्य हृदय स्तोत्र",
            link: "/data/strotraAndMantra/adityahriday.pdf"
        },
        {
            name: "दुर्गाष्टोत्तरशतनाम स्तोत्रम्",
            link: "/data/strotraAndMantra/durga108.pdf"
        },
        {
            name: "श्री सूक्तम्",
            link: "/data/strotraAndMantra/shreesukta.pdf"
        },
        {
            name: "पुरुष सूक्तम",
            link: "/data/strotraAndMantra/purushsukta.pdf"
        },
        {
            name: "स्वस्तिवाचन",
            link: "/data/strotraAndMantra/svastivachan.pdf"
        },
    ]







    return (
        <div className="max-md:block hidden pb-10 pt-2">
            <div className="mx-auto w-[98%] min-h-screen">
                <div className="flex flex-col gap-3 h-fit">
                    <div className="flex-[0.5] rounded-xl overflow-hidden">
                        <div className="card-bg w-full h-full flex justify-between items-center p-3">
                            <div className=" text-2xl flex gap-5 items-center w-full mr-3 rounded-xl">
                                <img src='images/kundaliHead.png' className="w-15" />
                                <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent">
                                    मंत्र और स्तोत्र
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-3 rounded-xl overflow-hidden dark:bg-[#232323] bg-[#dedede] p-3">
                        <div className='card-bg p-2 rounded-xl!'>
                            <div className='grid grid-cols-2 gap-3'>
                                {
                                    stotram.map((item, index) => (
                                        <div className="border border-white/20 p-2 rounded-lg">
                                            <div className='text-xs font-bold'>
                                                <a href={item.link}>{item.name}</a>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default page