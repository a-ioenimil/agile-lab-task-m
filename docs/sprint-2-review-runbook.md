# 🚀 Sprint 2 Review Runbook

## Purpose
Use this script to run the Sprint 2 demonstration end-to-end in a consistent order.

## Preconditions
- Backend running at `http://127.0.0.1:8000`
- Frontend running at `http://localhost:5173`
- Authenticated user session available
- At least one existing task or ability to create tasks from dashboard

## Demo Flow

### 1) Kanban Drag Flow
1. Open dashboard and confirm three columns are visible: `OPEN`, `IN_PROGRESS`, `DONE`.
2. Create a high-priority task with the `New task` button.
3. Drag the task from `OPEN` to `IN_PROGRESS`.
4. Confirm immediate UI movement and subsequent stable persisted state.

### 2) Resilience / Rollback
1. Enable `Simulated sync failure: ON` (development mode control).
2. Drag the same task to another column.
3. Confirm UI attempts optimistic move, then rolls back to previous column.
4. Disable simulated failure and repeat drag.
5. Confirm movement persists successfully.

### 3) Visual Polish
1. Confirm cards show:
   - Status badge
   - Priority badge color
   - Assignee avatar initials
2. Confirm loading skeletons appear during initial fetch.
3. Confirm empty column states show `No tasks found` where applicable.

### 4) API Documentation
1. Open `http://127.0.0.1:8000/docs`.
2. Confirm tag sections (`health`, `auth`, `users`, `tasks`) include summaries and response descriptions.
3. Confirm task and auth schemas contain descriptive field metadata.

## Quick Validation Commands

### Backend
- `cd backend && uv run ruff check app`
- `cd backend && uv run python -m compileall app`

### Frontend
- `cd frontend && npm run lint`
- `cd frontend && npm run build`

## Expected Outcome
- Drag-and-drop workflow is smooth and resilient.
- Optimistic updates roll forward on success and rollback on failure.
- Documentation and API schema clarity meet Sprint 2 delivery expectations.
