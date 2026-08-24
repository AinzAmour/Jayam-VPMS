# 19. End-to-End Requirement Traceability Matrix — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Traceability Architecture

```
Problem Statement
       ↓
   User Need
       ↓
Functional Requirement
       ↓
   MVP Feature
       ↓
   User Flow
       ↓
   Page / UI
       ↓
  REST API Endpoint
       ↓
Database Model / Index
       ↓
Acceptance Criteria
       ↓
   Test Scenario
```

---

## 2. Master Traceability Matrix

| Req ID | Business Problem & User Need | Functional Requirement | MVP Feature | User Flow | UI Screen | REST API Endpoint | Database Collection | Acceptance Scenario | Test Case ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`TR-01`** | Unauthenticated lobby access & data exposure | `FR-AUTH-01`, `FR-AUTH-02`, `FR-AUTH-03` | Role-Based JWT Auth & Navigation | Flow 1 (Auth) | `/login`, Role Shells | `POST /api/auth/login`, `GET /api/auth/me` | `users` (indexed on `email`) | Scenario 1.1, 1.2 | `TC-RBAC-01` to `TC-RBAC-05` |
| **`TR-02`** | Paper registers allow untracked, conflicting visits | `FR-VIS-01`, `FR-VIS-05` | Visitor Registration Form | Flow 2 (Register) | `/receptionist/register` | `POST /api/visitors` | `visit_passes` | Scenario 2.1 | `TC-BR-01` to `TC-BR-05` |
| **`TR-03`** | Visitor having multiple simultaneous active visits | Business **Rule 1** | Active Visit Guard | Flow 2 (Register) | `/receptionist/register` | `POST /api/visitors` | `visit_passes` (`visitorPhone, status`) | Scenario 2.3 | `TC-BR-01` |
| **`TR-04`** | Duplicate bookings for same guest on same day | Business **Rule 2** | Same-Day Duplicate Guard | Flow 2 (Register) | `/receptionist/register` | `POST /api/visitors` | `visit_passes` (`visitorPhone, visitDate`) | Scenario 2.2 | `TC-BR-02` |
| **`TR-05`** | Backdated registrations entered into system | Business **Rule 3** | Past Date Validator | Flow 2 (Register) | `/receptionist/register` | `POST /api/visitors` | `visit_passes` (`visitDate`) | Scenario 2.4 | `TC-BR-03` |
| **`TR-06`** | Past arrival times registered for today's visits | Business **Rule 4** | Arrival Time Validator | Flow 2 (Register) | `/receptionist/register` | `POST /api/visitors` | `visit_passes` (`expectedArrivalTime`) | Scenario 2.5 | `TC-BR-04` |
| **`TR-07`** | Hosts overwhelmed by unmanaged backlog of requests | Business **Rule 5** | Max 3 Pending Queue Limit | Flow 2 & Flow 3 | `/receptionist/register`, `/employee/dashboard` | `POST /api/visitors`, `GET /api/employee/my-visitors` | `visit_passes` (`hostEmployeeId, status`) | Scenario 2.6 | `TC-BR-05` |
| **`TR-08`** | Unverified guests admitted without host knowledge | `FR-VIS-02`, Business **Rule 6, 9** | Employee Review & Remarks Modal | Flow 3 (Review) | `/employee/dashboard` | `PUT /api/visitors/:id/status` | `visit_passes` (`status, hostRemarks`) | Scenario 3.1, 3.2 | `TC-BR-06`, `TC-BR-09` |
| **`TR-09`** | Lack of physical arrival confirmation & timestamp | `FR-VIS-03`, Business **Rule 6, 7** | Front-Desk Check-In Action | Flow 4 (Check-In) | `/receptionist/dashboard` | `PUT /api/visitors/:id/checkin` | `visit_passes` (`status, checkInTime`) | Scenario 4.1, 4.2, 4.3 | `TC-BR-06`, `TC-BR-07` |
| **`TR-10`** | Inability to track departure & faulty duration stats | `FR-VIS-04`, Business **Rule 8** | Front-Desk Check-Out Action | Flow 4 (Check-Out)| `/receptionist/dashboard` | `PUT /api/visitors/:id/checkout` | `visit_passes` (`status, checkOutTime`) | Scenario 4.4 | `TC-BR-08` |
| **`TR-11`** | Cancelled visits cluttering active lobby queue | `FR-VIS-05`, Business **Rule 10** | Visit Cancellation Flow | Flow 4 (Cancel) | `/receptionist/visitors` | `PUT /api/visitors/:id/cancel` | `visit_passes` (`status, cancellationReason`) | Scenario 5.1 | `TC-BR-10` |
| **`TR-12`** | Difficult to locate past visitors or specific pass | `FR-REP-01` | Multi-Criteria Search & Filter | Flow 5 (Search) | `/receptionist/visitors`, `/employee/history` | `GET /api/visitors` | `visit_passes` (text indexed) | Scenario 6.1 | Test Search Matrix |
| **`TR-13`** | Management lacks visibility into visitor trends | `FR-REP-02` | Summary Reports & Date Pickers | Flow 5 (Reports) | `/admin/reports` | `GET /api/reports/summary` | `visit_passes` (aggregated) | Scenario 6.2 | Test Reports Matrix |
| **`TR-14`** | Lack of forensic accountability during security audits | `FR-AUD-01` | System & Pass Activity History | Flow 5 (Audit) | `/admin/audit-logs`, Pass Modal | `GET /api/activities`, `GET /api/visitors/:id/activities` | `activity_logs` (indexed on `visitPassId, timestamp`) | Scenario 6.3 | Test Audit Matrix |
| **`TR-15`** | Administrators cannot maintain staff roster or logins | `FR-ADM-01`, `FR-ADM-02` | Employee & User Management | Admin Flows | `/admin/employees`, `/admin/users` | `GET/POST/PUT /api/employees`, `GET/POST/PUT /api/users` | `employees`, `users` | Admin CRUD Scenarios | Test CRUD Matrix |
