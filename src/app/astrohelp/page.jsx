import React from 'react'
import Link from 'next/link'
import { div } from 'framer-motion/client'

const page = () => {


    return (

        <div className='bg-amber-200 h-screen'>

            <div className='max-w-[90%] mx-auto pt-7'>
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