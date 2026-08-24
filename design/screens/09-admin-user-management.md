# Screen Spec 09: Administrator User Management & RBAC (`/admin/users`)

## Document Control
- **Screen ID:** `SCR-09`
- **Route:** `/admin/users`
- **Permitted Roles:** `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-ADM-02`, `11-auth-security.md`

---

## 1. Screen Purpose & User Goal
Enable administrators to manage system authentication accounts, assign Role-Based Access Control (RBAC) levels (`ADMINISTRATOR`, `RECEPTIONIST`, `EMPLOYEE`), link employee profiles, reset credentials, and deactivate accounts.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 Enterprise Admin]  [Role: ADMINISTRATOR] [👤 Marcus ▾]│
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard     │ User Accounts & Access Control        [+ Provision User] │
│ 👥 Employees     │ Manage system logins, role permissions, and credentials  │
│ 🔐 Users (Act)   ├──────────────────────────────────────────────────────────┤
│ 📈 Reports       │ ┌──────────────────────────────────────────────────────┐ │
│ 📜 Audit Logs    │ │ [🔍 Search by name or email...] [Role: All Roles ▾]  │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│ ⚙️ Sign Out      │ │ USER NAME / EMAIL     ASSIGNED ROLE  LINKED STAFF ST │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ Marcus Vance          [ADMINISTRATOR] N/A (System)ACT│ │
│                  │ │ admin@jayam.com                       [Edit] [Reset] │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ Sarah Jenkins         [RECEPTIONIST]  N/A (Lobby) ACT│ │
│                  │ │ sarah.reception@jayam                 [Edit] [Reset] │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ David Chen            [EMPLOYEE]      EMP-1001    ACT│ │
│                  │ │ david.chen@jayam.com                  [Edit] [Reset] │ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Provision User Account Modal (`Modal Overlay`)

```
┌──────────────────────────────────────────────────────────┐
│  Provision User Account                              [✕] │
├──────────────────────────────────────────────────────────┤
│  Full Display Name *           Account Email Address *   │
│  [ Alex Wong                 ] [ alex.wong@jayam.com   ] │
│                                                          │
│  System Role *                 Linked Staff Profile      │
│  [ EMPLOYEE                ▾ ] [ Alex Wong (EMP-1003)▾ ] │
│                                                          │
│  Initial Password *                                      │
│  [ ••••••••••••••••                                    ] │
│                                                          │
│  [ Cancel ]                     [ Create User Account(P)]│
└──────────────────────────────────────────────────────────┘
```

---

## 3. RBAC Mapping Rules
- If role is `EMPLOYEE`, the "Linked Staff Profile" dropdown is enabled and mandatory.
- If role is `ADMINISTRATOR` or `RECEPTIONIST`, the linked staff profile is optional/disabled.
