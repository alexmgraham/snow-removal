# SnowClear - Smart Snow Removal Tracking

A modern, real-time snow removal tracking application built with Next.js 14, featuring two role-based dashboards for customers and operators.

![SnowClear](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)

## Features

### Customer Dashboard
- **Live Plow Tracking**: Real-time map showing plow location and route to your home
- **ETA Display**: Prominent estimated arrival time with countdown
- **Service Timeline**: Visual progress through Scheduled → En Route → Clearing → Complete
- **Operator Info**: See assigned operator name and vehicle

### Operator Dashboard
- **Route Map Overview**: Bird's-eye view of all jobs with color-coded status markers
- **Job Management**: Scrollable list with Start/Complete actions
- **Time Tracking**: Live timer when a job is in progress
- **Performance Stats**: Jobs completed, average time, hours worked, completion rate

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Maps**: Leaflet + react-leaflet (OpenStreetMap)
- **Icons**: Lucide React
- **State**: React Context

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A modern web browser

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd snow-removal

# Install dependencies
bun install
# or
npm install

# Start the development server
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Landing Page**: Choose your role - "I'm a Customer" or "I'm an Operator"
2. **Customer View**: Watch the plow approach your location in real-time
3. **Operator View**: Manage your route, start/complete jobs, track time

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with role selection
│   ├── layout.tsx            # Root layout with AuthProvider
│   ├── customer/page.tsx     # Customer dashboard
│   └── operator/page.tsx     # Operator dashboard
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── maps/                 # Map components
│   ├── customer/             # Customer-specific components
│   └── operator/             # Operator-specific components
├── lib/
│   ├── mock-data.ts          # Mock data for demo
│   └── utils.ts              # Utility functions
├── context/
│   └── AuthContext.tsx       # Auth state management
└── types/
    └── index.ts              # TypeScript interfaces
```

## Mock Data

The app uses simulated data for demonstration:
- **Location**: Truckee, CA area (Lake Tahoe region)
- **8 Customers** with addresses and coordinates
- **2 Operators** with vehicles
- **Pre-configured jobs** with various statuses

## Design

- **Color Palette**: Deep navy blues, icy teals, warm amber accents
- **Typography**: Outfit (sans-serif) + JetBrains Mono (monospace)
- **Effects**: Glass morphism, gradient backgrounds, subtle animations
- **Theme**: Winter-inspired with frosted glass cards

## Future Enhancements

- [ ] Backend API integration (Supabase recommended)
- [ ] Real-time updates via WebSockets
- [ ] Push notifications
- [ ] Historical job data and analytics
- [ ] Multi-language support
- [ ] Dark mode toggle

## License

MIT
