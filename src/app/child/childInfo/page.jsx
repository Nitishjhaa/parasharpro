"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ChildKundaliInfoInner from "./ChildKundaliInfoInner";

export default function ChildKundaliInfoPage() {
  return (
    <Suspense fallback={<div className="p-4 text-white">Loading...</div>}>
      <ChildKundaliInfoInner />
    </Suspense>
  );
}
