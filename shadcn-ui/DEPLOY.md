# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- GitHub account
- Vercel account (free tier available)

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database" → "Postgres"
3. Choose a name (e.g., "gulf-acorns-db")
4. Select a region close to your users
5. Copy the connection string (starts with `postgresql://`)

### Option B: Neon (Alternative)
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string from the dashboard

## Step 2: Environment Variables

Create a `.env.local` file in your project root:

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```

Replace with your actual connection string from Step 1.

## Step 3: Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev -n init

# Start development server
npm run dev
```

## Step 4: Deploy to Vercel

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add DATABASE_URL
# Paste your connection string when prompted
```

### Method 2: GitHub Integration
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
   - Name: `DATABASE_URL`
   - Value: Your PostgreSQL connection string
6. Click "Deploy"

## Step 5: Post-Deployment

After deployment, run the database migrations on production:

```bash
# Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy

# Or using Vercel dashboard terminal
npx prisma migrate deploy
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

## Verification

1. Visit your deployed app (e.g., `https://your-app.vercel.app`)
2. Test the QA scenarios:
   - Add a purchase (Starbucks $4.50)
   - Verify roundup calculation
   - Click "Invest Now"
   - Download statement from `/api/statement?month=2025-10`

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Check if database is accessible from Vercel's IP ranges
- Ensure SSL is enabled (most cloud providers require it)

### Migration Issues
- Run `npx prisma migrate reset` to start fresh
- Check Prisma logs: `npx prisma migrate dev --verbose`

### Build Issues
- Ensure all dependencies are in `package.json`
- Check that `prisma generate` runs successfully
- Verify TypeScript compilation: `npm run build`

## Production Checklist

- [ ] Database created and accessible
- [ ] Environment variables set
- [ ] Migrations run successfully
- [ ] App deployed and accessible
- [ ] QA scenarios working
- [ ] Statement generation working
- [ ] Chart rendering correctly

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
