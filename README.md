# Dino Wiki — Fullstack Upgrade to Spring Boot + Postgres (Docker)

This project is your existing static Dino Wiki UI. I updated it to load dinosaur data from a backend REST API and added a sample Spring Boot backend with Postgres, packaged to run in Docker Compose.

Overview
- Frontend: static files (HTML/CSS/JS) in project root. `js/app.js` now fetches data from `/api/dinosaurs`.
- Backend: Spring Boot app in `backend/` exposing CRUD REST endpoints under `/api/dinosaurs`.
- Database: Postgres, seeded with a couple of sample entries via `data.sql`.
- Docker: `docker-compose.yml` runs Postgres + backend. The backend maps `./images` into the container so image URLs like `images/tyrannosaurus.jpg` work.

Quick start (Windows cmd.exe)
1. Open a terminal in the project root (`C:\Users\sebim\Documents\GitHub\Dino-wiki`).
2. Build & run with Docker Compose:

```cmd
docker compose up --build
```

3. Open the frontend in your browser: http://localhost:8080/index.html
   - The backend is at http://localhost:8080/api/dinosaurs

Notes & troubleshooting
- If you prefer to run backend locally without Docker, open `backend/` in your IDE (IntelliJ/WebStorm) and run the Spring Boot app. Configure `application.properties` datasource to point to your Postgres.
- The backend serves images via the mounted `./images` volume in docker-compose. If you access the frontend directly as file://, the fetch to `/api/dinosaurs` will fail — use http://localhost:8080.

Spring Boot hints (for your assignment)
- Project type: Spring Boot 3.x, Java 17, Maven.
- Main concepts to implement:
  - Entity: `Dinosaur` — modeled with JPA annotations.
  - Repository: `DinosaurRepository` extends `JpaRepository`.
  - Controller: `DinosaurController` exposes GET/POST/PUT/DELETE.
  - Database: PostgreSQL, with `data.sql` for initial seeding.
  - Docker: backend is containerized and linked to Postgres via Docker Compose.

Suggested extra steps for the assignment
- Add DTOs and validation (`@Valid`, `@NotBlank`) for create/update requests.
- Add pagination and filtering on backend (e.g., by `period`) and wire it to frontend filter buttons.
- Add simple authentication (HTTP basic) if needed.
- Add unit/integration tests using Spring Boot Test and Testcontainers for Postgres.

If you want, I can now:
- a) finish wiring CORS/static file serving so frontend assets are served by the backend automatically,
- b) add validation and DTOs,
- c) run Docker Compose here to confirm it boots (I can only provide commands; I can't actually run Docker on your machine), or
- d) adjust the frontend image sizes / modal behavior as earlier discussed.

Tell me which next step you want and I will implement it.

