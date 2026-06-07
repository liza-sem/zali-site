'use client'

type LandingFrameProps = {
  /** Scroll landing to this section on load (e.g. "waitlist" → #waitlist). */
  section?: string
}

function dismissParentLoader() {
  try {
    document.documentElement.classList.remove('zali-reveal')
    const loader = document.getElementById('loader')
    if (loader) {
      loader.classList.add('done')
      loader.style.display = 'none'
    }
  } catch (_) {}
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
      onLoad={dismissParentLoader}
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
