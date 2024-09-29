import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/app/entities/common/Footer';
import React from 'react';
import NavBar from '@/app/entities/common/NavBar';
import icon from './favicon.png';
import { AlternateURLs } from 'next/dist/lib/metadata/types/alternative-urls-types';
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'My Blog',
  description: '나의 개인 블로그!',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-between`}
      >
        <NavBar />
        <>{children}</>
        <Footer />
      </body>
    </html>
  );
}
