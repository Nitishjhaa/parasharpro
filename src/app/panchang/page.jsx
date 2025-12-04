import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';

/**
 * Function to reliably load Panchang data from a local JSON file
 * using Node.js filesystem APIs. This is necessary for Next.js Server Components
 * deployed on platforms like Vercel, as fetching local files via HTTP often fails.
 * Assumes the file is at /public/data/panchang.json
 */
async function getPanchang() {
  try {
    // Determine the absolute path to the JSON file:
    // process.cwd() is the project root (e.g., your-project/)
    const filePath = path.join(process.cwd(), 'public', 'data', 'panchang.json');

    // Read the file content asynchronously
    const fileContents = await fs.readFile(filePath, 'utf8');
    
    // Parse the JSON string into a JavaScript object
    return JSON.parse(fileContents);

  } catch (error) {
    // Log the full error to the server console for debugging
    console.error("🚨 Error loading Panchang data from file system:", error);
    
    // Return a structured error object for the component to display
    return { 
      error: "Failed to load Panchang data from file system. Check server logs." 
    };
  }
}

export default async function PanchangPage() {
  const data = await getPanchang();
  
  // Check for the error object to display a helpful message to the user
  if (data.error) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Panchang Loading Error</h1>
        <p className="text-lg mb-4">
          A server error occurred while trying to read the Panchang data file. 
          Please ensure `data/panchang.json` exists in your `public` directory.
        </p>
        <div className="bg-red-900 p-4 rounded text-sm text-white overflow-x-auto">
          <pre className="whitespace-pre-wrap">
            {data.error}
          </pre>
        </div>
        <Link href="/" className="text-blue-600 hover:underline text-lg mt-6 block">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Panchang Details</h1>

      <div className="bg-black p-4 rounded mb-6 overflow-x-auto">
        <pre className="whitespace-pre-wrap text-sm text-white">
          {JSON.stringify(data, null, 4)}
        </pre>
      </div>

      <div className="flex justify-between">
        <Link href="/" className="text-blue-600 hover:underline text-lg">
          ← Back to Home
        </Link>
        <Link href="/panchang/admin" className="text-blue-600 hover:underline text-lg">
          go to admin
        </Link>
      </div>
    </div>
  );
}