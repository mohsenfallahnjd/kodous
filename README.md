# Kodous

A minimal service to send appreciation (kodous) to your team. Simple, kind, and personal.

## Features

- **Send a Kodu** — Send a message from you to a teammate
- **View Sent** — See all kodous you've sent
- **My Kodous** — Enter your name to see kodous sent to you

## Getting Started

```bash
npm run dev
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
- In-memory storage (replace with a database for production)
