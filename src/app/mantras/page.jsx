import React from 'react'

const page = () => {
    return (
        <div className="max-md:block hidden pb-10 pt-2">
            <div className="mx-auto w-[98%] min-h-screen">
                <div className="flex flex-col gap-3 h-fit">
                    <div className="flex-[0.5] rounded-3xl overflow-hidden">
                        <div className="card-bg w-full h-full flex justify-between items-center p-3">
                            <div className=" text-2xl flex gap-5 items-center w-full mr-3 rounded-3xl">
                                <img src='images/kundaliHead.png' className="w-15" />
                                <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent">
                                    मंत्र और स्तोत्र
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-3 rounded-3xl overflow-hidden dark:bg-[#232323] bg-[#dedede] p-3">
                        <div className='card-bg p-2'>
                            <div className='grid grid-cols-2 gap-3'>
                                <div className="border border-white/20 p-2 rounded-lg">
                                    <div className='text-xs font-bold'>
                                        <a href="/data/strotraAndMantra/adityahriday.pdf">आदित्य हृदय स्तोत्र </a>
                                    </div>
                                </div>
                                <div className="border border-white/20 p-2 rounded-lg">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default page