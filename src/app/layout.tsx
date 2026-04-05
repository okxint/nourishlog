import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NourishLog — AI Food Tracker for India",
  description: "Track your meals with AI. Snap a photo or just chat. Built for Indian food lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
