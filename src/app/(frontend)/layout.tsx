import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import { ZaliLoader } from '@/components/ZaliLoader'
import { ZaliNavBridge } from '@/components/ZaliNavBridge'
import './zali-fonts.css'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://zali.so'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Join the waitlist',
  description: 'Join the waitlist',
  openGraph: {
    title: 'Join the waitlist',
    description: 'Join the waitlist',
    url: siteUrl,
    siteName: 'Zali',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og.jpg',
        width: 1024,
        height: 640,
        alt: 'Zali is a task manager that builds your list from your messages using AI.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the waitlist',
    description: 'Join the waitlist',
    images: ['/og.jpg'],
  },
}

export default function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html data-zali-app="1" lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=new URLSearchParams(location.search);var s=false;try{s=sessionStorage.getItem('zali_nav')==='1';}catch(_){}if(p.get('zali_nav')==='1'||s){document.documentElement.classList.add('zali-reveal');}}catch(_){}})();`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/zali-loader.js" />
      </head>
      <body style={{ margin: 0 }}>
        <ZaliLoader />
        <Suspense fallback={null}>
          <ZaliNavBridge />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
