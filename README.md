# zali-site

Zali marketing site — **Next.js 15 + Payload 3** on Hostinger, with the existing `Zali.html` landing preserved.

## Structure

```
zali-site/
├── public/landing.html     # Your Zali.html prototype (served as-is for now)
├── public/TenPoint_08_01_Comp.otf  # Logo wordmark font (`.logo .name`, `.zali-wordmark`)
├── src/
│   ├── app/(frontend)/     # Public site — / shows landing
│   ├── app/(payload)/      # Payload admin at /admin
│   ├── app/api/waitlist/   # Waitlist signups → Supabase
│   ├── app/api/landing/posts/   # Public JSON feed (not Payload CRUD)
│   ├── collections/Posts.ts
│   └── globals/SiteSettings.ts
└── DEPLOY-HOSTINGER.md
```

## Quick start

```bash
npm install
cp .env.example .env
# Fill in DATABASE_URL (session pooler URI) + PAYLOAD_SECRET
npm run dev
```

**Database:** Payload CMS uses the **`cms` Postgres schema** — separate from the board’s `public` tables. Target a dedicated **`zali-site`** Supabase project when your org has a free project slot (2-project limit on free tier).

| URL | Purpose |
|-----|---------|
| `/` | Landing (`Zali.html` via iframe — temporary) |
| `/admin` | Payload CMS |
| `/posts` | Published written posts |
| `/posts/[slug]` | Single article |
| `/api/landing/posts?limit=3` | Latest posts card (written + external links) |
| `/api/site-settings` | Footer, waitlist count, site name |
| `/api/waitlist` | POST `{ "email": "..." }` — placeholder until Mautic |

## CMS → landing

The landing page loads `public/cms-bridge.js`, which fetches Payload content on page load:

- **Posts** — create in `/admin` → Posts. Choose **Write** (slug, cover, content) or **External link** (URL only). Check “Show on landing” for the homepage card.
- **Footer + waitlist #** — `/admin` → Site settings

Static HTML fallbacks stay visible if the CMS isn’t running yet.

## Waitlist

Forms POST to `/api/waitlist`. Priority:

1. **Mautic** — set `MAUTIC_FORM_SUBMIT_URL` (+ optional `MAUTIC_FORM_NAME`, `MAUTIC_FORM_ID`)
2. **Supabase** — `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
3. **Placeholder** (default) — accepts signups, logs server-side, full landing UX

## Roadmap

1. ✅ Payload + Posts + site settings APIs
2. ✅ Landing wired to CMS (posts feed, footer, waitlist count)
3. ✅ Waitlist forms → `/api/waitlist` (placeholder / Mautic-ready)
4. ⏳ Port `Zali.html` into React (remove iframe)

See [DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md) for hosting. **GitHub deploy needs no SSH.**
