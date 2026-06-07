import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })

    return NextResponse.json({
      siteName: settings.siteName || 'Zali',
      waitlistCount: settings.waitlistCount ?? null,
      footerText: settings.footerText || null,
      footerLinks: (settings.footerLinks || []).map((link) => ({
        label: link.label,
        url: link.url,
      })),
      socialLinks: (settings.socialLinks || []).map((link) => ({
        label: link.label,
        url: link.url,
      })),
    })
  } catch (err) {
    console.error('GET /api/site-settings', err)
    return NextResponse.json({
      siteName: 'Zali',
      waitlistCount: null,
      footerText: null,
      footerLinks: [],
      socialLinks: [],
    })
  }
}
