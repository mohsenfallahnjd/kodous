# Kodous

Kodous is a lightweight internal appreciation app for teams.  
It lets members send anonymous kudos, view weekly rankings, and manage team profiles with avatar support.

## Features

- Login-based access with role support (`admin` and optional `member`)
- Anonymous kudos sending flow
- Weekly leaderboard (`current` and `last` week)
- Team management (add/edit/delete users, avatar selection)
- Sent history with admin-only delete/reset actions
- PWA support (`manifest.json` + service worker registration)

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Neon Postgres (`@neondatabase/serverless`)
- `iron-session` for cookie-based auth sessions
- Bun as package manager/runtime

## Getting Started (Local)

### 1) Install dependencies

```bash
bun install
```

### 2) Configure environment variables

```bash
cp .env.example .env.local
```

Required / supported variables:

- `DATABASE_URL`: Neon Postgres connection string (or use `POSTGRES_URL`)
- `AUTH_USERNAME`: admin username
- `AUTH_PASSWORD`: admin password
- `SESSION_SECRET`: minimum 32 characters (`openssl rand -base64 32`)
- `USER_USERNAME` (optional): member username (read-only user management)
- `USER_PASSWORD` (optional): member password

### 3) Run development server

```bash
bun run dev
```

Open `http://localhost:3000`.

## Scripts

- `bun run dev` - Start local dev server
- `bun run build` - Build production app
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Deployment (Vercel + Neon)

1. Add Neon from the [Vercel Marketplace](https://vercel.com/marketplace).
2. Connect your Neon project so `DATABASE_URL` is available.
3. Set auth/session env vars in Vercel:
   - `AUTH_USERNAME`, `AUTH_PASSWORD`
   - `SESSION_SECRET`
   - Optional: `USER_USERNAME`, `USER_PASSWORD`
4. Deploy via Git import or CLI:

```bash
bun add -g vercel
vercel
```

## API Routes

All protected routes require a valid logged-in session.

### Auth

- `POST /api/auth/login` - Login with `{ username, password }`
- `POST /api/auth/logout?redirect=/login` - Logout and redirect
- `GET /api/auth/session` - Current session info (`loggedIn`, `role`, `isAdmin`)

### Kudos

- `GET /api/kudos` - List all kudos (auth required)
- `GET /api/kudos?to=<name>` - List kudos for a recipient (auth required)
- `POST /api/kudos` - Create kudos with `{ to, message }` (auth required)
- `DELETE /api/kudos` - Reset all kudos (admin only)
- `GET /api/kudos/[id]` - Get a single kudos by id (auth required)
- `DELETE /api/kudos/[id]` - Delete one kudos (admin only)

### Users

- `GET /api/users` - List users (auth required)
- `POST /api/users` - Create user `{ name, avatar? }` (admin only)
- `PUT /api/users` - Update user `{ id, name, avatar? }` (admin only)
- `DELETE /api/users?id=<userId>` - Delete user (admin only)

### Leaderboard

- `GET /api/leaderboard?week=current|last` - Weekly ranking by received kudos

## UI Components

Recommended primitives from `src/components`:

- `Link`: use this instead of raw `next/link` to trigger the custom route progress event (`kodous:route-start`)
- `Image`: shared wrapper over `next/image` for consistent imports
- `Icon`: centralized icon set (`gift`, `heart`, `send`, `sparkles`, `users`)

Example:

```tsx
import { Link } from "@/components/Link";
import { Image } from "@/components/Image";
import { Icon } from "@/components/Icon";
```

## Project Structure

```text
src/
  app/
    (main)/            # authenticated app pages
    api/               # route handlers
    login/             # login screen
  components/          # UI components (Link, Image, Icon, Avatar, ...)
  lib/                 # auth, db, users, kudos logic
public/                # static assets + PWA files
```

## Notes

- Database tables are initialized lazily on first query.
- Existing sessions without explicit role are treated as admin for backward compatibility.
