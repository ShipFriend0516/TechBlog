import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import React from 'react';
import Footer from '@/app/entities/common/Footer';
import NavBar from '@/app/entities/common/NavBar';
import ToastProvider from '@/app/entities/common/Toast/ToastProvider';
import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/app/lib/site';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'ShipFriend', url: 'https://github.com/ShipFriend0516' }],
  creator: 'ShipFriend',
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      {
        url: '/assets/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/assets/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/assets/apple-touch-icon.png',
    shortcut: '/assets/favicon-16x16.png',
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
        url: DEFAULT_SOCIAL_IMAGE,
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
    images: [DEFAULT_SOCIAL_IMAGE],
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
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: preventFOUC,
          }}
        />
      </head>
      <body
        className={`${pretendard.variable} font-sans antialiased min-h-screen flex flex-col justify-between`}
        suppressHydrationWarning
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
