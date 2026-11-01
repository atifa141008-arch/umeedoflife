import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Umeed of Life",
  description:
    "Umeed of Life — Building hope, empowering lives and creating a better tomorrow through commerce, opportunities, welfare and global connections.",
  keywords: [
    "Umeed of Life",
    "Umeed",
    "Marketplace",
    "Essentials",
    "Welfare",
    "WorkHub",
    "Global",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}