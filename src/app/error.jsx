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
           
            <img src="/images/error.png" alt="" />
            <p className='text-gray-600 mb-8 max-w-md'>
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className='px-6 py-3 bg-linear-to-r from-[#5AC1D6] to-[#FBF5AE] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium'
            >
                Try again
            </button>
        </div>
    );
}
