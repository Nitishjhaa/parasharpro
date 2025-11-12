import Link from 'next/link';

export default function ChildPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">This is the Child Page</h1>
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
