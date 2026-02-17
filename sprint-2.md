# Sprint 2: The Kanban Experience & UI Polish 🎨

**Project:** Dispatch (Task Management App)  
**Sprint Goal:** Implement the interactive drag-and-drop Kanban board with real-time state synchronization and fluid animations.  
**Duration:** 1-2 Weeks  

---

## 🛑 Definition of Ready (DoR)
* [x] Sprint 1 CRUD operations are fully functional and tested.
* [x] Authenticated users can fetch their tasks via `TanStack Query`.
* [x] Layout shell (Header/Sidebar) is stable.

## ✅ Definition of Done (DoD) for Sprint 2
* Tasks can be dragged across "OPEN", "IN_PROGRESS", and "DONE" columns.
* Drag-and-drop triggers an immediate (optimistic) UI update and a background API sync.
* Cards display priority colors and assignee avatars.
* Transitions between states are animated using Framer Motion.
* Final codebase is documented with a clear README and Swagger API docs are finalized.

---

## 📋 Epic 4: Advanced Kanban UI
**Context:** Transforming a static list into a dynamic board.

### 📝 Story 4.1: Drag-and-Drop Implementation
**As a** User,  
**I want** to physically move cards between status columns,  
**So that** I can intuitively manage my project flow.

* **Task 4.1.1: Column Container Setup**
    * Create a `KanbanBoard` component that maps through the `Status` enum.
    * Filter tasks into three specific columns: `OPEN`, `IN_PROGRESS`, `DONE`.
* **Task 4.1.2: @hello-pangea/dnd Integration**
    * Wrap columns in `DragDropContext`.
    * Define `Droppable` areas for columns and `Draggable` items for Task Cards.
* **Task 4.1.3: OnDragEnd Logic**
    * Implement the logic to detect which column a card was dropped into.
    * Update the local state to prevent "flicker" during the drop.



### 📝 Story 4.2: Optimistic Updates & State Sync
**As a** User,  
**I want** the board to feel instantaneous,  
**So that** I don't see loading spinners every time I move a card.

* **Task 4.2.1: TanStack Query Optimistic Updates**
    * Configure `onMutate` in the `useUpdateTask` mutation to manually update the cache.
    * Implement `onError` to roll back the UI state if the backend update fails.
    * Implement `onSettled` to refetch and ensure data consistency.
* **Task 4.2.2: Status Persistence**
    * Ensure the `PUT /tasks/{id}` request correctly updates the `status` field in the Postgres DB.

---

## ✨ Epic 5: UX Enhancement & Polish
**Context:** Making the app feel "Premium" and professional.

### 📝 Story 5.1: Animations & Visual Cues
**As a** User,  
**I want** smooth transitions and clear priority indicators,  
**So that** I can quickly parse the board's state.

* **Task 5.1.1: Framer Motion Transitions**
    * Add entry/exit animations for task cards when created or deleted.
    * Animate column layout shifts using `layout` prop.
* **Task 5.1.2: Priority & Status Styling**
    * Implement color-coded badges (Shadcn UI) for Priority:
        * HIGH: Red/Destructive.
        * MEDIUM: Yellow/Warning.
        * LOW: Blue/Secondary.
* **Task 5.1.3: Empty States & Loading Skeletons**
    * Build a "No Tasks Found" UI for empty columns.
    * Add `Skeleton` components from Shadcn for the initial data fetch.

---

## 📖 Epic 6: Final Delivery & Documentation
**Context:** Ensuring the project is "Done-Done" and hand-off ready.

### 📝 Story 6.1: Documentation & Setup Scripts
**As a** New Contributor,  
**I want** clear instructions on how to run the app,  
**So that** I can get started in under 5 minutes.

* **Task 6.1.1: README.md Overhaul**
    * Include Architecture Diagram.
    * List Environment Variables.
    * Provide `docker-compose` and manual installation steps.
* **Task 6.1.2: API Documentation**
    * Finalize Pydantic docstrings so Swagger (`/docs`) is self-explanatory.
* **Task 6.1.3: Clean Up & Technical Debt**
    * Remove `console.log` statements.
    * Final pass on TypeScript types to ensure no `any` types remain.

---

## 🚀 Sprint 2 Review Demonstration
1. **The Flow:** Drag a "High Priority" task from OPEN to IN_PROGRESS.
2. **The Resilience:** Simulate a network failure (turn off backend) and show the card rolling back to its original column.
3. **The Polish:** Show the "Create Task" modal and the card appearing on the board with an animation.
4. **The Hand-off:** Show the completed README and the automatically generated Swagger documentation.