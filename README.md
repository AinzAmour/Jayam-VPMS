# Jayam VPMS — Visitor Pass Management System

Enterprise Physical Security & Workplace Visitor Operations Platform built with the **MERN Stack** (MongoDB, Express.js, React.js 18, Node.js) with Tailwind CSS, JWT RBAC Authentication, and strict implementation of all 10 Business Rules.

---

## 🌟 Key Features & MVP Scope

### 1. Role-Based Access Control (RBAC) & Authentication
- **Administrator:** Executive workplace overview KPIs, complete staff directory CRUD, system user account provisioning, filterable analytics & summary reports (with CSV & Print export), and system-wide immutable forensic audit trail.
- **Receptionist:** Lobby admission command center, live occupancy tracking, new visitor registration form with real-time capacity checks, 1-click Check-In (upon approval), 1-click Check-Out, printable official visitor pass slips, and pass cancellation.
- **Employee (Host):** Host review dashboard with real-time pending approvals counter (Rule 5 capacity monitor), 1-click Approve with host instructions, 1-click Reject with mandatory remarks, today's cleared guests, and host historical visitor logs.

---

## 🛡️ Business Rules Implementation (100% Compliant)

| Rule # | Business Rule Specification | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Rule 1** | A visitor cannot have more than one active visit at the same time (`PENDING_APPROVAL`, `APPROVED`, `CHECKED_IN`). | Validated atomically before pass creation in `server/services/businessRules.js`. |
| **Rule 2** | Duplicate registrations for the same visitor on the same date are prohibited. | Compound query check on `(visitorPhone, visitDate)` rejecting duplicates. |
| **Rule 3** | Visit date cannot be earlier than current date. | Date comparison validation on normalized `YYYY-MM-DD`. |
| **Rule 4** | For today's registrations, expected arrival time cannot be earlier than current time. | Time comparison on `HH:mm` format for current day registrations. |
| **Rule 5** | An employee cannot have more than 3 pending visitor requests awaiting approval. | Atomic count query on `(hostEmployeeId, PENDING_APPROVAL)` blocking registration if count $\ge 3$. Frontend host selector displays live pending counters and blocks overloaded hosts. |
| **Rule 6** | Visitors can only be checked in after host approval. | Receptionist check-in endpoint strictly rejects non-`APPROVED` passes (`400 Bad Request`). |
| **Rule 7** | A visitor who is already checked in cannot be checked in again until checked out. | Active check-in state validation preventing overlapping admissions. |
| **Rule 8** | Check-out time must always be later than check-in time (`checkOutTime > checkInTime`). | Pre-save validation enforcing positive visit duration. |
| **Rule 9** | Rejected visitor requests cannot be checked in. | Explicit status check preventing admission of rejected passes. |
| **Rule 10** | Cancelled visits should not appear in active visitor lists. | Excluded from lobby queue queries (`status: { $ne: 'CANCELLED' }`) and archived. |

---

## 👥 Demo Quick-Login Credentials

The login page (`/login`) includes a **Quick Demo Switcher** with 1-click test buttons for instantaneous evaluation:

| Role | Email | Password | Linked Staff Profile |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@jayam.com` | `Password123!` | System Administrator |
| 🏨 **Receptionist** | `receptionist@jayam.com` | `Password123!` | Front Desk Reception |
| 👨‍💻 **Employee (Host)** | `david.chen@jayam.com` | `Password123!` | David Chen (Lead Software Architect) |
| 👩‍💼 **Employee (Host)** | `ananya.sharma@jayam.com` | `Password123!` | Ananya Sharma (Talent Acquisition Lead) |
| 💼 **Employee (Host)** | `marcus.vance@jayam.com` | `Password123!` | Marcus Vance (VP of Product) |
| 🛡️ **Employee (Host)** | `priya.patel@jayam.com` | `Password123!` | Priya Patel (Head of Facilities) |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18+ or v20+ LTS
- **npm**: v9+

### 1. Installation

Install dependencies in both client and server:

```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 2. Environment Configuration

The backend contains a `.env` configuration file in `server/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=jayam_vpms_jwt_super_secret_key_2026

# Optional: To connect to MongoDB Atlas or local MongoDB, specify MONGODB_URI:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/jayam_vpms
# Note: If left blank, the server automatically falls back to an embedded in-memory MongoDB instance for zero-setup execution!
```

### 3. Run Automated Tests

Run the comprehensive 10-rule validation test suite:

```bash
cd server
npm test
```

### 4. Start Development Servers

Run backend and frontend simultaneously:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Running on http://localhost:5000/api
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

---

## 📡 REST API Documentation

### Authentication Endpoints
- `POST /api/auth/login` — Sign in with email & password, returns JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile.

### Visitor Pass Endpoints
- `POST /api/visitors` — Register new visitor pass (Enforces Rules 1, 2, 3, 4, 5). [Receptionist, Admin]
- `GET /api/visitors` — Multi-criteria search and filter passes. [All Roles, Scoped for Employee]
- `GET /api/visitors/today-queue` — Live lobby queue for front desk. [Receptionist, Admin]
- `GET /api/visitors/employee-stats` — Employee pending approvals and today's visitors. [Employee, Admin]
- `GET /api/visitors/:id` — Single pass details. [All Roles]
- `GET /api/visitors/:id/activities` — Immutable audit history timeline for pass. [All Roles]
- `PUT /api/visitors/:id/status` — Host approves or rejects request with remarks. [Employee, Admin]
- `PUT /api/visitors/:id/checkin` — 1-click Check-In (Enforces Rules 6, 7, 9). [Receptionist, Admin]
- `PUT /api/visitors/:id/checkout` — 1-click Check-Out (Enforces Rule 8). [Receptionist, Admin]
- `PUT /api/visitors/:id/cancel` — Cancel visit pass before check-in (Rule 10). [Receptionist, Employee, Admin]

### Staff & User Management Endpoints
- `GET /api/employees` — List staff directory with live Rule 5 pending counts.
- `POST /api/employees` — Admin creates staff profile. [Admin]
- `PUT /api/employees/:id` — Admin edits staff profile. [Admin]
- `GET /api/users` — Admin lists system user accounts. [Admin]
- `POST /api/users` — Admin provisions new user account with role & host link. [Admin]
- `PUT /api/users/:id` — Admin edits user account credentials & active status. [Admin]

### Reports & Analytics Endpoints
- `GET /api/reports/summary` — Aggregated summary reports (Today, This Week, Custom Range). [Admin]
- `GET /api/reports/dashboard-stats` — Real-time executive dashboard KPIs. [Admin]
- `GET /api/activities` — System-wide immutable forensic audit trail. [Admin]

---

## 🚢 Deployment Guide

- **Frontend (Vercel / Netlify):**
  - Build command: `npm run build`
  - Output directory: `dist`
- **Backend (Render / Railway / VPS):**
  - Start command: `node server.js`
  - Environment variables: `PORT=5000`, `NODE_ENV=production`, `JWT_SECRET=...`, `MONGODB_URI=...`
