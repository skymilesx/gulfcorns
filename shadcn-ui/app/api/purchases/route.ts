import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const purchaseSchema = z.object({
  merchant: z.string().min(1).max(100),
  amount: z.number().positive().max(100000),
  currency: z.string().min(2).max(3),
});

// Currency precision mapping
const currencyDecimals: Record<string, number> = { 
  USD: 2, SAR: 2, AED: 2, QAR: 2, OMR: 2, KWD: 3, BHD: 3 
};

const dp = (c: string) => currencyDecimals[c] ?? 2;
const fmt = (n: number, c: string) => Number(n.toFixed(dp(c)));

// Helper function to get or create demo user
async function getDemoUser() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@gulfacorns.dev' },
    update: {},
    create: {
      email: 'demo@gulfacorns.dev',
      name: 'Demo User',
    },
  });
  return demoUser;
}

// Calculate roundup based on rule
function calculateRoundUp(amount: number, rule: any, currency: string): number {
  let roundUp = 0;
  
  switch (rule.type) {
    case 'roundup': {
      const remainder = amount % rule.value;
      roundUp = remainder === 0 ? 0 : rule.value - remainder;
      break;
    }
    case 'percent': {
      roundUp = amount * (rule.value / 100);
      break;
    }
    case 'fixed': {
      roundUp = rule.value;
      break;
    }
  }
  
  // Apply multiplier and format with correct decimal places
  const spare = roundUp * (rule.multiplier || 1);
  return fmt(spare, currency);
}

export async function POST(request: NextRequest) {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured',
      }, { status: 503 });
    }

    const body = await request.json();
    const { merchant, amount, currency } = purchaseSchema.parse(body);
    
    const user = await getDemoUser();
    
    // Get user's rule
    const rule = await prisma.roundupRule.findUnique({
      where: { userId: user.id },
    });

    if (!rule) {
      return NextResponse.json(
        { success: false, error: 'No rule found' },
        { status: 400 }
      );
    }

    // Calculate roundup
    const roundup = calculateRoundUp(amount, rule, currency);

    // Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        merchant,
        amount,
        currency,
        roundup,
      },
    });

    // Add to spare ledger if roundup > 0
    if (roundup > 0) {
      await prisma.spareLedger.create({
        data: {
          userId: user.id,
          amount: roundup,
          currency,
          status: 'pending',
        },
      });
    }

    // Get current pending sum
    const pendingSum = await prisma.spareLedger.aggregate({
      where: {
        userId: user.id,
        status: 'pending',
        currency,
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        purchase,
        pendingSum: Number(pendingSum._sum.amount || 0),
      },
    });
  } catch (error) {
    console.error('Create purchase error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create purchase' },
      { status: 500 }
    );
  }
}