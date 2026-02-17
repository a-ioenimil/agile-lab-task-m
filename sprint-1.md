# Sprint 1: Identity & Core Task Engine 🔐

**Project:** Dispatch (Task Management App)  
**Sprint Goal:** Implement secure JWT authentication and the full backend/frontend lifecycle for Task management (excluding the drag-and-drop UI).  
**Duration:** 1-2 Weeks  

---

## 🛑 Definition of Ready (DoR)
* [x] Sprint 0 environment is stable (DB connected, Vite running).
* [x] Database schemas for `Users` and `Tasks` are finalized.
* [x] Design patterns (Repository/Service) are agreed upon.

## ✅ Definition of Done (DoD) for Sprint 1
* User can register, log in, and stay logged in (JWT in LocalStorage/Cookies).
* Authenticated users can create, edit, and delete tasks.
* All API responses follow the Pydantic v2 schemas defined.
* Frontend state is managed via TanStack Query (fetching/mutations).
* Unauthorized users are redirected to the Login page via TanStack Router guards.

---

## 🔐 Epic 2: Identity & Access Management (IAM)
**Context:** Securing the "Dispatch" app and ensuring tasks belong to specific users.

### 📝 Story 2.1: JWT Authentication System (Backend)
**As a** User,  
**I want** to create an account and log in securely,  
**So that** my tasks are private and persistent.

* **Task 2.1.1: User Model & Migrations**
    * Create `User` SQLAlchemy model (id, email, hashed_password, full_name).
    * Run `alembic revision --autogenerate`.
* **Task 2.1.2: Security Utilities**
    * Implement password hashing using `passlib` with `bcrypt`.
    * Implement JWT token generation (access & refresh tokens) using `python-jose`.
* **Task 2.1.3: Auth Endpoints**
    * `POST /auth/register`: Validate email uniqueness and hash password.
    * `POST /auth/login`: Verify credentials and return JWT.
    * Implement `get_current_user` dependency for protected routes.

### 📝 Story 2.2: Auth UI & State Persistence (Frontend)
**As a** User,  
**I want** a clean login interface and automatic session handling,  
**So that** I don't have to log in every time I refresh the page.

* **Task 2.2.1: Login & Register Pages**
    * Build forms using `Shadcn UI` (Form, Input, Button) and `react-hook-form`.
    * Implement validation using `Zod`.
* **Task 2.2.2: Global Auth State**
    * Setup a basic `useAuth` hook or store to track the `user` object.
    * Configure `TanStack Router` "BeforeLoad" guards to protect `/dashboard`.
* **Task 2.2.3: Axios Auth Interceptor**
    * Update `src/lib/api.ts` to attach `Authorization: Bearer <token>` to all outgoing requests if the token exists.

---

## 📋 Epic 3: Task Management & User Directory
**Context:** Building the "Service -> Repository" layers for our primary data entity.

### 📝 Story 3.1: Task CRUD (Backend Service Layer)
**As a** System,  
**I want** a structured way to handle task data,  
**So that** business logic is separated from the API routing.

* **Task 3.1.1: Task Model & Repository**
    * Create `Task` model: `id`, `title`, `description`, `status` (Enum), `priority` (Enum), `creator_id`, `assignee_id`.
    * Implement `TaskRepository` with methods: `get_multi`, `create_with_owner`, `update`, `remove`.
* **Task 3.1.2: RESTful Task Endpoints**
    * `GET /tasks`: Return all tasks (filtered by user).
    * `POST /tasks`: Create task with `Pydantic` validation.
    * `PUT /tasks/{id}`: Update status, priority, or assignee.
    * `DELETE /tasks/{id}`: Soft or hard delete a task.

### 📝 Story 3.2: Task Creation & Basic List View (Frontend)
**As a** User,  
**I want** to see my tasks in a simple list and add new ones,  
**So that** I can populate my board before we move to the Kanban view.

* **Task 3.2.1: Task Data Fetching**
    * Implement `useTasks` hook using `TanStack Query` (`queryKey: ['tasks']`).
* **Task 3.2.2: Task Creation Modal**
    * Build a Dialog (Shadcn) containing a form for Title, Description, and Priority (Low, Medium, High).
    * Implement `useMutation` to invalidate the task list upon success.
* **Task 3.2.3: User Assignment Dropdown**
    * Implement `GET /users` endpoint to fetch potential assignees.
    * Add a "Select" component to the Task form to assign a user to a task.

---

## 🛠 Sprint 1 Technical Considerations
* **Pydantic v2:** Ensure all response schemas use `from_attributes = True` for SQLAlchemy compatibility.
* **TanStack Query v5:** Use the new `pending` and `error` states for better UX during loading.
* **Error Handling:** Create a global Axios interceptor to catch `401 Unauthorized` errors and redirect users to `/login`.

---

## 🚀 Sprint 1 Review Demonstration
1. **Registration:** Create a new account.
2. **Login:** Log in and show the JWT being stored in the browser.
3. **Task Creation:** Create 3 tasks with different priorities.
4. **Data Persistence:** Refresh the page and show that the tasks are still there (fetched from Postgres).
5. **Security:** Attempt to access `/tasks` via a browser tab that is not logged in (verify redirect).