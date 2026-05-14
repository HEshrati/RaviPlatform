# Raavi Platform - Frontend

Frontend for Raavi Platform built with Next.js 15 and React 19.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit the environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Run the application

#### Development mode
```bash
npm run dev
```

#### Production mode
```bash
npm run build
npm run start
```

Application will be available at `http://localhost:3001` (or 3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Project Structure

```
frontend/
├── public/                    # Static files
│   ├── images/                # Images
│   ├── categories/            # Category icons
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/                   # App Router (Next.js 15)
│   │   ├── layout.tsx         # Main layout
│   │   ├── page.tsx           # Home page
│   │   └── .../               # Other pages
│   ├── components/            # UI components
│   │   ├── ui/                # Base components
│   │   └── ...                # Custom components
│   ├── context/               # React Contexts
│   ├── lib/                   # Utility functions
│   │   ├── api.ts             # API configuration
│   │   └── utils.ts           # Helper functions
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Next.js middleware
├── package.json
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind config
├── tsconfig.json              # TypeScript config
└── README.md
```

## Technologies

- **Next.js 15** - React Framework
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP Client

## Features

- ✅ App Router (Next.js 15)
- ✅ Server Components
- ✅ TypeScript
- ✅ Responsive Design
- ✅ PWA Support
- ✅ Dark Mode
- ✅ Animations with Framer Motion
- ✅ Component-based Architecture

## Common Issues

### Peer Dependencies Error

If you encounter peer dependencies issues:

```bash
npm install --legacy-peer-deps
```

### API Connection Issues

1. Make sure backend is running
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is configured in backend

### TypeScript Errors

If you get TypeScript errors:

```bash
# Clear cache
rm -rf .next
rm -rf node_modules

# Reinstall
npm install --legacy-peer-deps

# Check types
npm run type-check
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Upload to Vercel
```

### Docker

```bash
docker build -t raavi-frontend .
docker run -p 3001:3001 raavi-frontend
```

## License

MIT
