import { Suspense, type ReactNode } from "react";
import VendorShell from "@/components/marketplace/VendorShell";

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf7f5]" aria-label="Loading Seller Center" />}>
      <VendorShell>{children}</VendorShell>
    </Suspense>
  );
}
