"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ReportClient = dynamic(() => import("./ReportClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray">
      <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
    </div>
  ),
});

export default function Page() {
  return <ReportClient />;
}