# Functional Requirements & System Scope

## Project Overview
The Visitor Pass Management System (VPMS) is a role-based access management application designed to handle visitor registrations, host employee approvals, physical lobby check-ins/check-outs, and administrative reporting.

---

## 1. Authentication & Role-Based Access Control (RBAC)

The application supports three distinct user roles with protected routes and server-side middleware:

### Administrator
* Executive dashboard with workplace occupancy stats and active staff count.
* Staff Directory CRUD (create, view, edit employee records).
* User Accounts management (provision logins, assign roles, link to employee profiles).
* Analytical visitor reports with search and date filters.
* Security audit trail of all actions performed across the system.

### Receptionist (Front Desk)
* Lobby operations dashboard with live check-in queue and expected arrivals.
* Visitor registration form with real-time host availability validation.
* Check-in approved visitors with automated timestamping and printable visitor badge generation.
* Check-out active visitors upon departure.
* Search and filter full visitor logs.

### Employee (Host)
* Host action center displaying pending visitor approval requests.
* Approve or reject visitor requests with optional host remarks.
* Personal visit history log showing past and scheduled guests.

---

## 2. Primary Visitor Workflow

```text
1. Registration: Receptionist creates visitor pass request with host and arrival time.
   ↓
2. Approval: Host employee reviews pending request in their portal (Approve / Reject).
   ↓
3. Check-In: Receptionist checks in approved visitor upon physical arrival (Status: CHECKED_IN).
   ↓
4. Badge Generation: Receptionist prints or views visitor pass badge.
   ↓
5. Check-Out: Receptionist checks out visitor upon exit (Status: CHECKED_OUT).
   ↓
6. Audit Logging: Every state transition is recorded in immutable activity logs.
```

---

## 3. Search & Reporting

* **Search:** Multi-criteria search across visitor name, phone, host name, pass ID, and status.
* **Date Filters:** Today, this week, this month, and custom date ranges.
* **Metrics:** Total visits, active on premises, pending approvals, approval vs rejection rates.
