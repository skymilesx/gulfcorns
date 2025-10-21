import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { z } from 'zod';

const investSchema = z.object({
  portfolio: z.string().default('balanced'),
});

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { portfolio } = investSchema.parse(body);
    
    const user = await getDemoUser();
    
    // Get all pending spare ledger entries
    const pendingEntries = await prisma.spareLedger.findMany({
      where: {
        userId: user.id,
        status: 'pending',
      },
    });

    if (pendingEntries.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          invested: 0,
          lots: [],
        },
      });
    }

    // Calculate total amount to invest
    const totalAmount = pendingEntries.reduce((sum, entry) => {
      return sum + Number(entry.amount);
    }, 0);

    // Create invest lot
    const investLot = await prisma.investLot.create({
      data: {
        userId: user.id,
        amount: totalAmount,
        currency: pendingEntries[0].currency, // Assume all same currency
        portfolio,
      },
    });

    // Mark pending entries as settled
    await prisma.spareLedger.updateMany({
      where: {
        userId: user.id,
        status: 'pending',
      },
      data: {
        status: 'settled',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        invested: Number(totalAmount),
        lots: [investLot],
      },
    });
  } catch (error) {
    console.error('Invest error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process investment' },
      { status: 500 }
    );
  }
}