import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center'>
            <div className='mb-6 text-[#104072] text-6xl'>
                <FaExclamationTriangle />
            </div>
            <h2 className='text-3xl font-bold mb-4 bg-linear-to-r from-[#104072] to-[#070D1E] bg-clip-text text-transparent'>
                404 - Page Not Found
            </h2>
            <p className='text-gray-600 mb-8 max-w-md'>
                Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your spelling.
            </p>
            <Link
                href='/'
                className='px-6 py-3 bg-linear-to-r from-[#104072] to-[#070D1E] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium'
            >
                Return Home
            </Link>
        </div>
    );
}
