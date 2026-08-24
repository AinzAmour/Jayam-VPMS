# 06. Page Inventory & Screen Specifications — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Complete Page Inventory

| Route / Screen | Purpose | Permitted Roles | Auth Required | MVP Status |
| :--- | :--- | :--- | :--- | :--- |
| `/login` | Secure user authentication | Public / All | No | `MUST HAVE` |
| `/admin/dashboard` | Overall workplace KPIs, occupancy & quick links | `ADMINISTRATOR` | Yes (Admin) | `MUST HAVE` |
| `/admin/employees` | Manage employee directory (CRUD) | `ADMINISTRATOR` | Yes (Admin) | `MUST HAVE` |
| `/admin/users` | Manage user accounts & RBAC assignments | `ADMINISTRATOR` | Yes (Admin) | `MUST HAVE` |
| `/admin/reports` | Filtered visitor statistics & summary reports | `ADMINISTRATOR` | Yes (Admin) | `MUST HAVE` |
| `/admin/audit-logs` | System-wide activity history audit trail | `ADMINISTRATOR` | Yes (Admin) | `MUST HAVE` |
| `/receptionist/dashboard` | Lobby operations, today's visitors & quick actions | `RECEPTIONIST` | Yes (Receptionist) | `MUST HAVE` |
| `/receptionist/register` | Register new visitor pass with business rules | `RECEPTIONIST` | Yes (Receptionist) | `MUST HAVE` |
| `/receptionist/visitors` | Visitor history & search/filter table | `RECEPTIONIST` | Yes (Receptionist) | `MUST HAVE` |
| `/employee/dashboard` | Pending visitor approvals & my hosted visitors | `EMPLOYEE` | Yes (Employee) | `MUST HAVE` |
| `/employee/history` | Historical visitor requests for logged-in host | `EMPLOYEE` | Yes (Employee) | `MUST HAVE` |
| `/unauthorized` | 403 Access Denied fallback screen | All Authenticated | Yes | `MUST HAVE` |
| `/*` (404) | 404 Page Not Found fallback | Public / All | No | `MUST HAVE` |

---

## 2. Detailed Screen Specifications

---

### Page 1: Login Screen (`/login`)
- **Purpose:** Entry point for staff to authenticate into the system.
- **Main Content:** Clean branded authentication card with Email input, Password input, Role-based test demo account quick-fill buttons (for rapid evaluation), and Login button.
- **Main Actions:** Enter credentials, click "Sign In", click quick-login demo pills (Admin / Receptionist / Employee).
- **Navigation:** Upon success, routes to role dashboard (`/admin/dashboard`, `/receptionist/dashboard`, or `/employee/dashboard`).
- **Required Data:** Form inputs (`email`, `password`).
- **Loading State:** Spinner inside the "Sign In" button; inputs disabled during request.
- **Empty State:** N/A (Standard form).
- **Error State:** Banner alert indicating "Invalid email or password" or "Account is deactivated".
- **Mobile Considerations:** Centered single-column card with full-width touch-friendly inputs.

---

### Page 2: Administrator Dashboard (`/admin/dashboard`)
- **Purpose:** High-level executive overview of facility occupancy, visitor trends, and system status.
- **Main Content:**
  - Metric Cards: Total Visitors Today, Visitors Currently Inside, Total Active Employees, Scheduled Visitors, Pending Approvals.
  - Recent Visitor Activity widget (last 5 status changes).
  - Quick action buttons (Add Employee, Provision User, View Reports).
- **Main Actions:** View metrics, click to jump to detailed reports or employee management.
- **Navigation:** Admin Sidebar (Dashboard, Employees, Users, Reports, Audit Logs, Logout).
- **Required Data:** `GET /api/admin/dashboard-stats`.
- **Loading State:** Skeleton loader cards for metrics and tables.
- **Empty State:** Metric cards show `0`; widget shows "No visitor activity recorded today".
- **Error State:** "Failed to load dashboard metrics" with a "Retry" button.
- **Mobile Considerations:** Metric cards stack vertically (1 column on mobile, 2 on tablet, 4 on desktop).

---

### Page 3: Administrator Employee Management (`/admin/employees`)
- **Purpose:** Full CRUD operations for company employee directory.
- **Main Content:** Search bar, "Add Employee" modal trigger button, tabular list of employees (Employee Code, Name, Email, Department, Designation, Status, Actions).
- **Main Actions:** Add new employee, edit employee details, toggle status (Active/Inactive).
- **Navigation:** Accessible via Admin sidebar.
- **Required Data:** `GET /api/employees`.
- **Loading State:** Skeleton table rows with animated pulse effect.
- **Empty State:** "No employees found. Click 'Add Employee' to register your first staff member."
- **Error State:** Toast error on failed CRUD; table displays retry prompt.
- **Mobile Considerations:** Responsive table with horizontal scroll or responsive card layout for small screens.

---

### Page 4: Administrator User Accounts Management (`/admin/users`)
- **Purpose:** Manage system logins, assign roles, and map user accounts to employee profiles.
- **Main Content:** List of user accounts (Name, Email, Role badge, Linked Employee, Status, Created Date, Actions), "Create User" modal trigger.
- **Main Actions:** Create account, assign role (`ADMINISTRATOR`, `RECEPTIONIST`, `EMPLOYEE`), reset password, toggle active status.
- **Navigation:** Accessible via Admin sidebar.
- **Required Data:** `GET /api/users`, `GET /api/employees`.
- **Loading State:** Skeleton table rows.
- **Empty State:** "No user accounts found."
- **Error State:** Toast alert with error message.
- **Mobile Considerations:** Stacked user cards on mobile with clearly spaced action buttons.

---

### Page 5: Administrator Reports Screen (`/admin/reports`)
- **Purpose:** Filterable summary reports and aggregated visitor statistics.
- **Main Content:**
  - Date Filter Bar: "Today", "This Week", "Custom Date Range" (Start Date & End Date pickers).
  - Summary Statistic Cards: Total Visitors, Approved, Rejected, Completed (Checked Out), Active Inside.
  - Aggregated Breakdown Table: Date, Total Requests, Approved %, Avg Duration of Visit.
  - Status Distribution Bar / Progress indicators.
- **Main Actions:** Select filter preset, enter custom date range, trigger report refresh, print/export summary.
- **Navigation:** Accessible via Admin sidebar.
- **Required Data:** `GET /api/reports/summary?filter=today|this_week|custom&startDate=...&endDate=...`.
- **Loading State:** Animated loader / skeletons over statistics cards and table.
- **Empty State:** "No visitor records found for the selected date range."
- **Error State:** Error banner with retry option.
- **Mobile Considerations:** Filter pills wrap neatly; date pickers expand full-width on mobile.

---

### Page 6: Administrator Audit Logs Screen (`/admin/audit-logs`)
- **Purpose:** System-wide immutable activity history inspection.
- **Main Content:** Search input, Action filter dropdown (`CREATED`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`), tabular log (Timestamp, Pass ID, Visitor Name, Action Badge, Performed By User & Role, Remarks/Details).
- **Main Actions:** Filter by action type, search by visitor/actor, paginate through logs.
- **Navigation:** Accessible via Admin sidebar.
- **Required Data:** `GET /api/activities`.
- **Loading State:** Skeleton table with pulse animation.
- **Empty State:** "No activity logs found matching filter criteria."
- **Error State:** Inline error message with reload trigger.
- **Mobile Considerations:** Compact list layout with expandable detail drawer on mobile.

---

### Page 7: Receptionist Dashboard (`/receptionist/dashboard`)
- **Purpose:** Operational command center for front-desk lobby reception.
- **Main Content:**
  - KPI Cards: Today's Total Visitors, Visitors Currently Inside, Scheduled for Today, Pending Host Approvals.
  - Active Queue Table (Today's Visitors): Visitor Name, Contact, Host Employee, Arrival Time, Status Badge, Contextual Action Button (Check-In if Approved, Check-Out if Checked-In, Disabled if Pending/Rejected).
  - Quick link to "Register New Visitor".
- **Main Actions:** 1-click Check-In, 1-click Check-Out, Navigate to Registration.
- **Navigation:** Receptionist Sidebar (Dashboard, Register Visitor, Visitor History, Logout).
- **Required Data:** `GET /api/visitors/today-queue`, `GET /api/visitors/stats`.
- **Loading State:** Skeleton table and metric cards.
- **Empty State:** "No visitor activity registered for today. Click 'Register Visitor' to add a guest."
- **Error State:** Toast notifications on action failure; table error placeholder.
- **Mobile Considerations:** Action buttons remain prominent with large touch targets.

---

### Page 8: Visitor Registration Screen (`/receptionist/register`)
- **Purpose:** Capture visitor details, assign host employee, and schedule visit while enforcing Business Rules 1–5.
- **Main Content:**
  - Section 1: Visitor Information (Full Name, Phone Number, Email, Company/Organization).
  - Section 2: Host & Schedule (Host Employee select dropdown, Visit Date picker, Expected Arrival Time picker).
  - Section 3: Visit Purpose (Purpose text area / preset dropdown).
  - Real-time rule validation summary / helper hints.
  - Submit Button ("Create Visitor Pass").
- **Main Actions:** Fill form, select employee, submit registration, reset form.
- **Navigation:** Receptionist Sidebar.
- **Required Data:** `GET /api/employees/active` (for host dropdown).
- **Loading State:** Disabled submit button with spinner during POST request.
- **Empty State:** Fresh blank form with default date set to Today.
- **Error State:** Specific red validation alerts under offending input fields (e.g. "Host already has 3 pending requests").
- **Mobile Considerations:** Single column form layout with standard mobile date/time pickers.

---

### Page 9: Receptionist Visitor History & Search (`/receptionist/visitors`)
- **Purpose:** Searchable and filterable archive of all visitor passes.
- **Main Content:** Search bar (Name/Phone), Filter dropdowns (Status, Host Employee, Date), Data Table (Pass ID, Visitor Name, Host, Visit Date, In/Out Times, Status, Actions: View Details / Audit History / Cancel).
- **Main Actions:** Search, filter, view pass details modal, view audit timeline modal, cancel visit (if unadmitted).
- **Navigation:** Receptionist Sidebar.
- **Required Data:** `GET /api/visitors?search=...&status=...&date=...`.
- **Loading State:** Table loading skeleton.
- **Empty State:** "No visitor passes found matching your search criteria."
- **Error State:** Error banner with retry button.
- **Mobile Considerations:** Horizontal scrolling data table with sticky action column.

---

### Page 10: Employee Dashboard (`/employee/dashboard`)
- **Purpose:** Host employee command center to review incoming visitor requests and track today's visitors.
- **Main Content:**
  - Host KPI Cards: Pending Approvals (Badge shows `X / 3 Pending`), Today's Expected Visitors, Total Past Guests Hosted.
  - Pending Approvals Table: Visitor Name, Company, Scheduled Time, Purpose, "Approve" (Green) & "Reject" (Red) action buttons.
  - Today's Approved Visitors Table: Status indicator (Approved / Checked In / Checked Out).
- **Main Actions:** Click Approve $\to$ Remarks modal $\to$ Confirm; Click Reject $\to$ Remarks modal $\to$ Confirm.
- **Navigation:** Employee Sidebar (My Dashboard, Visit History, Logout).
- **Required Data:** `GET /api/employee/my-visitors`.
- **Loading State:** Skeleton cards and table rows.
- **Empty State (Pending):** "Great job! You have no pending visitor requests awaiting approval."
- **Error State:** Toast error if status update fails; automatic refresh on conflict.
- **Mobile Considerations:** Approval cards with large touch-friendly Approve/Reject buttons.

---

### Page 11: Employee History Screen (`/employee/history`)
- **Purpose:** Historical log of all visitors hosted by the logged-in employee.
- **Main Content:** Filterable table showing past visits, visitor names, dates, remarks, final status (`CHECKED_OUT`, `REJECTED`, `CANCELLED`), and audit history trigger.
- **Main Actions:** Filter by date or status, view audit history modal.
- **Navigation:** Employee Sidebar.
- **Required Data:** `GET /api/employee/my-history`.
- **Loading State:** Skeleton table.
- **Empty State:** "You have not hosted any visitors yet."
- **Error State:** Toast error notification.
- **Mobile Considerations:** Compact card list on mobile screens.
