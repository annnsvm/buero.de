# buero-frontend

React + TypeScript + Vite SPA для [buero.de](https://www.buro-de.com).

## Local dev

```bash
cp env.example .env   # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev
```

Open http://localhost:5173 — requires **local backend** (`buero-backend-api`, port 3000).

Full workflow: [docs/local-development.md](../docs/local-development.md)

## Production

Static Site on Render → https://www.buro-de.com  
Build env: `VITE_API_URL=https://buro-de.onrender.com/api`

## Docs

- [Frontend architecture](docs/frontend-architecture.md)
- [Flows](docs/frontend-flows.md)
- [Features](docs/frontend-features/)
