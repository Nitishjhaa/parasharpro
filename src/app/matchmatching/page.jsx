import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='w-[98%] mx-auto min-h-screen p-2'>
      <div className="rounded-3xl overflow-hidden mb-4">
        <div className="card-bg p-5 flex gap-4 items-center">
          <img
            src="/images/kundaliHead.png"
            className={`rotate-180 transition-all duration-300 w-12 brightness-0 invert`}
          />
          <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-xl">
            Matching Type
          </span>
        </div>
      </div>

      <div className='mt-5 card-bg min-h-[80vh] rounded-2xl p-2'>
        <div className='flex flex-col gap-5'>
          <div className='relative w-full h-20 rounded-2xl card-bg border border-white/40 p-2 pl-5 '>
            <Link className='text-xl' href="/matchmatching/byBirth">
              By Birth
              <img src="/images/mmb.png" alt="" className="w-20 h-20 absolute bottom-0 right-0" />
            </Link>
          </div>
          <div className='relative w-full h-20 rounded-2xl card-bg border border-white/40 p-2 pl-5 '>
            <Link className='text-xl' href="/matchmatching/byName">
              By Name
              <img src="/images/mmn.png" alt="" className="w-20 h-20 absolute bottom-0 right-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page