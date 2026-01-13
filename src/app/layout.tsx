import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plagiarism Detector - Fingerprinting via Hashing",
  description: "Advanced plagiarism detection using discrete mathematics concepts: hashing, set theory, and Jaccard similarity",
  keywords: ["plagiarism detection", "discrete mathematics", "hashing", "set theory", "fingerprinting"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
