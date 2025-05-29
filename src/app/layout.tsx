import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getTypedTestKeys } from '@/lib/loadTests';
import { QuestionKey } from './types/QuestionKey';
import Navbar from "./components/Navbar";
import ThemeInitializer from './components/ThemeInitializer';
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
  description: 'App to showcase what I have done in leetcode with tests the code can run against.',
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const testKeys: QuestionKey[] = await getTypedTestKeys();
  return (
    <html lang="en" data-theme="business">
      <head>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
      (function() {
        try {
          const stored = localStorage.getItem('theme');
          const preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'business' : 'light');
          document.documentElement.setAttribute('data-theme', preferred);
        } catch(e) {}
      })();
    `,
          }}
        /> */}

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeInitializer />
        <Navbar testKeys={testKeys} />
        {children}
      </body>
    </html>
  );
}
