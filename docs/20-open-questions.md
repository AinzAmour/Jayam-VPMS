# 20. Open Questions & Architectural Assumptions Log — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Categorized Open Questions & Current Assumptions

### 1.1 Product & Business Domain Questions

#### `OQ-BIZ-01`: Visitor Uniqueness Identifier
- **Question:** How is a unique "visitor" identified when enforcing Rule 1 (no multiple active visits) and Rule 2 (no duplicate registrations on the same date)?
- **Why it matters:** In a web application without national ID or passport scanning, two visitors may share a common name (e.g. "John Smith").
- **Decision Affected:** Database indexing, query conditions, and registration validation logic.
- **Current Assumption:** Visitor **Phone Number** is treated as the primary unique key for visitor identity. `(visitorPhone + visitDate)` enforces Rule 2; `(visitorPhone + activeStatus)` enforces Rule 1.
- **Status:** `Assumption`

#### `OQ-BIZ-02`: Cancellation Permissions & Lifecycle Window
- **Question:** Who is permitted to cancel a visit, and up until which lifecycle state can a visit be cancelled?
- **Why it matters:** The prompt specifies Rule 10 ("Cancelled visits should not appear in active visitor lists") and Activity History ("Cancelled"), but does not specify who triggers cancellation.
- **Decision Affected:** API authorization logic and UI button placement.
- **Current Assumption:** Both the **Receptionist** and the assigned **Host Employee** (and Administrator) can cancel a visit as long as its status is `PENDING_APPROVAL` or `APPROVED` (i.e. before physical check-in has occurred). Once checked in, departure is handled via Check-Out.
- **Status:** `Assumption`

#### `OQ-BIZ-03`: Handling of Expired / Unattended Passes
- **Question:** If a visitor pass was approved for today at 10:00 AM but the visitor never showed up, does the system automatically expire the pass at midnight, or does it remain in `APPROVED` status indefinitely?
- **Why it matters:** Lingering `APPROVED` passes might distort future check-ins or occupy host capacity if not scoped by date.
- **Decision Affected:** Daily cleanup jobs or check-in date validation.
- **Current Assumption:** The receptionist check-in desk only displays passes scheduled for **Today**. For MVP, no background cron job is strictly required, but check-in logic verifies that `visitDate == Today`.
- **Status:** `Assumption`

---

### 1.2 User & UX Interaction Questions

#### `OQ-UX-01`: Role Switcher / Demo Convenience in UI
- **Question:** Since this is an interview evaluation task tested by recruiters and hiring managers, should the login screen include fast 1-click test credential fill buttons?
- **Why it matters:** Significantly enhances evaluator experience and eliminates the need to manually copy-paste passwords from README.
- **Decision Affected:** Login screen UI design.
- **Current Assumption:** Add 3 quick-fill demo buttons on the `/login` screen: `[Demo Admin]`, `[Demo Receptionist]`, and `[Demo Employee]`.
- **Status:** `Confirmed Proposal`

#### `OQ-UX-02`: Remarks Requirement on Approval vs Rejection
- **Question:** Is host `remarks` strictly mandatory for both Approval and Rejection, or optional for Approval and mandatory for Rejection?
- **Why it matters:** Forcing remarks on approval adds unnecessary friction for busy employees, whereas rejections benefit from an explanation.
- **Decision Affected:** Modal form validation on Employee Dashboard.
- **Current Assumption:** Remarks are **optional** when approving a visit, but **mandatory** (minimum 5 characters) when rejecting a visit.
- **Status:** `Assumption`

---

### 1.3 Technical & Data Modeling Questions

#### `OQ-TECH-01`: Relationship Between User Accounts and Employee Records
- **Question:** Does an Employee record exist as a separate entity from a User Account, or is an Employee simply a User Account with `role = 'EMPLOYEE'`?
- **Why it matters:** The requirements specify "Manage Employees" and "Manage User Accounts" as two distinct Admin capabilities.
- **Decision Affected:** Schema design (`User` model vs `Employee` model).
- **Current Assumption:** `Employee` is a distinct entity representing the staff directory (code, name, department, phone, email). A `User` account has credentials and role, and when `role === 'EMPLOYEE'`, it contains a foreign key `employeeRef` pointing to its corresponding `Employee` record.
- **Status:** `Confirmed Design Choice`

#### `OQ-TECH-02`: Repository Structure (Monorepo vs Split Repo)
- **Question:** Should the project be delivered as a clean monorepo containing `client/` and `server/` or two standalone repositories?
- **Why it matters:** The assessment asks for a single GitHub repository URL submission.
- **Decision Affected:** Folder scaffolding and deployment configuration.
- **Current Assumption:** Single GitHub repository with `client/` (React + Vite) and `server/` (Node.js + Express) at root level, accompanied by a root `README.md`.
- **Status:** `Confirmed Design Choice`

---

## 2. Summary Table of Uncertainty & Resolution

| ID | Topic | Uncertainty Level | Default Decision Applied | Impact on MVP |
| :--- | :--- | :---: | :--- | :--- |
| `OQ-BIZ-01` | Visitor Identification | Low | Use `visitorPhone` as primary identity key | High reliability for Rules 1 & 2 |
| `OQ-BIZ-02` | Cancellation Authority | Low | Allowed by Receptionist & Host before Check-In | Complete compliance with Rule 10 |
| `OQ-BIZ-03` | Past Approved Passes | Low | Check-in restricted to current visit date | Prevents admission on expired dates |
| `OQ-UX-01` | Demo Fast-Fill Buttons | Low | Included on `/login` screen | Excellent reviewer experience |
| `OQ-UX-02` | Mandatory Remarks | Low | Optional for Approve, Required for Reject | Optimal UX & audit context |
| `OQ-TECH-01`| User vs Employee Model | Low | 1:1 linkage via `employeeRef` | Clean Admin CRUD separation |
| `OQ-TECH-02`| Repo Scaffolding | None | Root repo with `client/` and `server/` | Matches submission instructions |
