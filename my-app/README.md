This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AI Configuration

This app supports a global AI configuration exposed to clients.

- Enable and select model via environment: see [my-app/.env.local](my-app/.env.local)
- The API endpoint exposes the current config: [my-app/app/api/ai/config/route.ts](my-app/app/api/ai/config/route.ts)

Environment variables:
- AI_ENABLED: set to true to enable for all clients
- AI_PROVIDER: e.g. anthropic
- AI_MODEL: server-side default (e.g. claude-sonnet-4.5)
- NEXT_PUBLIC_AI_MODEL: client-visible model name
- ANTHROPIC_API_KEY: required if you later call Anthropic APIs

Quick test:

```bash
curl http://localhost:3000/api/ai/config
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
