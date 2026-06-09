# LuckAndLoadTV – Community Hub

A clean community hub for the LuckAndLoadTV streaming brand. Built with Next.js 14, Supabase, and Discord OAuth.

## Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Framework   | Next.js 14 (App Router)  |
| Language    | TypeScript               |
| Styling     | Tailwind CSS             |
| Database    | Supabase (PostgreSQL)    |
| Auth        | NextAuth.js + Discord    |
| Hosting     | Vercel                   |

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/luckandloadtv.git
cd luckandloadtv
npm install
```

### 2. Environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Fill in every value (see **Environment Variables** section below).

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase/migrations/001_schema.sql`
3. Copy your project URL and keys into `.env.local`

### 4. Set up Discord OAuth

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Create a new application → **OAuth2**
3. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
4. Copy Client ID and Client Secret into `.env.local`

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=         # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Your anon/public key
SUPABASE_SERVICE_ROLE_KEY=        # Your service role key (keep secret!)

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                  # Run: openssl rand -base64 32

# Discord OAuth
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial MVP"
git remote add origin https://github.com/YOUR_USERNAME/luckandloadtv.git
git push -u origin main
```

### 2. Connect Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Add all environment variables from `.env.local.example`
3. Set `NEXTAUTH_URL` to your Vercel deployment URL (e.g. `https://luckandloadtv.vercel.app`)
4. Deploy

### 3. Update Discord redirect URI

Add your production URL to Discord OAuth2 redirects:
`https://your-domain.vercel.app/api/auth/callback/discord`

---

## Making a User an Admin

Run this in the Supabase SQL editor (replace with the real Discord ID):

```sql
UPDATE public.users
SET role = 'admin'
WHERE discord_id = 'YOUR_DISCORD_ID';
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── leaderboard/page.tsx  # Leaderboard
│   ├── profile/page.tsx      # User profile
│   ├── admin/page.tsx        # Admin dashboard
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── error/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── admin/
│           ├── users/route.ts
│           ├── announcements/route.ts
│           └── points/route.ts
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── home/                 # Hero, page sections
│   ├── ui/                   # Button, Card, Badge, Avatar
│   └── Providers.tsx
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── supabase.ts           # Supabase clients
│   └── utils.ts              # Helpers
└── types/
    └── index.ts              # TypeScript types

supabase/
└── migrations/
    └── 001_schema.sql        # Full DB schema + seed
```

---

## Future Features (architecture is ready)

The schema and code structure is prepared for:

- **Daily Blackjack** – virtual points game, 3 hands/day
- **Achievements & badges** – milestone tracking
- **Community events** – admin-created events with point rewards
- **Giveaways** – entry system tied to points
- **Twitch/Kick live status** – API polling for live embed
- **Daily streak system** – consecutive login bonuses
- **Referral tracking** – invite link system

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run type-check # TypeScript check
npm run lint       # ESLint
```
