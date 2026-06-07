# Deploy zali-site on Hostinger Cloud Startup

You do **not** need SSH if you use **GitHub → Hostinger** deploy (recommended). SSH is only for manual fixes or copying files.

## Option A — GitHub deploy (no SSH)

1. Push `zali-site/` to a GitHub repo.
2. Hostinger hPanel → **Websites** → **Add Website** → **Node.js Apps** → **Import Git Repository**.
3. Build settings:
   - **Install:** `npm ci`
   - **Build:** `npm run build`
   - **Start:** `npm run start -- -p $PORT`
   - **Node.js:** 20 or 22
4. Environment variables (hPanel → your Node app → Environment):
   - `DATABASE_URL` — Supabase **zali-board** direct Postgres URI (port 5432)
   - `PAYLOAD_SECRET` — run `openssl rand -hex 32`
   - `NEXT_PUBLIC_SERVER_URL` — `https://zali.so`
   - `MAUTIC_FORM_SUBMIT_URL` — `https://mail.zali.so/form/submit?formId=2`
   - `MAUTIC_FORM_NAME` — `waitlist`
   - `MAUTIC_FORM_ID` — `2`
5. Point `zali.so` DNS to Hostinger (A record or nameservers).
6. First deploy: open `https://zali.so/admin`, create your Payload admin user.

## Option B — SSH (manual)

### What to give your developer / agent

| Item | Where to find it |
|------|------------------|
| SSH host | hPanel → **Advanced** → **SSH Access** (e.g. `ssh.hostinger.com` or server IP) |
| SSH port | Usually `22` |
| SSH username | e.g. `u123456789` |
| Auth | SSH key (preferred) or password |

**Do not paste passwords in chat.** Add your public key in hPanel, then say “SSH is enabled for user X on host Y.”

### SSH workflow (if not using Git)

```bash
ssh USER@HOST
cd ~/domains/zali.so/public_html   # path varies — check hPanel file manager
git pull   # if repo cloned on server
npm ci && npm run build
# Restart Node app from hPanel (or pm2 if you set that up yourself)
```

Hostinger managed Node apps usually **restart from hPanel**, not raw pm2.

## Database (Payload CMS)

| App | Supabase project | Postgres schema |
|-----|------------------|-----------------|
| **board.zali.so** | `zali-board` | `public` (stickies only) |
| **zali.so CMS** | `zali-site` when you have a project slot | `cms` (Payload tables) |

Free Supabase orgs are limited to **2 active projects**. Until you upgrade or free a slot, CMS uses the **`cms` schema** on an interim host (configured in `.env`) — board `public` tables are never touched.

| What | Where |
|------|--------|
| `DATABASE_URL` | Supabase → Database → **Session pooler** URI (port **5432**) |
| Waitlist | Mautic (placeholder mode needs no DB) |

## What stays on Vercel

- `board.zali.so` — unchanged

## Local dev

```bash
cp .env.example .env
docker compose up -d postgres   # optional local DB
npm install
npm run dev
```

- Site: http://localhost:3000 (landing via `/landing.html` in iframe)
- Admin: http://localhost:3000/admin
- Landing feed: http://localhost:3000/api/landing/posts?limit=3
