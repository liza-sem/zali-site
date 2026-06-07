'use client'

/**
 * Serves Zali.html from /landing.html. CMS content is hydrated client-side via
 * /api/landing/posts and /api/site-settings (see cms-bridge.js).
 */
export default function LandingFrame() {
  return (
    <iframe
      src="/landing.html"
      title="Zali"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
      }}
    />
  )
}
