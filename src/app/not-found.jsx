import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center'>
            <img src="/images/404.png" alt="" />
            <p className='text-yellow-500 mb-8 max-w-md'>
                Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your spelling.
            </p>
            <Link
                href='/'
                className='px-6 py-3 bg-linear-to-r from-[#5AC1D6] to-[#FBF5AE] text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium'
            >
                Return Home
            </Link>
        </div>
    );
}
