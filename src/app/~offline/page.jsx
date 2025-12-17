import React from 'react';
import Head from 'next/head';

const OfflinePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
            <Head>
                <title>You are offline - Parashar Pro</title>
            </Head>
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <h1 className="text-4xl font-bold mb-4 text-red-500">You are offline</h1>
                <p className="text-lg mb-6">
                    It seems you have lost your internet connection.
                    Some features may not be available, but you can still access previously visited pages.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    Retry
                </button>
            </div>
        </div>
    );
};

export default OfflinePage;
