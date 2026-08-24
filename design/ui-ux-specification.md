# Jayam VPMS — Complete UI / UX Master Specification

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved UI/UX Master Specification
- **Design System:** Aegis UI
- **Source Specification:** `06-page-map.md`, `08-ui-ux-requirements.md`

---

## 1. Global Shell & Navigation UI/UX

### 1.1 Architecture & Layout Structure
- **Persistent Header:** Top application bar spanning full viewport width (`h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30`).
- **Sidebar Shell:** Left-hand navigation column (`w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between hidden lg:flex min-h-screen sticky top-0`).
- **Mobile Drawer Shell:** Off-canvas sliding drawer (`fixed inset-y-0 left-0 w-72 bg-slate-900 z-50 p-6 flex flex-col justify-between transform transition-transform duration-300`).
- **Main Content Canvas:** Dynamic workspace area (`flex-1 bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full`).

---

## 2. Detailed Page-by-Page UI/UX Specifications

---

### Page 1: Authentication & Demo Portal (`/login`)
- **Purpose:** Securely authenticate users and provision 1-click test credentials for evaluators.
- **Target User:** All Users (Admin, Receptionist, Employee).
- **Entry Point:** Application root `/` or direct `/login`.
- **User Goal:** Gain authenticated access to role-authorized tools.
- **Layout:** Centered card over dark gradient canvas (`bg-slate-900`).
- **Key Components:** Brand shield logo, Email input, Password input with eye toggle, Primary submit button, 3 Demo Fast-Fill pill buttons.
- **Primary Action:** `[Sign In to Account →]`.
- **Secondary Actions:** `[Demo Admin]`, `[Demo Receptionist]`, `[Demo Employee]`.
- **Data Displayed:** None (Input form).
- **Loading State:** Spinning loader inside submit button, inputs disabled.
- **Empty State:** N/A.
- **Error State:** Red alert banner above inputs: `"Invalid email or password"`.
- **Success State:** Redirect to respective dashboard with stored JWT.
- **Validation:** Email format validation, password min 6 chars.
- **Mobile Behavior:** Full-width form card, large $44\text{px}$ touch targets.
- **Accessibility:** Explicit ARIA labels on password toggle and inputs.

---

### Page 2: Receptionist Lobby Desk & Queue (`/receptionist/dashboard`)
- **Purpose:** Front-desk lobby command center to register, check in, and check out visitors.
- **Target User:** `RECEPTIONIST`.
- **Entry Point:** Post-login redirect or sidebar "Lobby Operations".
- **User Goal:** Process arriving/departing visitors and monitor lobby flow.
- **Layout:** Top 3-card KPI summary grid + Filterable Active Visitor Queue data table.
- **Key Components:**
  - KPI Cards: Today's Total Passes, Visitors Inside Premises, Pending Host Approvals.
  - Active Queue Table: Pass ID, Visitor Name, Host Employee, Scheduled Time, Status Badge, Contextual Action Trigger (`Check In`, `Check Out`, `Disabled/Awaiting`).
- **Primary Action:** `[+ Register New Visitor]` (Emerald button in top header).
- **Secondary Actions:** `[✓ Check In]` (for Approved passes), `[⎋ Check Out]` (for Inside passes).
- **Data Displayed:** Real-time visitor counts, today's queue records.
- **Loading State:** 3 skeleton KPI cards and 5 skeleton table rows.
- **Empty State:** Graphical placeholder: *"No visitors scheduled for today. Click 'Register Visitor' to add a guest."*
- **Error State:** Red toast notification on action failure with retry option.
- **Success State:** Green toast notification: `"Visitor Jane Doe checked in successfully"`.
- **Validation:** Enforces Rules 6, 7, 8, 9 (blocks unapproved check-in and invalid timestamps).
- **Mobile Behavior:** Table converts into responsive Data Cards with full-width action buttons.
- **Accessibility:** `aria-live="polite"` on occupancy counter; color-blind friendly badges with indicator dots.

---

### Page 3: Visitor Pass Registration (`/receptionist/register`)
- **Purpose:** Register new visitor pass with schedule and purpose while enforcing Rules 1–5.
- **Target User:** `RECEPTIONIST`.
- **Entry Point:** Header button or sidebar "Register Pass".
- **User Goal:** Successfully schedule a visitor without violating business rules.
- **Layout:** 3-section structured card form (Visitor Info $\to$ Host & Schedule $\to$ Purpose).
- **Key Components:** Name, Phone, Email, Company inputs, Host select dropdown (with capacity hints), Date picker (`min=today`), Time picker, Purpose textarea, Submit button.
- **Primary Action:** `[✓ Create Visitor Pass]`.
- **Secondary Actions:** `[Reset Form]`, `[Cancel & Return]`.
- **Data Displayed:** Active employee directory dropdown with pending load indicators.
- **Loading State:** Submit button spinner with text `"Validating Business Rules..."`.
- **Empty State:** Blank form with default date set to Today.
- **Error State:** Inline red validation messages under violating fields (e.g. *"Host has 3 pending requests"*).
- **Success State:** Green toast notification and redirect to `/receptionist/dashboard`.
- **Validation:** Enforces **Rule 1** (active visits), **Rule 2** (same-day duplicate), **Rule 3** (past date), **Rule 4** (past time today), **Rule 5** (host capacity $\le 3$).
- **Mobile Behavior:** Single-column layout with standard mobile native date/time wheels.
- **Accessibility:** Focus moves to first invalid field on failed submission.

---

### Page 4: Receptionist Visitor Records (`/receptionist/visitors`)
- **Purpose:** Complete archive and search portal for all visitor passes.
- **Target User:** `RECEPTIONIST`, `ADMINISTRATOR`.
- **Entry Point:** Sidebar "Visitor History".
- **User Goal:** Query historical passes and inspect audit timelines or cancel passes.
- **Layout:** Multi-criteria filter bar + Paginated visitor data table.
- **Key Components:** Search input, Host filter, Status filter, Date filter, Data table, Pagination controls (`Prev`, `Next`, page pills).
- **Primary Action:** Search / Filter.
- **Secondary Actions:** `[📜 View History]`, `[✕ Cancel Pass]`.
- **Data Displayed:** Paginated visitor passes with full metadata.
- **Loading State:** Skeleton table rows.
- **Empty State:** *"No visitor records match your search criteria."* + `[Reset Filters]` button.
- **Error State:** Error banner with retry trigger.
- **Mobile Behavior:** Filter controls collapse into an expandable accordion drawer.
- **Accessibility:** Search debounced to reduce rapid screen reader updates.

---

### Page 5: Employee Host Portal & Approvals (`/employee/dashboard`)
- **Purpose:** Host workspace to review incoming visitor requests and manage daily guests.
- **Target User:** `EMPLOYEE`.
- **Entry Point:** Post-login redirect or sidebar "My Approvals".
- **User Goal:** Approve or reject visitor requests with remarks.
- **Layout:** 2-card KPI summary (Pending Queue Capacity bar $\le 3$, Today's Confirmed) + Actionable Request Cards + Confirmed Guests table.
- **Key Components:** Capacity progress bar, Request card with Approve (Green) & Reject (Red) triggers, Remarks modal.
- **Primary Action:** `[✓ Approve Request]`.
- **Secondary Action:** `[✕ Reject Request]`.
- **Data Displayed:** Visitor name, organization, scheduled time, stated purpose.
- **Loading State:** Skeleton request cards.
- **Empty State:** Graphic with copy: *"All caught up! You have 0 pending requests awaiting approval."*
- **Success State:** Green toast `"Visit Approved"` or Yellow toast `"Visit Rejected"`.
- **Validation:** Mandatory remarks on rejection (min 5 chars); optional remarks on approval.
- **Mobile Behavior:** Approval/Rejection buttons span full width with large tap zones.
- **Accessibility:** Modal traps keyboard focus; `Escape` key closes dialog.

---

### Page 6: Employee Hosting History (`/employee/history`)
- **Purpose:** Personal archive of visitors hosted by the logged-in employee.
- **Target User:** `EMPLOYEE`.
- **Entry Point:** Sidebar "Visit History".
- **User Goal:** Review past hosted guests and review remarks.
- **Layout:** Filterable table of past hosted visits.
- **Key Components:** Search bar, Status filter, Table, Lifecycle Timeline trigger.
- **Primary Action:** View History.
- **Data Displayed:** Visitor names, dates, actual durations, host remarks, final status.
- **Loading State:** Skeleton table.
- **Empty State:** *"You have not hosted any visitors yet."*
- **Mobile Behavior:** Responsive data cards with duration badges.

---

### Page 7: Administrator Overview Dashboard (`/admin/dashboard`)
- **Purpose:** Executive overview of workplace occupancy and facility security.
- **Target User:** `ADMINISTRATOR`.
- **Entry Point:** Post-login redirect.
- **User Goal:** Monitor facility safety and access management tools.
- **Layout:** 4-card KPI grid + Quick Action shortcuts + Live Activity Feed table.
- **Key Components:** Live Inside Occupancy card, Total Passes Today, Active Staff count, Quick Action buttons, Recent Activity Feed.
- **Primary Action:** Quick management shortcuts.
- **Data Displayed:** System-wide aggregates and last 5 activity events.
- **Loading State:** Skeleton metric cards and activity list.
- **Empty State:** *"No activity recorded today."*
- **Mobile Behavior:** 1-column stacked KPI cards.

---

### Page 8: Administrator Employee Management (`/admin/employees`)
- **Purpose:** Maintain the corporate staff directory.
- **Target User:** `ADMINISTRATOR`.
- **Entry Point:** Sidebar "Manage Employees".
- **User Goal:** Create, update, and toggle active status for staff.
- **Layout:** Search bar + Staff directory table + Add/Edit Employee modal.
- **Key Components:** Code, Name, Email, Department, Designation, Status badge, Action triggers (`Edit`, `Deactivate`).
- **Primary Action:** `[+ Add Employee]`.
- **Secondary Action:** `[Edit Details]`, `[Toggle Active]`.
- **Data Displayed:** Employee roster.
- **Validation:** Unique employee code and email address.
- **Mobile Behavior:** Searchable staff card list.

---

### Page 9: Administrator User Management & RBAC (`/admin/users`)
- **Purpose:** Provision logins and assign system roles (`ADMINISTRATOR`, `RECEPTIONIST`, `EMPLOYEE`).
- **Target User:** `ADMINISTRATOR`.
- **Entry Point:** Sidebar "User Management".
- **User Goal:** Grant or revoke system credentials and role clearances.
- **Layout:** User accounts table + Provision User modal.
- **Key Components:** Name, Email, Role pill badge, Linked Staff profile, Reset Password modal.
- **Primary Action:** `[+ Provision User]`.
- **Secondary Action:** `[Reset Password]`, `[Toggle Status]`.
- **Validation:** Password complexity, employee linkage validation for Employee role.
- **Mobile Behavior:** User cards with role badges.

---

### Page 10: Administrator Reports & Analytics (`/admin/reports`)
- **Purpose:** Filterable summary reports and visitor volume statistics.
- **Target User:** `ADMINISTRATOR`.
- **Entry Point:** Sidebar "Visitor Reports".
- **User Goal:** Analyze visitor trends over custom date ranges and export CSV.
- **Layout:** Date filter bar (Today, This Week, Custom Date Range) + Summary KPI cards + Daily breakdown table.
- **Key Components:** Date filter pills, Custom date pickers, Summary metrics (Total, Approved %, Rejected %, Avg Duration), Export CSV button.
- **Primary Action:** `[Apply Filter]`, `[📥 Export CSV]`.
- **Data Displayed:** Aggregated counts and daily averages.
- **Loading State:** Skeleton summary cards and table.
- **Empty State:** *"No visitor records found in selected date range."*
- **Mobile Behavior:** Filter pills wrap cleanly; summary cards stack vertically.

---

### Page 11: Administrator System Audit Trail (`/admin/audit-logs`)
- **Purpose:** Immutable compliance audit log of all system actions.
- **Target User:** `ADMINISTRATOR`.
- **Entry Point:** Sidebar "Activity History".
- **User Goal:** Inspect forensic timeline of actions, timestamps, and user attributions.
- **Layout:** Search and Action filter bar + Paginated audit log table.
- **Key Components:** Action filter (`CREATED`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`), Audit table with exact UTC timestamps and user attribution.
- **Primary Action:** Filter / Search logs.
- **Data Displayed:** Immutable activity entries.
- **Loading State:** Skeleton table rows.
- **Mobile Behavior:** Audit log list with expandable note drawer.
