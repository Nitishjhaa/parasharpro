import React from 'react'
import Link from 'next/link'
import { div } from 'framer-motion/client'

const page = () => {


    return (

        <div className='bg-black/90 h-screen p-2'>
            <div className="rounded-3xl overflow-hidden mb-4">
                <div className="card-bg p-5 flex gap-4 items-center shadow-md">
                    <img src="/images/kundaliHead.png" className="w-12 rotate-180 brightness-0 invert-100" alt="Yog Logo" />
                    <div className="flex flex-col">
                        <span className="bg-linear-to-l from-[#F26A20] to-red-600 bg-clip-text text-transparent text-xl">
                            Astrological Info
                        </span>
                    </div>
                </div>
            </div>

            <div className='mx-auto pt-1'>
                <div className='flex max-md:flex-col flex-row gap-5'>
                    <Link href="/astrohelp/sangya">
                        <div className='card-bg rounded-xl! border-white/80 border'>
                            <div className='py-3 pl-2'>
                                <div className='text-white'>
                                    नक्षत्र संज्ञा
                                </div>

                            </div>
                        </div>
                    </Link>

                    <Link href="/astrohelp/panchak">
                        <div className='card-bg rounded-xl! border-white/80 border'>
                            <div className='py-3 pl-2'>
                                <div className='text-white'>
                                    पंचक नक्षत्र
                                </div>

                            </div>
                        </div>
                    </Link>

                    <Link href="/astrohelp/yog">
                        <div className='card-bg rounded-xl! border-white/80 border'>
                            <div className='py-3 pl-2'>
                                <div className='text-white'>
                                    योग और दोष
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