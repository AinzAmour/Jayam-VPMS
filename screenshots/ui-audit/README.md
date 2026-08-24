# Jayam VPMS — Frontend UI & Visual Audit

This document serves as the visual baseline index for the complete Jayam Visitor Pass Management System (VPMS) frontend application across desktop (1440×900) and mobile (390×844) viewports.

---

## Route & UI State Audit Index

| # | Route / UI State | Desktop | Mobile | Auth Required | Role / Context | Notes |
|---|---|:---:|:---:|:---:|---|---|
| 1 | `/login` | ✅ | ✅ | No | Public / Unauthenticated | Clean login screen with role credentials hint |
| 2 | `/login` (Error State) | ✅ | ✅ | No | Public / Unauthenticated | Invalid credential submission error toast & state |
| 3 | `/unauthorized` | ✅ | ✅ | No | Public / Error Boundary | 403 Forbidden access denial page |
| 4 | `/*` (404 Fallback) | ✅ | ✅ | No | Public / Catch-All | 404 Route Not Found page |
| 5 | `/admin/dashboard` | ✅ | ✅ | Yes | Administrator (`admin@jayam.com`) | Executive Workplace Overview, Metrics & Live Logs |
| 6 | `/admin/employees` | ✅ | ✅ | Yes | Administrator (`admin@jayam.com`) | Staff Directory roster table & search |
| 7 | `/admin/employees` (Add Modal) | ✅ | ✅ | Yes | Administrator (`admin@jayam.com`) | Add New Staff Member form dialog |
| 8 | `/admin/users` | ✅ | ✅ | Yes | Administrator (`admin@jayam.com`) | System User Accounts management table |
| 9 | `/admin/users` (Provision Modal) | ✅ | ✅ | Yes | Administrator (`admin@jayam.com`) | User Provisioning & profile linking dialog |
| 10 | `/admin/reports` | ✅ | ✅ | Yes | Administrator (`admin@jayam.com`) | Visitor analytics, KPIs, search & date filters |
| 11 | `/admin/audit-logs` | ✅ | ✅ | Yes | Administrator (`admin@jayam.com`) | Security audit trail & system event log |
| 12 | `/receptionist/dashboard` | ✅ | ✅ | Yes | Receptionist (`receptionist@jayam.com`) | Front Desk Lobby Operations & Live Queue |
| 13 | `/receptionist/register` | ✅ | ✅ | Yes | Receptionist (`receptionist@jayam.com`) | Visitor Pass Registration form |
| 14 | `/receptionist/visitors` | ✅ | ✅ | Yes | Receptionist (`receptionist@jayam.com`) | All Visitor Passes directory table |
| 15 | `/receptionist/visitors` (Badge Modal) | ✅ | ✅ | Yes | Receptionist (`receptionist@jayam.com`) | Visitor Pass printable badge & details modal |
| 16 | `/employee/dashboard` | ✅ | ✅ | Yes | Employee (`david.chen@jayam.com`) | Host Action Center (Pending visit approvals) |
| 17 | `/employee/history` | ✅ | ✅ | Yes | Employee (`david.chen@jayam.com`) | Host My Past Visitor History table |
| 18 | Mobile Navigation Drawer | N/A | ✅ | Yes | Mobile UI State | Slide-out navigation drawer on mobile viewports |

---

## Screenshot File Directory

### Desktop Viewports (`1440 × 900`)
* `desktop/01-login.png`
* `desktop/02-login-validation-error.png`
* `desktop/03-unauthorized.png`
* `desktop/04-not-found.png`
* `desktop/05-admin-dashboard.png`
* `desktop/06-admin-employees.png`
* `desktop/07-admin-employees-add-modal.png`
* `desktop/08-admin-users.png`
* `desktop/09-admin-users-add-modal.png`
* `desktop/10-admin-reports.png`
* `desktop/11-admin-audit-logs.png`
* `desktop/12-receptionist-dashboard.png`
* `desktop/13-receptionist-register.png`
* `desktop/14-receptionist-visitors.png`
* `desktop/15-receptionist-visitor-details-modal.png`
* `desktop/16-employee-dashboard.png`
* `desktop/17-employee-history.png`

### Mobile Viewports (`390 × 844`)
* `mobile/01-login.png`
* `mobile/02-login-validation-error.png`
* `mobile/03-unauthorized.png`
* `mobile/04-not-found.png`
* `mobile/05-admin-dashboard.png`
* `mobile/06-admin-employees.png`
* `mobile/07-admin-employees-add-modal.png`
* `mobile/08-admin-users.png`
* `mobile/09-admin-users-add-modal.png`
* `mobile/10-admin-reports.png`
* `mobile/11-admin-audit-logs.png`
* `mobile/12-receptionist-dashboard.png`
* `mobile/13-receptionist-register.png`
* `mobile/14-receptionist-visitors.png`
* `mobile/15-receptionist-visitor-details-modal.png`
* `mobile/16-employee-dashboard.png`
* `mobile/17-employee-history.png`
* `mobile/18-mobile-navigation-drawer.png`
