import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getTypedTestKeys } from '@/lib/loadTests';
import { QuestionKey } from './types/QuestionKey';
import Navbar from "./components/Navbar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'DSA Practice',
  description: 'Practice common data structure and algorithm problems interactively.',
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const testKeys: QuestionKey[] = await getTypedTestKeys();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar testKeys={testKeys} />
        {children}
      </body>
    </html>
  );
}
