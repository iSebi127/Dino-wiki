# Dino Wiki — Frontend (React)

This folder contains a Vite + React port of the original Dino Wiki static frontend.

What I converted:
- All styles preserved (original CSS is in `frontend/css/style.css`).
- The XML data file `frontend/xml/dinosaurs.xml` is used as a fallback if the backend `/api/dinosaurs` is unavailable.
- Images and other static assets are referenced from the project root `images/` folder so existing images continue to work.
- The app attempts the REST API first and falls back to the XML file same as original behavior.

Quick start (Windows cmd.exe):

1. Open a terminal in `frontend`:

```cmd
cd frontend
npm install
npm run dev
```

2. Open http://localhost:5173

Notes:
- The project uses Vite. If you want to serve the whole monorepo with the backend, see the root `docker-compose.yml` and backend code.
- If you use the root `http-server` script, make sure to serve the `frontend` folder contents such that `/xml/dinosaurs.xml` and `/images/*` are reachable.

If you want I can also wire the backend to the frontend dev server (proxy) or add TypeScript and unit tests—tell me which you'd prefer next.
