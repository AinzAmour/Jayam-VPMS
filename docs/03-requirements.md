# 03. System Requirements Specification — Visitor Pass Management System (VPMS)

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Functional Requirements (FR)

### 1.1 Authentication & Role-Based Access Control (RBAC)

#### `FR-AUTH-01`: Secure User Login
- **Description:** Users log into the system with email and password to receive a signed JWT token.
- **User:** All (Administrator, Receptionist, Employee)
- **Trigger:** User enters credentials and clicks "Log In" on `/login`.
- **Expected Behavior:** System validates credentials against MongoDB (hashed password with bcrypt); generates JWT containing `userId`, `name`, `email`, and `role`.
- **Result:** User is redirected to their role-specific dashboard (`/admin/dashboard`, `/receptionist/dashboard`, `/employee/dashboard`).
- **Priority:** `P0` (Must Have)

#### `FR-AUTH-02`: Role-Based Navigation & Route Protection
- **Description:** Restrict client-side routes and navigation menus based on logged-in role.
- **User:** All
- **Trigger:** Page load, route transition, or unauthorized URL entry.
- **Expected Behavior:** Unauthenticated users are redirected to `/login`. Authenticated users attempting to access unauthorized routes (e.g. Employee visiting `/admin/users`) are redirected to an Access Denied / 403 screen or their default dashboard.
- **Result:** Navigation bar dynamically renders only permissible links for that role.
- **Priority:** `P0` (Must Have)

#### `FR-AUTH-03`: API Authorization Middleware
- **Description:** Server-side validation of JWT and role permissions on protected API endpoints.
- **User:** System / API Clients
- **Trigger:** Incoming HTTP request with `Authorization: Bearer <token>`.
- **Expected Behavior:** Middleware verifies token signature and expiration; attaches user payload to `req.user`; checks if `req.user.role` has permission for the requested resource. If invalid or forbidden, responds with HTTP `401 Unauthorized` or `403 Forbidden`.
- **Result:** Backend data and actions are fully protected against unauthorized manipulation.
- **Priority:** `P0` (Must Have)

---

### 1.2 Dashboard Specifications

#### `FR-DASH-01`: Administrator Dashboard
- **Description:** Display enterprise-wide visitor metrics and workplace KPIs.
- **User:** Administrator
- **Trigger:** Navigating to `/admin/dashboard`.
- **Expected Behavior:** Fetch and display aggregate metrics:
  - Total Visitors Today
  - Visitors Currently Inside (`CHECKED_IN` status)
  - Total Registered Employees
  - Scheduled Visitors for Today/Upcoming
  - Total Pending Approval Requests
- **Result:** Real-time KPI summary cards and quick access links to user/employee management and reports.
- **Priority:** `P0` (Must Have)

#### `FR-DASH-02`: Receptionist Dashboard
- **Description:** Display operational lobby metrics and immediate check-in/out queues.
- **User:** Receptionist
- **Trigger:** Navigating to `/receptionist/dashboard`.
- **Expected Behavior:** Fetch and display:
  - Today's Visitors count
  - Visitors Currently Inside count
  - Scheduled / Expected Visitors table for today
  - Quick Action list for 1-click Check-In (for `APPROVED` passes) and Check-Out (for `CHECKED_IN` passes).
- **Result:** Receptionist can immediately handle lobby flow from a centralized screen.
- **Priority:** `P0` (Must Have)

#### `FR-DASH-03`: Employee Dashboard
- **Description:** Display host-specific visitor queues and approval tasks.
- **User:** Employee
- **Trigger:** Navigating to `/employee/dashboard`.
- **Expected Behavior:** Fetch and display:
  - Count of Pending Visitor Requests awaiting approval (prominently flagged if near limit of 3)
  - Today's Approved Visitors visiting this employee
  - Table of active and historical visitor requests assigned to this employee.
- **Result:** Employee can review, approve, or reject visitor requests.
- **Priority:** `P0` (Must Have)

---

### 1.3 Visitor Management & Workflow

#### `FR-VIS-01`: Visitor Registration
- **Description:** Receptionist registers a new visitor for an on-site visit.
- **User:** Receptionist
- **Trigger:** Submitting the visitor registration form.
- **Expected Behavior:** Validate input fields:
  - Visitor Name, Visitor Phone, Visitor Email (optional/recommended), Organization/Company
  - Employee to Visit (Dropdown of active employees)
  - Visit Date (cannot be earlier than current date — **Rule 3**)
  - Expected Arrival Time (for today's visits, cannot be earlier than current time — **Rule 4**)
  - Purpose of Visit
  - Check that visitor has no other active visit (**Rule 1**)
  - Check that no duplicate registration exists for the same visitor on the same date (**Rule 2**)
  - Check that the designated host employee has $< 3$ pending requests (**Rule 5**).
- **Result:** Visit record created with status `PENDING_APPROVAL`; audit log entry created (`CREATED`); returned to Receptionist with confirmation.
- **Priority:** `P0` (Must Have)

#### `FR-VIS-02`: Employee Request Review (Approve / Reject)
- **Description:** Host employee reviews and approves or rejects a pending visitor request.
- **User:** Employee (Host)
- **Trigger:** Clicking "Approve" or "Reject" on a pending request in the Employee portal.
- **Expected Behavior:**
  - If "Approve": Prompt for optional remarks; update status to `APPROVED`; log activity `APPROVED`.
  - If "Reject": Prompt for remarks; update status to `REJECTED`; log activity `REJECTED`.
- **Result:** Status updated in database; request disappears from pending queue; receptionist view updates to allow check-in if approved.
- **Priority:** `P0` (Must Have)

#### `FR-VIS-03`: Visitor Check-In
- **Description:** Receptionist checks in a physical visitor upon lobby arrival.
- **User:** Receptionist
- **Trigger:** Clicking "Check In" on an approved visitor record.
- **Expected Behavior:**
  - Verify visit status is strictly `APPROVED` (**Rule 6**, **Rule 9**).
  - Verify visitor is not already checked in elsewhere (**Rule 7**).
  - Record `checkInTime` as current timestamp.
  - Update status to `CHECKED_IN`.
  - Create activity history entry `CHECKED_IN`.
- **Result:** Visitor is marked inside building; KPI "Visitors Currently Inside" increments by 1.
- **Priority:** `P0` (Must Have)

#### `FR-VIS-04`: Visitor Check-Out
- **Description:** Receptionist checks out a departing visitor.
- **User:** Receptionist
- **Trigger:** Clicking "Check Out" on an active visitor record.
- **Expected Behavior:**
  - Verify visit status is `CHECKED_IN`.
  - Record `checkOutTime` as current timestamp.
  - Verify `checkOutTime > checkInTime` (**Rule 8**).
  - Update status to `CHECKED_OUT`.
  - Create activity history entry `CHECKED_OUT`.
- **Result:** Visit is finalized; visitor count inside building decrements by 1; record moves to history.
- **Priority:** `P0` (Must Have)

#### `FR-VIS-05`: Visit Cancellation
- **Description:** Cancel a pending or approved visit prior to check-in.
- **User:** Receptionist / Administrator / Employee
- **Trigger:** Clicking "Cancel Visit" and providing a reason.
- **Expected Behavior:**
  - Verify visit status is `PENDING_APPROVAL` or `APPROVED` (not yet checked in).
  - Update status to `CANCELLED`.
  - Ensure cancelled visit does not appear in active visitor lists (**Rule 10**).
  - Create activity history entry `CANCELLED`.
- **Result:** Visit is deactivated and archived with cancellation reason.
- **Priority:** `P1` (Should Have)

---

### 1.4 Search, History & Reports

#### `FR-REP-01`: Multi-Criteria Search & Filtering
- **Description:** Search and filter visitor records dynamically.
- **User:** Administrator, Receptionist, Employee (scoped to own visits)
- **Trigger:** User enters text in search input or modifies dropdown filters.
- **Expected Behavior:** Filter visitor records matching combinations of:
  - Visitor Name (case-insensitive substring)
  - Employee Name (case-insensitive substring)
  - Visit Date (exact date or range)
  - Status (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`).
- **Result:** Real-time filtered tabular display with pagination and clear sort indicators.
- **Priority:** `P0` (Must Have)

#### `FR-REP-02`: Summary Reports & Analytics
- **Description:** Generate aggregated visitor summary reports.
- **User:** Administrator
- **Trigger:** Selecting report timeframe on `/admin/reports` (Today, This Week, Custom Date Range).
- **Expected Behavior:** Aggregate and return:
  - Total visitor count in range
  - Count by status (Approved, Rejected, Completed/Checked-Out, Cancelled)
  - Peak visit hours distribution
  - Employee host leaderboard / most visited departments
- **Result:** Visual summary cards, statistics tables, and export-ready view.
- **Priority:** `P0` (Must Have)

#### `FR-AUD-01`: Immutable Activity History / Audit Trail
- **Description:** Record and display the lifecycle events of every visitor pass.
- **User:** Administrator (System-wide), Receptionist/Employee (per-pass history modal)
- **Trigger:** Every state transition (`CREATED`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`).
- **Expected Behavior:** Insert an audit document containing:
  - `visitId` (Reference)
  - `action` (Enum)
  - `timestamp` (UTC Date/Time)
  - `performedBy` (User ID, Name, Role)
  - `remarks` / notes
- **Result:** Chronological audit trail viewable on demand for transparency and security audits.
- **Priority:** `P0` (Must Have)

---

### 1.5 Administration & Directory Management

#### `FR-ADM-01`: Employee Management (CRUD)
- **Description:** Administrator creates, updates, views, and deactivates employee profiles.
- **User:** Administrator
- **Trigger:** Navigating to `/admin/employees`.
- **Expected Behavior:** Form to add/edit employee: Employee Code, Full Name, Department, Email, Phone, Designation, Status (Active/Inactive).
- **Result:** Employee directory updated; active employees become selectable in visitor registration.
- **Priority:** `P0` (Must Have)

#### `FR-ADM-02`: User Account Management (CRUD)
- **Description:** Administrator manages user accounts and credentials.
- **User:** Administrator
- **Trigger:** Navigating to `/admin/users`.
- **Expected Behavior:** Admin can create user accounts, assign roles (`ADMINISTRATOR`, `RECEPTIONIST`, `EMPLOYEE`), link account to an Employee record (if role is `EMPLOYEE`), reset passwords, and toggle account activation.
- **Result:** Role permissions enforced across authentication system.
- **Priority:** `P0` (Must Have)

---

## 2. Non-Functional Requirements (NFR)

### 2.1 Performance (`NFR-PERF`)
- `NFR-PERF-01`: API Response Time — 95% of standard CRUD and query requests must respond in $< 200\text{ ms}$ under normal network conditions.
- `NFR-PERF-02`: Client-side Render — Initial page load / First Contentful Paint (FCP) $\le 1.5\text{ s}$; route transitions $\le 100\text{ ms}$.
- `NFR-PERF-03`: Database Indexing — Compound and unique indexes on `phone`, `email`, `visitDate`, `status`, `employeeId` to guarantee sub-50ms query execution.

### 2.2 Security (`NFR-SEC`)
- `NFR-SEC-01`: Password Hashing — Passwords hashed using `bcrypt` with a work factor (salt rounds) of $\ge 10$.
- `NFR-SEC-02`: JWT Token Security — Tokens signed with HMAC-SHA256 using strong environment secrets; expiration set to 8 hours.
- `NFR-SEC-03`: Input Sanitization & Injection Prevention — All incoming payloads validated via schema validators (e.g. Zod or Joi) and Mongoose models to prevent NoSQL injection and XSS.
- `NFR-SEC-04`: HTTP Security Headers — Implement Helmet middleware to configure secure headers (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options).
- `NFR-SEC-05`: Rate Limiting — Protect `/api/auth/login` with express-rate-limit (max 10 requests per 15 minutes per IP).

### 2.3 Reliability & Availability (`NFR-REL`)
- `NFR-REL-01`: Error Handling — Centralized Express error handler returning structured JSON errors (`{ success: false, message: string, errors?: [] }`) without exposing server stack traces in production.
- `NFR-REL-02`: Graceful UI Recovery — React Error Boundaries around main page layouts to prevent full application crashes on unexpected runtime exceptions.

### 2.4 Usability & Responsiveness (`NFR-UI`)
- `NFR-UI-01`: Multi-Device Responsive Design — Seamless layout adaptation across Desktop ($\ge 1280\text{px}$), Tablet ($768\text{px} - 1024\text{px}$), and Mobile ($375\text{px} - 767\text{px}$).
- `NFR-UI-02`: Clean Visual Feedback — Loading spinners, skeleton placeholders for data tables, toast notifications for success/error responses, and accessible confirmation dialogs for destructive actions.
- `NFR-UI-03`: Keyboard Navigation & Accessibility — Semantic HTML5 elements (`<main>`, `<nav>`, `<header>`, `<button>`, `<input>`), WCAG 2.1 AA compliant color contrast ratios, clear focus rings.

### 2.5 Maintainability & Code Quality (`NFR-CODE`)
- `NFR-CODE-01`: Modular Project Architecture — Strict separation of concerns (Frontend: components, pages, context, hooks, services; Backend: controllers, services, models, middleware, routes).
- `NFR-CODE-02`: Consistent Formatting & Linting — Clean code formatting, reusable components, modular CSS/Tailwind utilities.
- `NFR-CODE-03`: Zero Hardcoded Secrets — All database URIs, JWT secrets, and port configurations loaded strictly from environment variables (`.env`).
