import type { ReactNode } from "react";
import "./marketplace.css";

export default function MarketplaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="marketplace-root">
      {children}
    </div>
  );
}