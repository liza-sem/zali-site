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
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
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
            __html: `(function(){var k='zali_chunk_reload';function stale(m){return/ChunkLoadError|Loading chunk [\\d]+ failed|Failed to fetch dynamically imported module/i.test(m||'');}function reload(){try{if(sessionStorage.getItem(k)==='1')return;sessionStorage.setItem(k,'1');location.reload();}catch(_){location.reload();}}window.addEventListener('error',function(e){if(stale(e.message))reload();});window.addEventListener('unhandledrejection',function(e){var m=(e.reason&&e.reason.message)||String(e.reason||'');if(stale(m))reload();});window.addEventListener('load',function(){try{sessionStorage.removeItem(k);}catch(_){}});})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=new URLSearchParams(location.search);var s=false;try{s=sessionStorage.getItem('zali_nav')==='1';}catch(_){}if(p.get('zali_nav')==='1'||s){document.documentElement.classList.add('zali-reveal');}}catch(_){}})();`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/zali-loader.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags set_config startSessionRecording stopSessionRecording sessionManager loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug alias reset get_distinct_id getGroups get_session_id get_session_replay_url".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_D9qzawYtQYnrbDAiHaYb4XFz6hYD2q9FX4zFGhtjnjb2',{api_host:'https://us.i.posthog.com',defaults:'2025-05-24',person_profiles:'identified_only',persistence:'localStorage'});`,
          }}
        />
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
