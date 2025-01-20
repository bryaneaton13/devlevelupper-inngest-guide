# Inngest / Nextjs / Prisma

Simple [Next.js](https://nextjs.org) example repo to highlight some features of [Inngest](https://www.inngest.com/).

## What it does

- Create an organization
- Add people to the organization
- Create a broadcast
- Send a broadcast to all people in the organization

Uses Inngest to send out broadcast messages to all people in the organization.

Scalable with Inngest because if a single organization is sending a large number of messages, it will not block other organizations from also sending messages.

## Setup the app

- Spin up the local postgres database with `pnpm run db`
- Run the migrations with `pnpm run prisma:generate`
- Run the seed script with `pnpm run seed`
- Run the app with `pnpm run dev`
- In a new terminal, run the Inngest CLI with `pnpm run inngest` or `npx inngest-cli@latest dev`
