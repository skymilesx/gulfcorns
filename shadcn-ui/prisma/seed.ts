import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@gulfacorns.dev' },
    update: {},
    create: {
      email: 'demo@gulfacorns.dev',
      name: 'Demo User',
    },
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Create default roundup rule
  const defaultRule = await prisma.roundupRule.upsert({
    where: {
      userId: demoUser.id,
    },
    update: {},
    create: {
      userId: demoUser.id,
      type: 'roundup',
      value: 1,
      multiplier: 1,
      currency: 'USD',
    },
  })

  console.log('✅ Default roundup rule created:', defaultRule.type)

  // Create some sample purchases
  const samplePurchases = [
    { merchant: 'Coffee Shop - Starbucks', amount: 4.75, currency: 'USD' },
    { merchant: 'Grocery Store - Carrefour', amount: 125.30, currency: 'USD' },
    { merchant: 'Gas Station - ADNOC', amount: 89.15, currency: 'USD' },
    { merchant: 'Online Shopping - Amazon', amount: 234.60, currency: 'USD' },
    { merchant: 'Restaurant - Al Baik', amount: 67.25, currency: 'USD' },
  ]

  for (const purchase of samplePurchases) {
    // Calculate roundup (simple roundup to nearest dollar)
    const roundup = Math.ceil(purchase.amount) - purchase.amount

    await prisma.purchase.create({
      data: {
        userId: demoUser.id,
        merchant: purchase.merchant,
        amount: purchase.amount,
        currency: purchase.currency,
        roundup: roundup,
      },
    })

    // Add to spare ledger if roundup > 0
    if (roundup > 0) {
      await prisma.spareLedger.create({
        data: {
          userId: demoUser.id,
          amount: roundup,
          currency: purchase.currency,
          status: 'pending',
        },
      })
    }
  }

  console.log('✅ Sample purchases created')

  // Create a sample invest lot
  const totalPending = await prisma.spareLedger.aggregate({
    where: {
      userId: demoUser.id,
      status: 'pending',
    },
    _sum: {
      amount: true,
    },
  })

  if (totalPending._sum.amount && Number(totalPending._sum.amount) > 0) {
    await prisma.investLot.create({
      data: {
        userId: demoUser.id,
        amount: totalPending._sum.amount,
        currency: 'USD',
        portfolio: 'balanced',
      },
    })

    // Mark pending entries as settled
    await prisma.spareLedger.updateMany({
      where: {
        userId: demoUser.id,
        status: 'pending',
      },
      data: {
        status: 'settled',
      },
    })

    console.log('✅ Sample invest lot created')
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
