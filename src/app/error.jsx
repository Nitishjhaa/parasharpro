"use client";

import { useEffect } from "react";
import { FaBug } from "react-icons/fa";

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center'>
            <div className='mb-6 text-red-600 text-6xl'>
                <FaBug />
            </div>
            <h2 className='text-3xl font-bold mb-4 bg-linear-to-r from-red-600 to-red-900 bg-clip-text text-transparent'>
                Something went wrong!
            </h2>
            <p className='text-gray-600 mb-8 max-w-md'>
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className='px-6 py-3 bg-linear-to-r from-[#104072] to-[#070D1E] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium'
            >
                Try again
            </button>
        </div>
    );
}
