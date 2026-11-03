# typescript-next

Next.js (TypeScript + Tailwind + shadcn/ui) frontend for the Fastify auth API.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

App runs on [http://localhost:3001](http://localhost:3001).

Make sure the Fastify API is running on `http://localhost:3000` with `CORS_ORIGIN=http://localhost:3001`.

## Pages

- `/` landing
- `/login`
- `/register`
- `/dashboard` (requires auth cookie)
