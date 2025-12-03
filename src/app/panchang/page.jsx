import Link from "next/link";

async function getPanchang() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"; // fallback for dev mode

  const res = await fetch(`${baseUrl}/data/panchang.json`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { error: "Failed to load Panchang data" };
  }

  return res.json();
}

export default async function PanchangPage() {
  const data = await getPanchang();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Panchang Details</h1>

      <div className="bg-black p-4 rounded mb-6 overflow-x-auto">
        <pre className="whitespace-pre-wrap text-sm">
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
