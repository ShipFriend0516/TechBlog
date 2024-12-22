import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/app/entities/common/Footer';
import React from 'react';
import NavBar from '@/app/entities/common/NavBar';
import ToastProvider from '@/app/entities/common/Toast/ToastProvider';

export const metadata: Metadata = {
  title: 'ShipFriend TechBlog',
  description: '문제 해결 경험과 개발 지식을 공유하는 개발 블로그입니다.',
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
        className={`dark antialiased min-h-screen flex flex-col justify-between`}
      >
        <NavBar />
        <main className="flex-grow pb-20">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
