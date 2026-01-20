import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import React from 'react';
import Footer from '@/app/entities/common/Footer';
import NavBar from '@/app/entities/common/NavBar';
import ToastProvider from '@/app/entities/common/Toast/ToastProvider';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'ShipFriend TechBlog',
  description: '문제 해결 경험과 개발 지식을 공유하는 개발 블로그입니다.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: [
    'ShipFriend',
    'TechBlog',
    '개발 블로그',
    '프론트엔드 개발',
    '웹 개발',
    'JavaScript',
    'React',
    'Next.js',
    'TypeScript',
  ],
  openGraph: {
    title: 'ShipFriend TechBlog',
    description: '문제 해결 경험과 개발 지식을 공유하는 개발 블로그입니다.',
    url: process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://www.shipfriend.dev',
    siteName: 'ShipFriend TechBlog',
    images: [
      {
        url: '/images/profile/profile.jpg',
        width: 512,
        height: 512,
        alt: 'ShipFriend TechBlog Open Graph Image',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  other: {
    'application-name': 'Shipfriend Tech Blog',
    author: 'ShipFriend',
    'og:type': 'article',
    'article:tag': 'technology,programming,web development',
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

const preventFOUC = `
(function() {
  const savedTheme = JSON.parse(localStorage.getItem('theme-storage')).state.theme || 'light';
  const isDark = savedTheme === 'dark';
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  document.documentElement.style.backgroundColor = isDark ? '#1e201e' : '#ffffff';
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: preventFOUC,
          }}
        />
      </head>
      <body
        className={`${pretendard.variable} font-sans antialiased min-h-screen flex flex-col justify-between`}
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
