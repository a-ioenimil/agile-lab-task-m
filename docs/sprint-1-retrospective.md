# 🔄 Sprint 1 Retrospective

## Sprint Snapshot
- **Project:** Dispatch
- **Sprint Goal:** Deliver secure identity flows and core task lifecycle (create, list, update, delete) with protected frontend access and query-driven state.
- **Sprint Window:** Sprint 1
- **Overall Outcome:** **Completed**, with authenticated end-to-end flows and a usable task management experience that fed directly into Sprint 2 Kanban work.

## Accomplishments (What went well)

### 1) Identity & Access Delivery
- Implemented `User` persistence model and migrations.
- Added password hashing and JWT token issuance/validation.
- Delivered backend auth endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `get_current_user` dependency for protected routes.
- Implemented frontend login/register forms with form validation and clear submit/error states.

### 2) Frontend Auth Session and Route Protection
- Added auth session persistence and global auth state management.
- Added Axios auth interceptor for bearer token attachment and unauthorized handling.
- Guarded dashboard route access with router-level protection.

### 3) Core Task Engine
- Implemented task model with status and priority enums.
- Delivered repository/service/router layering for task workflows.
- Added protected task endpoints:
  - `GET /tasks`
  - `POST /tasks`
  - `PUT /tasks/{task_id}`
  - `DELETE /tasks/{task_id}`
- Added protected `GET /users` for task assignment workflows.

### 4) Frontend Task Management Baseline
- Added task query hook and create mutation with cache invalidation.
- Added create-task modal/form with assignee selection.
- Added dashboard task listing and then evolved it into Sprint 2 board-compatible shape.

### 5) Quality and Delivery Discipline
- Preserved layered backend architecture (`routers -> services -> repositories`).
- Preserved frontend boundaries (API calls in `lib`, data in hooks, UI in routes/components).
- Repeatedly validated with lint/build/migration/API smoke tests throughout delivery.
- Shipped in atomic, conventional commits and merged via Git Flow.

## Technical Puzzles (What was challenging)

### A) Security package compatibility
- Encountered passlib/bcrypt runtime compatibility friction.
- Stabilized by pinning to a compatible bcrypt version and revalidating auth flow.
- **Learning:** lock critical auth dependencies conservatively.

### B) Frontend interceptor typing and strict TS behavior
- Axios interceptor types required strict internal config typing.
- **Learning:** use precise library types at integration boundaries to avoid latent runtime issues.

### C) Async test/runtime mismatch in local validation paths
- Certain test-client patterns conflicted with async DB runtime behavior.
- Switched to real server + HTTP smoke verification for key authentication and task flows.
- **Learning:** favor realistic runtime smoke paths when harness behavior diverges.

## Process Improvements (Next Steps)

### Engineering Process
- Add a standardized per-story verification checklist (commands + expected outputs).
- Add sprint close checklist item to enforce retrospective creation before sprint transition.

### Technical Process
- Introduce a minimal automated backend route smoke test suite.
- Add frontend hook tests for auth and task data mutations.

### Risk Control
- Track dependency constraints for auth/security packages in lockfiles and sprint notes.
- Keep API contracts explicit with richer schema metadata to reduce frontend-backend drift.

## Definition of Done Review
- ✅ User registration and login implemented.
- ✅ Protected task CRUD implemented.
- ✅ Frontend state managed via TanStack Query hooks.
- ✅ Unauthorized access redirected from protected dashboard routes.
- ✅ API contracts represented via Pydantic schemas.

## Sprint Handoff Recommendation
- Continue Sprint 2 with focus on Kanban UX resilience (optimistic rollback scenarios, visual polish, and performance hardening).
- Keep releases atomic: UX polish, performance optimization, and documentation each in separate commits.
