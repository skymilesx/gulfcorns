import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

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

export async function GET() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        data: {
          purchases: [],
          investLots: [],
          pendingAmount: 0,
          totalInvested: 0,
          rule: null,
        },
      });
    }

    const user = await getDemoUser();
    
    // Get last 50 purchases
    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Get last 20 invest lots
    const investLots = await prisma.investLot.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Get current pending sum
    const pendingSum = await prisma.spareLedger.aggregate({
      where: {
        userId: user.id,
        status: 'pending',
      },
      _sum: {
        amount: true,
      },
    });

    // Get total invested
    const totalInvested = await prisma.investLot.aggregate({
      where: { userId: user.id },
      _sum: {
        amount: true,
      },
    });

    // Get current rule
    const rule = await prisma.roundupRule.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        purchases: purchases.map((p: any) => ({
          id: p.id,
          merchant: p.merchant,
          amount: Number(p.amount),
          currency: p.currency,
          roundup: Number(p.roundup),
          createdAt: p.createdAt,
        })),
        investLots: investLots.map((l: any) => ({
          id: l.id,
          amount: Number(l.amount),
          currency: l.currency,
          portfolio: l.portfolio,
          createdAt: l.createdAt,
        })),
        pendingAmount: Number(pendingSum._sum.amount || 0),
        totalInvested: Number(totalInvested._sum.amount || 0),
        rule: rule ? {
          type: rule.type,
          value: rule.value,
          multiplier: rule.multiplier,
          currency: rule.currency,
        } : null,
      },
    });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get feed data' },
      { status: 500 }
    );
  }
}