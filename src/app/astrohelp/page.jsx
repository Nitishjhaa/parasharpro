import React from 'react'
import Link from 'next/link'
import { div } from 'framer-motion/client'

const page = () => {


    return (

        <div className='bg-gray-400 h-screen p-2'>
            <div className="rounded-3xl overflow-hidden mb-4">
                <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center shadow-md">
                    <img src="/images/kundaliHead.png" className="w-12 brightness-0" alt="Yog Logo" />
                    <div className="flex flex-col">
                        <span className="bg-linear-to-l from-[#F26A20] to-red-600 bg-clip-text text-transparent text-2xl font-bold">
                            Astrological Info
                        </span>
                    </div>
                </div>
            </div>

            <div className='max-w-[95%] mx-auto pt-3'>
                <div className='flex max-md:flex-col flex-row gap-5'>
                    <Link href="/astrohelp/sangya">
                        <div className='bg-white rounded-xl '>
                            <div className='py-3 pl-2'>
                                <div className='text-black'>
                                    नक्षत्र संज्ञा
                                </div>

                            </div>
                        </div>
                    </Link>

                    <Link href="/astrohelp/panchak">
                        <div className='bg-white rounded-xl '>
                            <div className='py-3 pl-2'>
                                <div className='text-black'>
                                    पंचक नक्षत्र
                                </div>

                            </div>
                        </div>
                    </Link>

                    <Link href="/astrohelp/yog">
                        <div className='bg-white rounded-xl '>
                            <div className='py-3 pl-2'>
                                <div className='text-black'>
                                    योग
                                </div>

                            </div>
                        </div>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default page