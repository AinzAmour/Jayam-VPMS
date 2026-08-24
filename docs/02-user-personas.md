# 02. User Personas — Visitor Pass Management System (VPMS)

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## Overview
Based directly on the three core roles identified in the system requirements, the following personas represent the primary system actors:
1. **Sarah Jenkins — The Front-Desk Receptionist**
2. **David Chen — The Host Employee**
3. **Marcus Vance — The Facility Administrator & Security Head**

---

## Persona 1: Front-Desk Receptionist

```
┌────────────────────────────────────────────────────────┐
│  SARAH JENKINS (28) — Front-Desk Receptionist          │
│  "Speed and precision at reception keep our lobby safe │
│   and running smoothly."                               │
└────────────────────────────────────────────────────────┘
```

### 1. Profile & Role
- **Role:** `RECEPTIONIST`
- **Location:** Main Lobby / Front Security Desk
- **Technical Ability:** Moderate (comfortable with browser apps, point-of-sale, spreadsheet entry).

### 2. Primary Goals
- Register arriving and pre-scheduled visitors in under 45 seconds.
- Instantly verify if a visitor has been approved by the designated host employee.
- Check in approved visitors with a single click and stamp their arrival time.
- Check out departing visitors quickly to maintain accurate live occupancy counts.
- Search visitor records rapidly by visitor name, host name, or pass status.

### 3. Pain Points & Frustrations
- **Manual Register Chaos:** Illegible handwriting in physical books, misplaced sign-in sheets.
- **Host Unresponsiveness:** Visitors waiting in the lobby because the host has too many pending requests or failed to approve.
- **Duplicate Records:** Re-entering the same visitor's details multiple times.
- **Security Ambiguity:** Checking in guests without knowing whether the host actually approved them.

### 4. Needs & Expected Behavior
- Quick-fill registration form with validation (phone/email duplicate check, schedule validation).
- Live badge or status indicator showing `PENDING_APPROVAL`, `APPROVED`, `CHECKED_IN`, `CHECKED_OUT`, `REJECTED`.
- Action buttons that are disabled or enabled strictly based on visit status (e.g., Check-In button disabled until status is `APPROVED`).
- Clear visual alerts when business rules are triggered (e.g., "Employee already has 3 pending requests").

### 5. Key System Requirements for this Persona
- Fast visitor registration form with employee lookup.
- Receptionist Dashboard showing: *Today's Visitors*, *Visitors Currently Inside*, *Quick Check-In / Check-Out Actions*.
- Visitor History table with instant keyword search and status filter.

---

## Persona 2: Host Employee

```
┌────────────────────────────────────────────────────────┐
│  DAVID CHEN (34) — Senior Project Engineer (Host)      │
│  "I need to know who is visiting me, when, and why,    │
│   without getting spammed with unmanageable requests." │
└────────────────────────────────────────────────────────┘
```

### 1. Profile & Role
- **Role:** `EMPLOYEE`
- **Location:** Engineering Dept / Office Floor
- **Technical Ability:** High (tech-savvy, uses web and mobile productivity apps daily).

### 2. Primary Goals
- Review incoming visitor requests assigned to him with zero friction.
- Inspect visit details: visitor name, company/organization, scheduled date/time, and stated purpose.
- Approve legitimate visits with optional remarks (e.g., "Please escort to Conference Room B").
- Reject unsolicited, duplicate, or untimely visits with mandatory or optional explanatory remarks.
- Keep his pending request queue under control (enforced limit of maximum 3 pending requests).

### 3. Pain Points & Frustrations
- **Unannounced Lobby Arrivals:** Visitors arriving at reception without advance notice.
- **Queue Overload:** Having countless unreviewed requests piling up.
- **Lack of Context:** Not knowing why someone is visiting or who invited them.

### 4. Needs & Expected Behavior
- Dedicated Employee Portal/Dashboard highlighting only requests assigned to him.
- Prominent `Approve` and `Reject` action triggers with a modal for adding remarks.
- Real-time indicator when pending queue reaches the threshold of 3 requests (Rule 5).
- History view of past visitors he hosted.

### 5. Key System Requirements for this Persona
- Employee Dashboard displaying *Pending Visitor Requests*, *Today's Approved Visits*, *Visit History*.
- Modal dialog for approval/rejection with a `remarks` text input.
- Automatic status update reflected immediately across the system.

---

## Persona 3: Facility Administrator & Security Head

```
┌────────────────────────────────────────────────────────┐
│  MARCUS VANCE (46) — Head of Security & Facility Admin │
│  "Total premises visibility, strict compliance, and    │
│   rock-solid audit trails are non-negotiable."         │
└────────────────────────────────────────────────────────┘
```

### 1. Profile & Role
- **Role:** `ADMINISTRATOR`
- **Location:** Operations / IT / Security Office
- **Technical Ability:** High (expert in system administration, user management, and compliance reporting).

### 2. Primary Goals
- Maintain system governance by managing employee records and user accounts (provisioning, role assignment, deactivation).
- Monitor facility occupancy in real-time (number of visitors currently inside the building).
- Generate aggregated visitor reports filtered by date ranges (Today, This Week, Custom Date Range).
- Audit the immutable Activity History log to investigate security anomalies or verify compliance.

### 3. Pain Points & Frustrations
- **Compliance Blind Spots:** Inability to prove who authorized an on-premise visitor during an audit.
- **Emergency Evacuation Uncertainty:** Not having an instantaneous head-count of external visitors during fire drills or emergencies.
- **Unauthorized Account Escalation:** Users accessing administrative configuration or sensitive visitor records without permission.

### 4. Needs & Expected Behavior
- Executive Overview Dashboard with comprehensive system KPIs: *Total Visitors Today*, *Visitors Currently Inside*, *Total Employees*, *Scheduled Visitors*, *Approval/Rejection Ratios*.
- User & Employee Management CRUD interface with password resets and role assignment (`ADMIN`, `RECEPTIONIST`, `EMPLOYEE`).
- Advanced Reports Generator with date filters and visual breakdown.
- Audit Log Inspector displaying every state change, timestamp, and actor.

### 5. Key System Requirements for this Persona
- Admin Dashboard with live statistics.
- Employee & User Management interfaces.
- Filterable Visitor Reports table with date picker.
- System-wide Activity History / Audit Trail viewer.

---

## Summary Matrix: Roles, Personas & Responsibilities

| Attribute | Sarah Jenkins (Receptionist) | David Chen (Employee) | Marcus Vance (Administrator) |
| :--- | :--- | :--- | :--- |
| **System Role** | `RECEPTIONIST` | `EMPLOYEE` | `ADMINISTRATOR` |
| **Primary Focus** | Front-desk operations | Visitor approval & hosting | Governance, security & analytics |
| **Core Actions** | Register, Check-In, Check-Out, Search | Review, Approve, Reject, Add Remarks | Manage Users, Manage Employees, View Reports, Inspect Audit Log |
| **Primary Metric** | Lobby turnaround time | Pending approvals ($\le 3$) | Total premises safety & compliance |
| **RBAC Scope** | Visitor lifecycle execution | Own visitor requests only | Full system configuration & reporting |
