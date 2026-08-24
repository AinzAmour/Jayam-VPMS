# 14. Implementation & Development Plan — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Target Timeline:** 2 Calendar Days
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Implementation Roadmap & Milestones

```mermaid
gantt
    title VPMS 2-Day Implementation Schedule
    dateFormat  YYYY-MM-DD
    section Day 1: Backend & Core
    Phase 1: Project Setup & DB Models       :done, p1, 2026-08-24, 4h
    Phase 2: Auth & RBAC Middleware          :done, p2, after p1, 3h
    Phase 3: Visitor Engine & Business Rules :active, p3, after p2, 5h
    section Day 2: Frontend & Polish
    Phase 4: Role Dashboards & Workflows     :p4, 2026-08-25, 6h
    Phase 5: Reports & Audit Trails          :p5, after p4, 3h
    Phase 6: Seeding, QA & Deployment        :p6, after p5, 3h
```

---

## 2. Phase-by-Phase Task Breakdown

---

### Phase 1 — Project Foundation & Database Modeling
- **Goal:** Initialize monolithic or split repository structure, configure environment variables, connect MongoDB, and implement Mongoose models.

| Task ID | Task Description | Dependencies | Priority | Related Req |
| :--- | :--- | :---: | :---: | :---: |
| `TSK-01` | Scaffold `server/` and `client/` directories with package manifests | None | `P0` | `NFR-CODE-01` |
| `TSK-02` | Setup MongoDB Atlas connection utility with Mongoose | `TSK-01` | `P0` | `NFR-PERF-03` |
| `TSK-03` | Implement `User` schema with bcrypt hashing pre-save hook | `TSK-02` | `P0` | `FR-AUTH-01` |
| `TSK-04` | Implement `Employee` schema with uniqueness constraints | `TSK-02` | `P0` | `FR-ADM-01` |
| `TSK-05` | Implement `VisitPass` schema with compound indexes | `TSK-02` | `P0` | `FR-VIS-01` |
| `TSK-06` | Implement `ActivityLog` schema with action enums | `TSK-02` | `P0` | `FR-AUD-01` |

---

### Phase 2 — Authentication & RBAC Layer
- **Goal:** Build JWT authentication, role verification middleware, and seed initial demo accounts.

| Task ID | Task Description | Dependencies | Priority | Related Req |
| :--- | :--- | :---: | :---: | :---: |
| `TSK-07` | Implement `POST /api/auth/login` and JWT generator helper | `TSK-03` | `P0` | `FR-AUTH-01` |
| `TSK-08` | Build `authMiddleware` (token verify) & `roleGuard` (RBAC check) | `TSK-07` | `P0` | `FR-AUTH-03` |
| `TSK-09` | Create database seed script (`server/utils/seed.js`) with demo accounts | `TSK-03`, `TSK-04` | `P0` | `FR-ADM-01` |
| `TSK-10` | Implement Admin User Management API (`/api/users`) | `TSK-08` | `P0` | `FR-ADM-02` |
| `TSK-11` | Implement Admin Employee Management API (`/api/employees`) | `TSK-08` | `P0` | `FR-ADM-01` |

---

### Phase 3 — Visitor Domain & Business Rules Engine (Rules 1–10)
- **Goal:** Build core visitor registration, approval, check-in/out endpoints with complete business rule validation.

| Task ID | Task Description | Dependencies | Priority | Related Req |
| :--- | :--- | :---: | :---: | :---: |
| `TSK-12` | Implement visitor registration controller with Rules 1, 2, 3, 4, 5 validation | `TSK-05`, `TSK-08` | `P0` | `FR-VIS-01` |
| `TSK-13` | Implement employee review controller (`APPROVE` / `REJECT` with remarks) | `TSK-12` | `P0` | `FR-VIS-02` |
| `TSK-14` | Implement check-in controller enforcing Rules 6, 7, 9 | `TSK-13` | `P0` | `FR-VIS-03` |
| `TSK-15` | Implement check-out controller enforcing Rule 8 | `TSK-14` | `P0` | `FR-VIS-04` |
| `TSK-16` | Implement visit cancellation controller enforcing Rule 10 | `TSK-12` | `P1` | `FR-VIS-05` |
| `TSK-17` | Integrate automatic `ActivityLog` dispatch across all state transitions | `TSK-06`, `TSK-12` | `P0` | `FR-AUD-01` |

---

### Phase 4 — Frontend UI, Role Dashboards & Workflows
- **Goal:** Build React application, layout shells, route guards, and role-specific screens.

| Task ID | Task Description | Dependencies | Priority | Related Req |
| :--- | :--- | :---: | :---: | :---: |
| `TSK-18` | Configure Tailwind CSS, Axios client, and `AuthContext` | `TSK-01` | `P0` | `FR-AUTH-02` |
| `TSK-19` | Build Login Screen (`/login`) with 1-click Demo Account switchers | `TSK-18` | `P0` | `FR-AUTH-01` |
| `TSK-20` | Build Protected Route guards and role navigation sidebar | `TSK-18` | `P0` | `FR-AUTH-02` |
| `TSK-21` | Build Receptionist Dashboard & Live Check-In/Out Table | `TSK-14`, `TSK-15` | `P0` | `FR-DASH-02` |
| `TSK-22` | Build Visitor Registration Form with interactive validation hints | `TSK-12` | `P0` | `FR-VIS-01` |
| `TSK-23` | Build Employee Dashboard & Approve/Reject Modal with Remarks | `TSK-13` | `P0` | `FR-DASH-03` |
| `TSK-24` | Build Admin Dashboard with aggregate workplace occupancy KPIs | `TSK-10`, `TSK-11` | `P0` | `FR-DASH-01` |

---

### Phase 5 — Search, Reports & Audit History
- **Goal:** Build multi-criteria search, date-filtered summary reports, and audit trail views.

| Task ID | Task Description | Dependencies | Priority | Related Req |
| :--- | :--- | :---: | :---: | :---: |
| `TSK-25` | Build Multi-criteria Search & Filter view on Visitor History | `TSK-12` | `P0` | `FR-REP-01` |
| `TSK-26` | Build Admin Reports page (Today, This Week, Custom Date Range) | `TSK-24` | `P0` | `FR-REP-02` |
| `TSK-27` | Build System Audit Trail table & Per-Pass Activity Timeline Modal | `TSK-17` | `P0` | `FR-AUD-01` |
| `TSK-28` | Build Admin Employee and User Management CRUD Modals | `TSK-10`, `TSK-11` | `P0` | `FR-ADM-01` |

---

### Phase 6 — Integration Testing, Validation & Seeding
- **Goal:** Validate all 10 business rules, edge cases, responsive UI, and error handling.

| Task ID | Task Description | Dependencies | Priority | Related Req |
| :--- | :--- | :---: | :---: | :---: |
| `TSK-29` | Execute end-to-end testing across all 10 business rules | `TSK-21` - `TSK-28` | `P0` | All Rules |
| `TSK-30` | Verify responsive design across Mobile, Tablet, and Desktop viewports | `TSK-20` - `TSK-28` | `P0` | `NFR-UI-01` |
| `TSK-31` | Refine loading skeletons, error toasts, and empty states | `TSK-21` - `TSK-28` | `P0` | `NFR-UI-02` |

---

### Phase 7 — Production Deployment & Handover
- **Goal:** Deploy client to Vercel/Netlify, deploy server to Render/Railway, connect Atlas, write README.

| Task ID | Task Description | Dependencies | Priority | Related Req |
| :--- | :--- | :---: | :---: | :---: |
| `TSK-32` | Configure production build scripts and environment variables | `TSK-29` | `P0` | `NFR-CODE-03` |
| `TSK-33` | Deploy Backend API & Frontend SPA to cloud providers | `TSK-32` | `P0` | Submission |
| `TSK-34` | Write comprehensive `README.md` with setup, API docs, and seed logins | `TSK-33` | `P0` | Submission |
