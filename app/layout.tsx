import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BillPop | Effortless Invoicing",
  description: "BillPop: Create, manage, and track invoices with ease. Generate PDFs, payment links, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-20">
          <div className="container mx-auto flex items-center gap-3 py-4 px-2 md:px-0">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 w-10 h-10 flex items-center justify-center text-white font-bold text-2xl shadow-md select-none">B</div>
              <span className="text-2xl font-extrabold tracking-tight text-indigo-700">BillPop</span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
