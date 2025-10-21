import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { z } from 'zod';

const ruleSchema = z.object({
  type: z.enum(['roundup', 'fixed', 'percent']),
  value: z.number().positive().max(1000),
  multiplier: z.number().int().min(1).max(10),
  currency: z.string().min(2).max(3),
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

export async function GET() {
  try {
    const user = await getDemoUser();
    
    const rule = await prisma.roundupRule.findUnique({
      where: { userId: user.id },
    });

    if (!rule) {
      // Create default rule
      const defaultRule = await prisma.roundupRule.create({
        data: {
          userId: user.id,
          type: 'roundup',
          value: 1,
          multiplier: 1,
          currency: 'USD',
        },
      });
      return NextResponse.json({ success: true, data: defaultRule });
    }

    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    console.error('Get rule error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get rule' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value, multiplier, currency } = ruleSchema.parse(body);
    
    const user = await getDemoUser();
    
    const rule = await prisma.roundupRule.upsert({
      where: { userId: user.id },
      update: {
        type,
        value,
        multiplier,
        currency,
      },
      create: {
        userId: user.id,
        type,
        value,
        multiplier,
        currency,
      },
    });

    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    console.error('Update rule error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rule' },
      { status: 500 }
    );
  }
}