# StudyVault

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. The local owner login is `owner` / `vault2026` / `secure999`.

## Visitor analytics

The owner dashboard records browsing sessions, course navigation, MCQ attempts, and resources opened in the reader. It refreshes from the server every three seconds. Visitors are represented by a random browser ID; names and IP addresses are not stored. Opening a resource is recorded as an open, not proof that it was read completely.

Events are stored in `.studyvault-data/analytics.json`, which is excluded from Git. A production host must provide persistent disk storage for this directory to retain analytics across restarts.

## Deploy with Node.js

Build with `npm run build`, then start with `npm start` on a Node.js host. Set `NODE_ENV=production` and configure all values from `.env.example` as host environment variables. Production startup refuses to use the development credentials. Keep the analytics data directory on persistent storage.