import { NextResponse } from 'next/server'

const BOARD_API_URL = (process.env.BOARD_API_URL || 'https://board.zali.so').replace(/\/$/, '')

/** Public JSON feed for the landing task board preview */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '5'
  const open = searchParams.get('open') === '1' ? '1' : '0'

  try {
    const res = await fetch(`${BOARD_API_URL}/api/stats?feed=1&limit=${limit}&open=${open}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json({ items: [] })
    }

    const data = await res.json()
    return NextResponse.json({ items: data.items || [] })
  } catch (err) {
    console.error('GET /api/landing/board', err)
    return NextResponse.json({ items: [] })
  }
}
