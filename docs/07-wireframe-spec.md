# 07. Wireframe & Screen Structural Specifications — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Global Shell & Navigation Architecture

### 1.1 Desktop Layout (>= 1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo] JAYAM VPMS        | Top Bar: [Role Badge] [User Name] [Logout Btn]   │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ SIDEBAR NAV      │ MAIN CONTENT AREA                                        │
│ • Dashboard      │ ┌──────────────────────────────────────────────────────┐ │
│ • [Role Links]   │ │ Page Title & Breadcrumbs      [Primary Page Action]  │ │
│ • History / Log  │ ├──────────────────────────────────────────────────────┤ │
│ • Settings       │ │ Metric KPI Cards (1 x 4 Grid)                        │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ Filter & Search Bar                                  │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ Primary Data Table / Form Layout                     │ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 1.2 Mobile Layout (< 768px)
- **Top Bar:** Hamburger Menu Toggle `[☰]`, Brand Name, User Avatar with Dropdown Logout.
- **Drawer Navigation:** Slides in from left when hamburger clicked.
- **Content Area:** Stacks all metric cards into single column cards; tables wrap horizontally or render as individual responsive cards.

---

## 2. Wireframe Specifications for Core Screens

---

### Screen 1: Login Interface (`/login`)
```
┌───────────────────────────────────────────────────────────────┐
│                        JAYAM VPMS                             │
│             Visitor Pass Management System                    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Sign in to Account                   │  │
│  │                                                         │  │
│  │  Email Address                                          │  │
│  │  [ admin@jayam.com                                    ] │  │
│  │                                                         │  │
│  │  Password                                               │  │
│  │  [ ••••••••••••••••                                   ] │  │
│  │                                                         │  │
│  │  [          Sign In to Dashboard (Primary)           ]  │  │
│  │                                                         │  │
│  │  ---------------- Quick Demo Accounts ----------------  │  │
│  │  [ Admin Demo ]   [ Receptionist Demo ]   [ Employee ]  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  © 2026 Jayam Solutions. Secure Facility Access.             │
└───────────────────────────────────────────────────────────────┘
```
- **Information Hierarchy:** Brand Title $\to$ Sign-In Form $\to$ Primary Action Button $\to$ Fast Demo Switchers.
- **Components:** Text inputs, password toggle icon, submit button with loading state, quick-fill pill buttons.
- **Loading State:** Disabled inputs, spinning loader inside "Sign In" button.
- **Error State:** Red callout alert above email input: "Invalid email or password".

---

### Screen 2: Receptionist Dashboard (`/receptionist/dashboard`)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Receptionist] Sarah Jenkins                   [+ Register New Visitor Btn] │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────────┐  │
│ │ TOTAL TODAY   │ │ INSIDE PREMISES│ │ SCHEDULED     │ │ PENDING APPROVAL │  │
│ │ 24 Visitors   │ │ 7 Inside      │ │ 12 Upcoming   │ │ 5 Pending        │  │
│ └───────────────┘ └───────────────┘ └───────────────┘ └──────────────────┘  │
│                                                                             │
│ TODAY'S VISITOR QUEUE & CHECK-IN DESK                                       │
│ [ Search by Visitor Name or Phone... ]   [ Filter Status: All Statuses ▾ ]  │
│ ┌────────────┬──────────────┬──────────────┬────────┬──────────┬──────────┐ │
│ │ Pass ID    │ Visitor Name │ Host Name    │ Time   │ Status   │ Action   │ │
│ ├────────────┼──────────────┼──────────────┼────────┼──────────┼──────────┤ │
│ │ #VP-1092   │ John Doe     │ David Chen   │ 10:30A │ APPROVED │[Check-In]│ │
│ │ #VP-1093   │ Jane Smith   │ Alex Wong    │ 11:00A │ PENDING  │[Disabled]│ │
│ │ #VP-1090   │ Mike Taylor  │ David Chen   │ 09:15A │ INSIDE   │[Check-Out│ │
│ │ #VP-1088   │ Sara Lee     │ Priya Patel  │ 09:00A │ REJECTED │[Disabled]│ │
│ └────────────┴──────────────┴──────────────┴────────┴──────────┴──────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Information Hierarchy:** Overview Metric Cards $\to$ Search/Filter Controls $\to$ Queue Action Table.
- **Components:** Metric cards with icons, live search input, status badge component (`APPROVED` green, `PENDING` yellow, `INSIDE` blue, `REJECTED` red), contextual Action Button.
- **Action Behavior:**
  - `APPROVED` $\to$ Enabled green button **[Check In]**
  - `CHECKED_IN` $\to$ Enabled purple button **[Check Out]**
  - `PENDING_APPROVAL` $\to$ Grayed out button **[Awaiting Host]**
  - `REJECTED` $\to$ Grayed out button **[Rejected]**

---

### Screen 3: Visitor Registration Form (`/receptionist/register`)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Register New Visitor Pass                                                  │
│  Create visitor pass request and dispatch to host for approval              │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. VISITOR INFORMATION                                                  │ │
│ │ Full Name *                         Phone Number *                      │ │
│ │ [ Jane Doe                        ] [ +1 555 019 2834                 ] │ │
│ │                                                                         │ │
│ │ Email Address                       Company / Organization *            │ │
│ │ [ jane.doe@acme.corp              ] [ Acme Corporation                ] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 2. HOST EMPLOYEE & SCHEDULE                                             │ │
│ │ Host Employee *                     Visit Date *                        │ │
│ │ [ David Chen (Engineering)      ▾ ] [ 2026-08-25                      ] │ │
│ │                                                                         │ │
│ │ Expected Arrival Time *                                                 │ │
│ │ [ 10:30 AM                        ]                                     │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 3. PURPOSE OF VISIT                                                     │ │
│ │ Purpose Description *                                                   │ │
│ │ [ Q3 Vendor Architecture Review & Technical Deep Dive                 ] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [ Cancel / Reset Form ]                         [ Create Visitor Pass (P) ] │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Information Hierarchy:** Form Sections (Visitor Info $\to$ Host & Schedule $\to$ Purpose) $\to$ Actions.
- **Validation Rules Displayed:**
  - If selected date < Today: Red helper text "Visit date cannot be in the past (Rule 3)".
  - If date = Today & time < Current time: Red helper text "Expected arrival cannot be earlier than current time (Rule 4)".
  - If host has $\ge 3$ pending: Red helper text "Selected host has reached the limit of 3 pending requests (Rule 5)".

---

### Screen 4: Employee Portal / Approvals (`/employee/dashboard`)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Employee] David Chen (Engineering)                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────┐ ┌──────────────────────────────────────────┐  │
│ │ PENDING APPROVALS         │ │ TODAY'S CONFIRMED GUESTS                 │  │
│ │ 2 / 3 Limit               │ │ 3 Visitors Expected / Inside             │  │
│ └───────────────────────────┘ └──────────────────────────────────────────┘  │
│                                                                             │
│ PENDING VISITOR REQUESTS AWAITING YOUR DECISION                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Pass #VP-1094 | Jane Doe (Acme Corp)                                    │ │
│ │ Scheduled: Tomorrow, 10:30 AM | Phone: +1 555 019 2834                  │ │
│ │ Purpose: "Q3 Vendor Architecture Review & Technical Deep Dive"          │ │
│ │ Actions:  [ ✓ Approve Request (Green) ]   [ ✕ Reject Request (Red) ]    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ TODAY'S SCHEDULED & VISITING GUESTS                                         │
│ ┌────────────┬──────────────┬──────────────┬──────────┬───────────────────┐ │
│ │ Pass ID    │ Visitor Name │ Arrive Time  │ Status   │ Host Remarks      │ │
│ ├────────────┼──────────────┼──────────────┼──────────┼───────────────────┤ │
│ │ #VP-1090   │ Mike Taylor  │ 09:15 AM     │ INSIDE   │ "Escort to Rm 302"│ │
│ └────────────┴──────────────┴──────────────┴──────────┴───────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Modal Component on Approve/Reject:**
```
┌──────────────────────────────────────────────────────────┐
│  Confirm Approval: Jane Doe (#VP-1094)                   │
├──────────────────────────────────────────────────────────┤
│  Optional Remarks / Instructions:                        │
│  [ Please ask guest to wait in Lobby B until 10:35 AM  ] │
│                                                          │
│  [ Cancel ]                        [ Confirm Approval ]  │
└──────────────────────────────────────────────────────────┘
```

---

### Screen 5: Administrator Reports & Summary Analytics (`/admin/reports`)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Reports & Visitor Analytics                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Filter Range:  [ Today ]  [ (Active) This Week ]  [ Custom Date Range ]     │
│ Custom Inputs: [ Start Date: 2026-08-18 ] to [ End Date: 2026-08-24 ]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ TOTAL PASSES │ │ APPROVED     │ │ REJECTED     │ │ COMPLETED (CHECKED)  │ │
│ │ 142 Visits   │ │ 128 (90.1%)  │ │ 14 (9.9%)    │ │ 121 Passes           │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                                             │
│ SUMMARY BREAKDOWN TABLE                                    [ Export CSV ]   │
│ ┌────────────┬──────────────┬────────────┬──────────┬──────────┬──────────┐ │
│ │ Date       │ Total Passes │ Approved   │ Rejected │ CheckedIn│ Avg Time │ │
│ ├────────────┼──────────────┼────────────┼──────────┼──────────┼──────────┤ │
│ │ 2026-08-24 │ 24           │ 22         │ 2        │ 19       │ 1h 45m   │ │
│ │ 2026-08-23 │ 31           │ 29         │ 2        │ 28       │ 2h 10m   │ │
│ └────────────┴──────────────┴────────────┴──────────┴──────────┴──────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 6: System Audit Trail & Activity History Modal / Page (`/admin/audit-logs`)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ System Activity History & Compliance Audit Trail                            │
│ [ Search Pass ID, Visitor, or Actor... ]     [ Filter Action: All Actions ▾]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────┬──────────┬──────────────┬────────────┬──────────────┐ │
│ │ Timestamp (UTC)   │ Action   │ Target Pass  │ User Actor │ Role / Notes │ │
│ ├───────────────────┼──────────┼──────────────┼────────────┼──────────────┤ │
│ │ 2026-08-24 10:31A │ CHECK_IN │ #VP-1092     │ S. Jenkins │ RECEPTIONIST │ │
│ │ 2026-08-24 10:15A │ APPROVED │ #VP-1092     │ David Chen │ EMPLOYEE     │ │
│ │ 2026-08-24 09:40A │ CREATED  │ #VP-1092     │ S. Jenkins │ RECEPTIONIST │ │
│ └───────────────────┴──────────┴──────────────┴────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```
