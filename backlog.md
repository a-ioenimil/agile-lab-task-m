# Product Backlog

**Project:** Dispatch (Task Management App)  
**Version:** 1.0  
**Status:** Sprints 0-2 Completed  

---

## 🏗️ Epic 1: Infrastructure & Backend Core
**Context:** Robust, async-ready backend foundation.

### 📝 Story 1.1: Project Scaffolding & Docker Setup
**As a** Developer, I want a dockerized PostgreSQL database and a structured FastAPI project, so that I can develop in an isolated environment.

- [x] **Task 1.1.1: Repository & Monorepo Structure**
    - [x] Initialize Git repo.
    - [x] Create root directories: `/backend`, `/frontend`, `/docs`.
    - [x] Setup root `.gitignore`.
- [x] **Task 1.1.2: Database Containerization**
    - [x] Create `docker-compose.yml` with Postgres service.
    - [x] Configure environment variables (`POSTGRES_USER`, etc.) in `.env`.
    - [x] Verify DB startup with `docker-compose up -d`.

### 📝 Story 1.2: FastAPI & SQLAlchemy (Async) Configuration
**As a** Backend Engineer, I want the FastAPI app configured with Async SQLAlchemy and Pydantic v2, so that I have a performant ORM layer.

- [x] **Task 1.2.1: Python Dependency Management**
    - [x] Initialize Poetry/requirements.
    - [x] Install `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg`, `alembic`.
- [x] **Task 1.2.2: Layered Architecture Setup**
    - [x] Create structure: `core`, `db`, `models`, `schemas`, `api`, `services`.
- [x] **Task 1.2.3: Database Connection**
    - [x] Implement `app/core/config.py`.
    - [x] Setup `AsyncSession` in `app/db/session.py`.
- [x] **Task 1.2.4: Alembic Setup**
    - [x] Initialize Alembic for async execution.
    - [x] Configure `env.py`.

---

## 🎨 Epic 2: Frontend Foundation & Modern Stack
**Context:** Setup React 19, Tailwind v4, and TanStack Router.

### 📝 Story 2.1: Vite & React 19 Scaffolding
**As a** Frontend Engineer, I want a Vite project with React 19/TS, so that I can build with the latest features.

- [x] **Task 2.1.1: Vite Initialization**
    - [x] Scaffold project with `create-vite`.
    - [x] Configure `tsconfig.json` aliases.
- [x] **Task 2.1.2: Tailwind CSS v4 Setup**
    - [x] Install Tailwind v4.
    - [x] Configure `index.css`.

### 📝 Story 2.2: Core Libraries Integration
**As a** Frontend Engineer, I want TanStack Router/Query and Shadcn UI, so that I have my core toolkit.

- [x] **Task 2.2.1: TanStack Router & Query**
    - [x] Install libraries.
    - [x] Setup `QueryClientProvider` and `RouterProvider`.
- [x] **Task 2.2.2: Shadcn UI & Lucide Icons**
    - [x] Initialize Shadcn UI.
    - [x] Install `lucide-react`.
- [x] **Task 2.2.3: Axios Instance**
    - [x] Create `src/lib/api.ts` with `baseURL`.

---

## 🔐 Epic 3: Identity & Access Management (IAM)
**Context:** Securing the app with JWT authentication.

### 📝 Story 3.1: JWT Authentication System (Backend)
**As a** User, I want to create an account and log in securely.

- [x] **Task 3.1.1: User Model & Migrations**
    - [x] Create `User` model.
    - [x] Generate Alembic migration.
- [x] **Task 3.1.2: Security Utilities**
    - [x] Implement `bcrypt` password hashing.
    - [x] Implement JWT generation with `python-jose`.
- [x] **Task 3.1.3: Auth Endpoints**
    - [x] `POST /auth/register`
    - [x] `POST /auth/login`
    - [x] `get_current_user` dependency.

### 📝 Story 3.2: Auth UI & State Persistence (Frontend)
**As a** User, I want a Clean login interface and automatic session handling.

- [x] **Task 3.2.1: Login & Register Pages**
    - [x] Build forms with Shadcn UI & `react-hook-form`.
    - [x] Validation with `Zod`.
- [x] **Task 3.2.2: Global Auth State**
    - [x] Implement `useAuth` hook/store.
    - [x] Configure Router guards.
- [x] **Task 3.2.3: Axios Auth Interceptor**
    - [x] Attach Bearer token to requests.

---

## 📋 Epic 4: Task Management & User Directory
**Context:** Core CRUD for tasks.

### 📝 Story 4.1: Task CRUD (Backend Service Layer)
**As a** System, I want structured Task data handling.

- [x] **Task 4.1.1: Task Model & Repository**
    - [x] Create `Task` model (title, status, priority, etc.).
    - [x] Implement `TaskRepository` CRUD.
- [x] **Task 4.1.2: RESTful Task Endpoints**
    - [x] `GET`, `POST`, `PUT`, `DELETE` /tasks endpoints.

### 📝 Story 4.2: Task Creation & List View (Frontend)
**As a** User, I want to see and create tasks.

- [x] **Task 4.2.1: Task Data Fetching**
    - [x] `useTasks` hook with TanStack Query.
- [x] **Task 4.2.2: Task Creation Modal**
    - [x] Dialog form for new tasks.
    - [x] Mutation for creation.
- [x] **Task 4.2.3: User Assignment**
    - [x] `GET /users` endpoint.
    - [x] Assignment dropdown in UI.

---

## 🥓 Epic 5: Advanced Kanban UI
**Context:** Drag-and-drop board with real-time state sync.

### 📝 Story 5.1: Drag-and-Drop Implementation
**As a** User, I want to move cards between columns.

- [x] **Task 5.1.1: Column Container Setup**
    - [x] `KanbanBoard` component with OPEN, IN_PROGRESS, DONE columns.
- [x] **Task 5.1.2: @hello-pangea/dnd Integration**
    - [x] Setup `DragDropContext`, `Droppable`, `Draggable`.
- [x] **Task 5.1.3: OnDragEnd Logic**
    - [x] Handle drop events and state updates.

### 📝 Story 5.2: Optimistic Updates & State Sync
**As a** User, I want instant board feedback.

- [x] **Task 5.2.1: TanStack Query Optimistic Updates**
    - [x] `onMutate` cache updates.
    - [x] Rollback on error.
- [x] **Task 5.2.2: Status Persistence**
    - [x] Backend update for task status.

---

## ✨ Epic 6: UX Enhancement & Polish
**Context:** Premium feel and visual cues.

### 📝 Story 6.1: Animations & Visual Cues
**As a** User, I want smooth transitions and clear indicators.

- [x] **Task 6.1.1: Framer Motion Transitions**
    - [x] Entry/exit animations.
    - [x] Layout shifts.
- [x] **Task 6.1.2: Priority & Status Styling**
    - [x] Color-coded badges (High/Red, Med/Yellow, Low/Blue).
- [x] **Task 6.1.3: Empty States**
    - [x] "No Tasks" UI and Loading Skeletons.

---

## 🛠 Epic 7: Developer Experience (DX) & Documentation
**Context:** Code quality and hand-off.

### 📝 Story 7.1: Linting & Standards
**As a** Team Lead, I want strict linting rules.

- [x] **Task 7.1.1: Backend DX**
    - [x] Ruff configuration.
- [x] **Task 7.1.2: Frontend DX**
    - [x] ESLint & Prettier configuration.

### 📝 Story 7.2: Final Documentation
**As a** New Contributor, I want clear setup instructions.

- [x] **Task 7.2.1: README.md Overhaul**
    - [x] Architecture diagram, env vars, setup steps.
- [x] **Task 7.2.2: API Documentation**
    - [x] Finalize Swagger/Redoc.
- [x] **Task 7.2.3: Cleanup**
    - [x] Remove logs and fix types.
