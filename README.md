# Kodous

A minimal service to send appreciation (kodous) to your team. Simple, kind, and personal.

## Features

- **Send a Kodu** — Send a message from you to a teammate
- **View Sent** — See all kodous you've sent
- **My Kodous** — Enter your name to see kodous sent to you

## Deploy on Vercel

### 1. Add Neon (Postgres)

1. Go to [Vercel Marketplace](https://vercel.com/marketplace) and add **Neon**
2. Connect Neon to your project — `DATABASE_URL` is auto-injected

### 2. Deploy

```bash
# Install Vercel CLI (optional)
bun add -g vercel

# Deploy
vercel
```

Or push to GitHub and import the repo in [Vercel](https://vercel.com/new).

## Local Development

### 1. Create a Neon database

- Sign up at [neon.tech](https://neon.tech)
- Create a project and copy the connection string

### 2. Set environment variables

```bash
cp .env.example .env.local
# Edit .env.local and add:
# - DATABASE_URL (from Neon)
# - AUTH_USERNAME, AUTH_PASSWORD (login credentials)
# - SESSION_SECRET (min 32 chars, e.g. openssl rand -base64 32)
```

### 3. Run

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

- `GET /api/kudos` — List all kodous
- `GET /api/kudos?to=Name` — List kodous sent to a person
- `GET /api/kudos/[id]` — Get a single kodu
- `POST /api/kudos` — Create a kodu (`{ from, to, message }`)

## Tech

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Neon Postgres (serverless, Vercel-ready)
