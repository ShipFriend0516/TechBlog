import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import React from 'react';
import Footer from '@/app/entities/common/Footer';
import NavBar from '@/app/entities/common/NavBar';
import ToastProvider from '@/app/entities/common/Toast/ToastProvider';
import { GoogleAnalytics } from '@next/third-parties/google';

const SITE_NAME = 'ShipFriend TechBlog';
const SITE_DESCRIPTION = '문제 해결 경험과 개발 지식을 공유하는 개발 블로그입니다.';
const SITE_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
    apple: '/assets/apple-touch-icon.png',
    shortcut: '/favicon-16.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon-16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
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
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/images/profile/profile-banner.png`,
        width: 1424,
        height: 752,
        alt: 'ShipFriend TechBlog Open Graph Image',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/profile/profile-banner.png`],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: `${SITE_NAME} RSS Feed` },
      ],
    },
  },
  other: {
    'application-name': 'ShipFriend TechBlog 🌱',
    author: 'ShipFriend',
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
  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'ko-KR',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/assets/apple-touch-icon.png`,
        },
        sameAs: ['https://github.com/ShipFriend0516'],
      },
    ],
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: preventFOUC,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema),
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
