"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AstaInner from "./AstaInner";

export default function KundaliInfoPage() {
  return (
    <Suspense fallback={<div className="p-4 text-white">Loading...</div>}>
      <AstaInner />
    </Suspense>
  );
}
