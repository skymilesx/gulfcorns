# Gulf Acorns MVP Implementation Plan

## Project Overview
Building a micro-investing platform web application that demonstrates core Gulf Acorns functionality.

## MVP Scope (8 files maximum)
1. **src/pages/Index.tsx** - Landing page with bilingual support (EN/AR)
2. **src/pages/Dashboard.tsx** - Main user dashboard showing investments and round-ups
3. **src/pages/Portfolio.tsx** - Investment portfolio management
4. **src/pages/Settings.tsx** - Account settings and round-up rules configuration
5. **src/components/RoundUpEngine.tsx** - Component for round-up calculations and display
6. **src/components/InvestmentChart.tsx** - Portfolio performance visualization
7. **src/lib/gulfAcorns.ts** - Core business logic and data management
8. **src/data/mockData.ts** - Sample data for Gulf region currencies and portfolios

## Key Features to Implement
- Bilingual interface (English/Arabic with RTL support)
- Gulf region currency support (SAR, AED, OMR, BHD, KWD, QAR)
- Round-up calculation engine
- Portfolio management with different risk levels
- Investment tracking and performance charts
- Responsive design for mobile and desktop

## Technical Stack
- React with TypeScript
- Shadcn-ui components
- Tailwind CSS with RTL support
- Recharts for data visualization
- Local storage for data persistence

## Implementation Order
1. Update landing page with Gulf Acorns branding
2. Create mock data structure for Gulf region
3. Build core business logic functions
4. Implement dashboard with investment overview
5. Add portfolio management interface
6. Create settings page for round-up rules
7. Add bilingual support and RTL layout
8. Integrate charts and visualizations