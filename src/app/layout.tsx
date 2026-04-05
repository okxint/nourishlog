import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "NourishLog",
  description: "Track what you eat, beautifully.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <main className="flex-1 max-w-md mx-auto w-full pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
