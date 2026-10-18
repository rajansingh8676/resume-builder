# Resume. — AI Resume Builder (MERN)

React + Tailwind (client) · Node + Express + MongoDB (server) · Gemini (AI) · ImageKit (images + background removal)

## Run
```bash
cd server && cp .env.example .env   # fill in values
npm install && npm run dev          # http://localhost:5000
cd ../client && cp .env.example .env
npm install && npm run dev          # http://localhost:5173
```
## Deploy
- Server: Render/Railway. Set env vars from `.env.example`, `CLIENT_URL` = your frontend URL.
- Client: Vercel/Netlify. Set `VITE_API_URL=https://<server>/api`. Add SPA rewrite to `index.html`.
- DB: MongoDB Atlas. Keys: aistudio.google.com (Gemini), imagekit.io.
