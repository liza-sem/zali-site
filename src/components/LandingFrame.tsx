'use client'

type LandingFrameProps = {
  /** Scroll landing to this section on load (e.g. "waitlist" → #waitlist). */
  section?: string
}

/**
 * Serves Zali.html from /landing.html. CMS content is hydrated client-side via
 * /api/landing/posts and /api/site-settings (see cms-bridge.js).
 */
export default function LandingFrame({ section }: LandingFrameProps) {
  const src = section ? `/landing.html#${section}` : '/landing.html'

  return (
    <iframe
      src={src}
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
