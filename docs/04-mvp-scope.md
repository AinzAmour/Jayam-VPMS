# 04. MVP Scope & Feature Prioritization — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Executive Summary of MVP
The Minimum Viable Product (MVP) for the **Visitor Pass Management System (VPMS)** is designed to satisfy 100% of the mandatory functional and business rules specified in the 2-day technical assessment while keeping the scope tightly controlled to ensure zero bugs, exceptional UI polish, and strict code quality.

---

## 2. MoSCoW Feature Categorization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MVP SCOPE BOUNDARY                             │
│                                                                         │
│  MUST HAVE (P0)                SHOULD HAVE (P1)                         │
│  ├── JWT Auth & RBAC (3 Roles) ├── Visit Cancellation Reason Modal      │
│  ├── 3 Role Dashboards         ├── CSV/Print Export for Reports         │
│  ├── Visitor Registration Form └── Pass Slip Printable View             │
│  ├── 10 Business Rules         ──────────────────────────────────────── │
│  ├── Employee Approval/Reject  COULD HAVE (P2)                          │
│  ├── Check-In / Check-Out      ├── Dark/Light Theme Switcher            │
│  ├── Multi-Criteria Search     └── Visitor Photo Upload                 │
│  ├── Date Filtered Reports     ──────────────────────────────────────── │
│  ├── Activity Audit History    NOT MVP (Out of Scope)                   │
│  └── Admin Employee & User     ├── SMS/WhatsApp API Alerts              │
│      Management                ├── Facial Recognition / Kiosk Hardware  │
│                                └── SAML SSO / Active Directory Sync     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. MUST HAVE (P0) — MVP Core Deliverables

### 3.1 Feature: Role-Based Authentication & Navigation
- **Why Required:** Fundamental security barrier preventing unauthorized access to corporate visitor records and administration.
- **Target User:** All Users (`ADMINISTRATOR`, `RECEPTIONIST`, `EMPLOYEE`).
- **Problem Solved:** Prevents unauthenticated users from seeing internal data or performing privileged operations.
- **Dependencies:** User database model, JWT signing & verification middleware.
- **Acceptance Criteria:**
  - Login form validates credentials against bcrypt-hashed passwords.
  - JWT issued with 8h expiration; client stores token securely.
  - Client navigation dynamically shows only permissible links.
  - Direct URL access to unauthorized pages renders 403 or redirects.

### 3.2 Feature: Role-Specific Dashboards
- **Why Required:** Provides each role with their essential operational overview without information overload.
- **Target User:** All Users.
- **Problem Solved:** Receptionists need immediate lobby queues; Employees need pending approvals; Admins need premises occupancy.
- **Dependencies:** Aggregation API endpoints for dashboard statistics.
- **Acceptance Criteria:**
  - Receptionist sees: Today's Visitors, Visitors Inside, Scheduled Visitors, Quick Check-In/Out list.
  - Employee sees: Pending Requests (highlighting count $\le 3$), Today's Approved Visits.
  - Admin sees: Overall occupancy, total employees, scheduled visitors, pending counts.

### 3.3 Feature: Visitor Registration with Business Rules (Rules 1, 2, 3, 4, 5)
- **Why Required:** Core mechanism to create a visit pass and dispatch it to an employee.
- **Target User:** Receptionist.
- **Problem Solved:** Eliminates paper logbooks and prevents invalid or conflicting visitor schedules.
- **Dependencies:** Active Employee directory, Visitor database model, pre-validation checks.
- **Acceptance Criteria:**
  - Rejects duplicate registration for same visitor on same date (**Rule 2**).
  - Rejects if visitor already has an active visit (**Rule 1**).
  - Rejects if visit date is earlier than today (**Rule 3**).
  - Rejects if expected arrival time for today is earlier than current time (**Rule 4**).
  - Rejects if target employee already has $\ge 3$ pending requests (**Rule 5**).

### 3.4 Feature: Employee Approval & Rejection Workflow (with Remarks)
- **Why Required:** Enforces strict host accountability before any guest is admitted.
- **Target User:** Employee.
- **Problem Solved:** Unannounced visitors or unverified guests entering company premises.
- **Dependencies:** Visitor Registration (Feature 3.3), Activity History logging.
- **Acceptance Criteria:**
  - Employee views only visits assigned to them.
  - Employee can Approve (optional remarks) or Reject (with remarks).
  - State changes to `APPROVED` or `REJECTED`.
  - Immutable activity history records the decision timestamp and actor.

### 3.5 Feature: Check-In & Check-Out Desk (Rules 6, 7, 8, 9)
- **Why Required:** Front-desk physical admission and exit tracking.
- **Target User:** Receptionist.
- **Problem Solved:** Real-time occupancy tracking and preventing unauthorized check-ins.
- **Dependencies:** Approved Visit records.
- **Acceptance Criteria:**
  - Check-in is blocked unless status is strictly `APPROVED` (**Rule 6**, **Rule 9**).
  - Cannot check in a visitor who is already checked in (**Rule 7**).
  - Check-out records timestamp and verifies `checkOutTime > checkInTime` (**Rule 8**).
  - Updates status to `CHECKED_IN` and `CHECKED_OUT` respectively.

### 3.6 Feature: Multi-Criteria Search & Filtering
- **Why Required:** Rapid retrieval of visitor records in busy reception environments.
- **Target User:** Administrator, Receptionist, Employee.
- **Problem Solved:** Eliminates manual scanning through lists to find a specific visitor or pass.
- **Dependencies:** Indexed MongoDB fields on Visitor entity.
- **Acceptance Criteria:**
  - Search by visitor name, host employee name, visit date, and status.
  - Fast response ($< 100\text{ ms}$) with clean pagination.

### 3.7 Feature: Summary Reports (Today, This Week, Custom Date Range)
- **Why Required:** Management visibility into visitor volume and status distributions.
- **Target User:** Administrator.
- **Problem Solved:** Eliminates manual tallying of visitor slips.
- **Dependencies:** Visitor records across historical dates.
- **Acceptance Criteria:**
  - Filter by predefined buttons (Today, This Week) or Custom Date Range picker.
  - Displays total visits, approved, rejected, completed, and inside counts.

### 3.8 Feature: Immutable Activity History / Audit Trail
- **Why Required:** Security and compliance auditing.
- **Target User:** Administrator (all logs), Receptionist & Employee (per-pass history).
- **Problem Solved:** Inability to audit who created, approved, rejected, or checked in a guest.
- **Dependencies:** ActivityHistory database model.
- **Acceptance Criteria:**
  - Automatically captures `CREATED`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`.
  - Records action, UTC timestamp, actor user ID/name/role, and remarks.

### 3.9 Feature: Employee & User Account Management (CRUD)
- **Why Required:** Administrator needs to maintain staff rosters and grant system access.
- **Target User:** Administrator.
- **Problem Solved:** Inability to provision credentials or update employee departments/designations.
- **Dependencies:** User and Employee database models.
- **Acceptance Criteria:**
  - Admin can create, view, edit, and deactivate employees and user accounts.
  - Passwords securely hashed upon creation/update.

---

## 4. SHOULD HAVE (P1) — High Value Polish (Targeted for MVP if Time Permits)
1. **Visit Cancellation (Rule 10):** Ability for receptionist/employee to cancel a visit before check-in, archiving it from active lists.
2. **Pass Slip View / Print Modal:** Formatted printable visitor pass card showing visitor details, host name, pass ID, and visit date.
3. **Database Seeding Script (`npm run seed`):** Automated seed script pre-populating admin, receptionist, sample employees, and mock visitor passes for demo readiness.

---

## 5. COULD HAVE (P2) — Post-MVP Enhancements
1. **Visitor Photo Upload:** Optional image attachment during registration.
2. **Dark / Light Mode Toggle:** Aesthetic theme switcher.
3. **CSV Export for Reports:** Client-side button to export filtered report rows into CSV.

---

## 6. NOT MVP (Explicitly Excluded)
1. ❌ Hardware Kiosk Self-Registration
2. ❌ External SMS / WhatsApp Notifications
3. ❌ Facial Recognition & Biometric Scanners
4. ❌ Multi-Tenant Organization Partitioning
5. ❌ SAML SSO / LDAP Active Directory Sync
