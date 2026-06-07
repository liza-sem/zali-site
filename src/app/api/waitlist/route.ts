import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function submitToMautic(email: string, source: string) {
  const submitUrl = process.env.MAUTIC_FORM_SUBMIT_URL
  if (!submitUrl) return null

  const formName = process.env.MAUTIC_FORM_NAME || 'waitlist'
  const formId = process.env.MAUTIC_FORM_ID || '2'
  const body = new URLSearchParams()
  body.set('mauticform[email]', email)
  body.set('mauticform[formId]', formId)
  body.set('mauticform[return]', '')
  body.set('mauticform[formName]', formName)
  body.set('mauticform[submit]', '1')

  const res = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'ZaliWaitlist/1.0',
    },
    body: body.toString(),
    redirect: 'follow',
  })

  console.log('[waitlist mautic]', { email, source, status: res.status })

  if (!res.ok) {
    console.error('Mautic waitlist submit failed', res.status, await res.text())
    return { ok: false as const }
  }

  return { ok: true as const, mode: 'mautic' as const }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const source = String(body.source || 'landing')

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const mautic = await submitToMautic(email, source)
    if (mautic) {
      if (!mautic.ok) {
        return NextResponse.json({ error: 'Could not save signup' }, { status: 500 })
      }
      return NextResponse.json(mautic)
    }

    const supabase = getSupabase()
    if (supabase) {
      const { error } = await supabase.from('waitlist_signups').insert({
        email,
        source,
        referrer: body.referrer || null,
      })

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ ok: true, duplicate: true, mode: 'supabase' })
        }
        console.error('waitlist insert', error)
        return NextResponse.json({ error: 'Could not save signup' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, mode: 'supabase' })
    }

    // Placeholder until Mautic (or Supabase) is configured — UX still works
    console.log('[waitlist placeholder]', { email, source })
    return NextResponse.json({ ok: true, mode: 'placeholder' })
  } catch (err) {
    console.error('POST /api/waitlist', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
