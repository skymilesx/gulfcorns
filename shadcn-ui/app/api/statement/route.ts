import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    const user = await getDemoUser();
    
    // Parse month to get start and end dates
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);
    
    // Get purchases for the month
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get invest lots for the month
    const investLots = await prisma.investLot.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get current pending amount
    const pendingSum = await prisma.spareLedger.aggregate({
      where: {
        userId: user.id,
        status: 'pending',
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate totals
    const totalPurchases = purchases.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalRoundups = purchases.reduce((sum, p) => sum + Number(p.roundup), 0);
    const totalInvested = investLots.reduce((sum, l) => sum + Number(l.amount), 0);

    // Generate HTML statement
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Gulf Acorns Statement - ${month}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #10b981; }
            .section { margin-bottom: 25px; }
            .section h2 { color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f9fafb; font-weight: bold; }
            .total { font-weight: bold; background-color: #f0f9ff; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌱 Gulf Acorns</div>
            <h1>Monthly Statement - ${month}</h1>
            <p>Demo User (demo@gulfacorns.dev)</p>
          </div>

          <div class="section">
            <h2>Summary</h2>
            <table>
              <tr>
                <td>Total Purchases:</td>
                <td>$${totalPurchases.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total Roundups:</td>
                <td>$${totalRoundups.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total Invested:</td>
                <td>$${totalInvested.toFixed(2)}</td>
              </tr>
              <tr class="total">
                <td>Pending Amount:</td>
                <td>$${Number(pendingSum._sum.amount || 0).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>Purchases (${purchases.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Roundup</th>
                </tr>
              </thead>
              <tbody>
                ${purchases.map(p => `
                  <tr>
                    <td>${new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>${p.merchant}</td>
                    <td>$${Number(p.amount).toFixed(2)}</td>
                    <td>$${Number(p.roundup).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Investments (${investLots.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Portfolio</th>
                </tr>
              </thead>
              <tbody>
                ${investLots.map(l => `
                  <tr>
                    <td>${new Date(l.createdAt).toLocaleDateString()}</td>
                    <td>$${Number(l.amount).toFixed(2)}</td>
                    <td>${l.portfolio}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>Gulf Acorns - Your spare change builds your future</p>
          </div>
        </body>
      </html>
    `;

    // For now, return HTML (in production, you'd use a PDF library like puppeteer)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Statement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate statement' },
      { status: 500 }
    );
  }
}
