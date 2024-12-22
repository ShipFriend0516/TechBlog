import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/app/entities/common/Footer';
import React from 'react';
import NavBar from '@/app/entities/common/NavBar';
import ToastProvider from '@/app/entities/common/Toast/ToastProvider';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'ShipFriend TechBlog',
  description: '문제 해결 경험과 개발 지식을 공유하는 개발 블로그입니다.',
  icons: {
    icon: '/favicon.ico',
  },
};

const pretendard = localFont({
  src: [
    {
      path: './fonts/woff2/Pretendard-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/woff2/Pretendard-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`dark ${pretendard.variable} font-sans antialiased min-h-screen flex flex-col justify-between`}
      >
        <NavBar />
        <main className="flex-grow pb-20">{children}</main>
        <Footer />
        <ToastProvider />
        <GoogleAnalytics gaId={'G-8HJPFDHXEC'} />
      </body>
    </html>
  );
}
