# Gulf Acorns - Micro-investing Platform

A full-stack micro-investing platform for the Gulf region with automatic round-up investments, built with Next.js, Prisma, and PostgreSQL.

## Features

- 🌍 **Multi-language Support**: English and Arabic with RTL support
- 💰 **Multi-currency**: Support for SAR, AED, OMR, BHD, KWD, QAR, USD
- 🔄 **Flexible Round-up Rules**: Round-up, fixed amount, or percentage-based
- 📊 **Real-time Dashboard**: Track investments, pending amounts, and performance
- 🛡️ **Secure & Persistent**: Database-backed with API fallback
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **State Management**: Zustand with API integration
- **UI Components**: Radix UI, Lucide React

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Database

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Create database
createdb gulfacorns

# Set environment variable
cp env.example .env.local
# Edit .env.local with your DATABASE_URL
```

#### Option B: Cloud Database (Recommended)

**Vercel Postgres:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project
3. Go to Storage → Create Database → Postgres
4. Copy the connection string to your `.env.local`

**Neon (Free tier available):**
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string to your `.env.local`

**Supabase:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string to your `.env.local`

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with demo data
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Add environment variables:**
   - `DATABASE_URL`: Your PostgreSQL connection string
3. **Deploy automatically**

### Database Setup for Production

1. **Create a PostgreSQL database** (Vercel Postgres, Neon, Supabase, etc.)
2. **Set the `DATABASE_URL` environment variable**
3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Seed the database:**
   ```bash
   npm run seed
   ```

## API Endpoints

- `POST /api/purchases` - Create a new purchase and calculate round-up
- `POST /api/invest` - Invest pending spare change
- `GET /api/feed` - Get user's purchases, investments, and current state
- `GET /api/rule` - Get current round-up rule
- `PUT /api/rule` - Update round-up rule

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  
  roundupRules RoundupRule[]
  purchases    Purchase[]
  spareLedger  SpareLedger[]
  investLots   InvestLot[]
}

model RoundupRule {
  id         String  @id @default(cuid())
  userId     String
  type       String  // 'roundup', 'fixed', 'percent'
  value      Float
  multiplier Int     @default(1)
  currency   String  @default("USD")
  createdAt  DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Purchase {
  id        String   @id @default(cuid())
  userId    String
  merchant  String
  amount    Decimal  @db.Decimal(12, 2)
  currency  String
  roundup   Decimal  @db.Decimal(12, 2)
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SpareLedger {
  id        String   @id @default(cuid())
  userId    String
  amount    Decimal  @db.Decimal(12, 2)
  currency  String
  status    String   @default("pending") // 'pending', 'settled'
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model InvestLot {
  id        String   @id @default(cuid())
  userId    String
  amount    Decimal  @db.Decimal(12, 2)
  currency  String
  portfolio String   @default("balanced")
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run seed` - Seed database with demo data

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── purchases/     # Purchase management
│   │   ├── invest/        # Investment processing
│   │   ├── feed/          # Data aggregation
│   │   └── rule/          # Rule management
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── src/                   # Source code
│   ├── components/        # React components
│   ├── lib/              # Utilities and store
│   ├── pages/            # Page components
│   └── data/             # Mock data
└── lib/                   # Shared utilities
    └── db.ts              # Database client
```

## Features in Detail

### Round-up Rules
- **Round-up**: Round to nearest X (e.g., round to nearest $1)
- **Fixed**: Add fixed amount per purchase
- **Percentage**: Add percentage of purchase amount
- **Multiplier**: Multiply the calculated amount (1x, 2x, 3x, etc.)

### Multi-currency Support
- Saudi Riyal (SAR) - ر.س
- UAE Dirham (AED) - د.إ
- Omani Rial (OMR) - ر.ع.
- Bahraini Dinar (BHD) - د.ب
- Kuwaiti Dinar (KWD) - د.ك
- Qatari Riyal (QAR) - ر.ق
- US Dollar (USD) - $

### Investment Portfolios
- Conservative Growth
- Balanced Portfolio
- Growth Portfolio
- Gold & Commodities
- Shariah Compliant

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@gulfacorns.dev or create an issue on GitHub.