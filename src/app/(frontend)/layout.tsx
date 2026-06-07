import React, { Suspense } from 'react'
import { ZaliLoader } from '@/components/ZaliLoader'
import { ZaliNavBridge } from '@/components/ZaliNavBridge'
import './zali-fonts.css'

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
      <body style={{ margin: 0, overflowX: 'hidden' }}>
        <ZaliLoader />
        <Suspense fallback={null}>
          <ZaliNavBridge />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
