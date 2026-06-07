'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function pendingReveal() {
  try {
    if (document.documentElement.classList.contains('zali-reveal')) return true
    if (sessionStorage.getItem('zali_nav') === '1') return true
    if (new URLSearchParams(window.location.search).get('zali_nav') === '1') return true
  } catch (_) {}
  return false
}

export function ZaliNavBridge() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pendingReveal()) return

    document.documentElement.classList.add('zali-reveal')

    const run = () => {
      window.ZaliLoader?.reset?.()
      window.ZaliLoader?.reveal(0)
    }

    run()
    requestAnimationFrame(run)
    const t = window.setTimeout(run, 50)

    return () => window.clearTimeout(t)
  }, [pathname, searchParams])

  return null
}
