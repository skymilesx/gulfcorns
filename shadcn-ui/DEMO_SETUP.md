# Gulf Acorns Demo Setup

## Quick Start (No Database Required)

This demo works without a database for immediate testing:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features Working:
- ✅ Language switching (EN/AR) with RTL support
- ✅ Currency switching (SAR, AED, OMR, BHD, KWD, QAR, USD)
- ✅ Round-up rule configuration
- ✅ Simulated purchases
- ✅ Investment tracking
- ✅ Beautiful UI with Tailwind CSS

## With Database (Optional)

To enable full persistence:

1. Set up a database (PostgreSQL or SQLite)
2. Set `DATABASE_URL` in `.env.local`
3. Run: `npx prisma generate && npx prisma migrate dev -n init && npm run seed`

## Demo User
- Email: demo@gulfacorns.dev
- Default rule: Round-up to nearest $1
- Currency: USD