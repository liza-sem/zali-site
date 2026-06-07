import { NextResponse } from 'next/server'
import { buildLandingFeed } from '@/lib/landing-feed'
import { getPayloadClient } from '@/lib/payload'

/** Public JSON feed for the landing Posts card */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(12, Math.max(1, parseInt(searchParams.get('limit') || '3', 10)))
  const landingOnly = searchParams.get('landing') !== '0'

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      limit: 50,
      sort: '-sortOrder',
      where: {
        and: [
          { published: { equals: true } },
          ...(landingOnly ? [{ showOnLanding: { equals: true } }] : []),
        ],
      },
    })

    const items = buildLandingFeed({ posts: result.docs, limit })
    return NextResponse.json({ items })
  } catch (err) {
    console.error('GET /api/landing/posts', err)
    return NextResponse.json({ items: [] })
  }
}
