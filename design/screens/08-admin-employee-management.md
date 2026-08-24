# Screen Spec 08: Administrator Employee Management (`/admin/employees`)

## Document Control
- **Screen ID:** `SCR-08`
- **Route:** `/admin/employees`
- **Permitted Roles:** `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-ADM-01`, `06-page-map.md`

---

## 1. Screen Purpose & User Goal
Allow administrators to maintain the organization's staff directory by creating, updating, and toggling active status for employees who can host visitors.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 Enterprise Admin]  [Role: ADMINISTRATOR] [👤 Marcus ▾]│
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard     │ Staff Directory & Employee Management  [+ Add Employee]  │
│ 👥 Employees(Act)│ Maintain staff records and host availability             │
│ 🔐 User Accounts ├──────────────────────────────────────────────────────────┤
│ 📈 Reports       │ ┌──────────────────────────────────────────────────────┐ │
│ 📜 Audit Logs    │ │ [🔍 Search by name, code, dept...] [Dept: All ▾]     │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│ ⚙️ Sign Out      │ │ CODE     STAFF NAME     EMAIL / PHONE  DEPARTMENT STAT│
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ EMP-1001 David Chen     david@jayam    Engineering ACT│ │
│                  │ │                         +1 555 019 283 [Edit] [Deact]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ EMP-1002 Priya Patel    priya@jayam    Marketing  ACT│ │
│                  │ │                         +1 555 022 991 [Edit] [Deact]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ EMP-1003 Alex Wong      alex@jayam     Design     ACT│ │
│                  │ │                         +1 555 044 112 [Edit] [Deact]│ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Add / Edit Employee Modal (`Modal Overlay`)

```
┌──────────────────────────────────────────────────────────┐
│  Add New Staff Member                                [✕] │
├──────────────────────────────────────────────────────────┤
│  Employee Code *               Full Legal Name *         │
│  [ EMP-1004                  ] [ Marcus Green          ] │
│                                                          │
│  Corporate Email *             Mobile Phone *            │
│  [ marcus.green@jayam.com    ] [ +1 555 099 1234       ] │
│                                                          │
│  Department *                  Designation *             │
│  [ Engineering             ▾ ] [ Senior QA Architect   ] │
│                                                          │
│  [ Cancel ]                     [ Save Staff Member (P) ]│
└──────────────────────────────────────────────────────────┘
```

---

## 3. Component Details & Validation
- **Employee Code:** Unique identifier (e.g. `EMP-1004`).
- **Status Toggle:** Active staff are available in visitor registration host dropdown. Deactivating an employee prevents future visitor assignments.
