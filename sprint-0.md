# Sprint 0: Foundation & Architecture 🏗️

**Project:** Dispatch (Task Management App)  
**Sprint Goal:** Establish a "Walking Skeleton"—a fully configured development environment where the Frontend (React 19) talks to the Backend (FastAPI), and the Backend connects to the Database (PostgreSQL).  
**Duration:** 1 Week  

---

## 🛑 Definition of Ready (DoR)
* [x] Tech stack defined (React 19, FastAPI, Postgres).
* [x] Repo initialized.
* [x] Development environment requirements (Docker, Node, Python) installed.

## ✅ Definition of Done (DoD) for Sprint 0
* Both Frontend and Backend run locally via a single command (or documented steps).
* Database container is spinning up and accessible.
* Linter and Formatter rules are configured and passing.
* Project structure follows the defined Clean Architecture.
* A "Health Check" API endpoint returns `200 OK` from Backend to Frontend.

---

## 📋 Epic 1: Infrastructure & Backend Core
**Context:** We need a robust, async-ready backend foundation before building business logic.

### 📝 Story 1.1: Project Scaffolding & Docker Setup
**As a** Developer,  
**I want** a dockerized PostgreSQL database and a structured FastAPI project,  
**So that** I can develop in an isolated environment that mirrors production.

* **Task 1.1.1: Repository & Monorepo Structure**
    * Initialize Git repo.
    * Create root directories: `/backend`, `/frontend`, `/docs`.
    * Setup root `.gitignore` (Python, Node, OS junk).
* **Task 1.1.2: Database Containerization**
    * Create `docker-compose.yml`.
    * Define `postgres` service (Image: `postgres:15-alpine`).
    * Configure environment variables (`POSTGRES_USER`, `POSTGRES_DB`, `POSTGRES_PASSWORD`) in a `.env` file.
    * **Success Criteria:** Running `docker-compose up -d` starts the DB.

### 📝 Story 1.2: FastAPI & SQLAlchemy (Async) Configuration
**As a** Backend Engineer,  
**I want** the FastAPI app configured with Async SQLAlchemy and Pydantic v2,  
**So that** I have a performant ORM layer ready for schema definitions.

* **Task 1.2.1: Python Dependency Management**
    * Initialize Poetry or `requirements.txt`.
    * Install: `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg`, `pydantic-settings`, `alembic`.
* **Task 1.2.2: Layered Architecture Setup**
    * Create folder structure:
        * `app/core/` (Config, Security)
        * `app/db/` (Session, Base Class)
        * `app/models/` (SQLAlchemy Models)
        * `app/schemas/` (Pydantic Models)
        * `app/api/v1/endpoints/` (Routes)
        * `app/services/` (Business Logic)
* **Task 1.2.3: Database Connection & Session**
    * Implement `app/core/config.py` using `BaseSettings` to read `.env`.
    * Setup `AsyncEngine` and `AsyncSession` local maker in `app/db/session.py`.
* **Task 1.2.4: Alembic Setup**
    * Run `alembic init` (configured for async execution).
    * Modify `env.py` to import the Base model (for autogenerate support).

---

## 🎨 Epic 2: Frontend Foundation & Modern Stack
**Context:** Setting up React 19 with the specific "bleeding edge" requirements (Tailwind v4, TanStack Router).

### 📝 Story 2.1: Vite & React 19 Scaffolding
**As a** Frontend Engineer,  
**I want** a Vite project configured with React 19 and TypeScript,  
**So that** I can begin building UI components with the latest features.

* **Task 2.1.1: Vite Initialization**
    * Scaffold project: `npm create vite@latest frontend -- --template react-ts`.
    * Ensure `react` and `react-dom` are on version 19 (RC or latest stable).
    * Configure `tsconfig.json` paths alias (`@/*` -> `./src/*`).
* **Task 2.1.2: Tailwind CSS v4 Setup**
    * Install Tailwind v4 (PostCSS is no longer strictly required in v4, check specific Vite plugin).
    * Configure `index.css` with v4 directives.
    * Verify HMR (Hot Module Replacement) works with style changes.

### 📝 Story 2.2: Core Libraries Integration
**As a** Frontend Engineer,  
**I want** TanStack Router, Query, and Shadcn UI installed,  
**So that** I have my routing, state, and UI library ready.

* **Task 2.2.1: TanStack Router & Query**
    * Install `@tanstack/react-router` and `@tanstack/react-query`.
    * Create `src/providers` to wrap the app with `QueryClientProvider` and `RouterProvider`.
    * Create a basic root route (`__root.tsx`) and an index route.
* **Task 2.2.2: Shadcn UI & Lucide Icons**
    * Run `npx shadcn-ui@latest init`.
    * Configure `components.json`.
    * Install `lucide-react`.
    * Add a test button component to verify the setup.
* **Task 2.2.3: Axios Instance**
    * Create `src/lib/api.ts`.
    * Setup Axios instance with `baseURL` pointing to `http://localhost:8000`.
    * (Placeholder) Add empty interceptors for Request/Response (to be filled in Sprint 1).

---

## 🛠 Epic 3: Developer Experience (DX)
**Context:** Enforcing code quality from Day 1 prevents technical debt.

### 📝 Story 3.1: Linting & Formatting
**As a** Team Lead,  
**I want** strict linting rules,  
**So that** the codebase remains consistent across the team.

* **Task 3.1.1: Backend DX**
    * Configure `ruff` (or Black/Isort) for Python linting.
    * Add `pre-commit` hooks (optional but recommended).
* **Task 3.1.2: Frontend DX**
    * Configure ESLint for React 19/TypeScript.
    * Configure Prettier.

---

## 🚀 Sprint 0 Review Demonstration
At the end of this sprint, we will demonstrate:
1.  **Terminal 1:** `docker-compose up` running Postgres.
2.  **Terminal 2:** `uvicorn app.main:app --reload` starting the Backend.
    * Show Swagger UI at `/docs`.
3.  **Terminal 3:** `npm run dev` starting the Frontend.
    * Show the "Home" page with a Shadcn Button.
    * Show the Network tab successfully pinging the Backend health endpoint.