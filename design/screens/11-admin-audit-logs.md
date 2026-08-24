# Screen Spec 11: Administrator System Audit Trail (`/admin/audit-logs`)

## Document Control
- **Screen ID:** `SCR-11`
- **Route:** `/admin/audit-logs`
- **Permitted Roles:** `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-AUD-01`, `06-page-map.md`

---

## 1. Screen Purpose & User Goal
Provide compliance auditors and security directors with an immutable, searchable, and filterable system-wide audit trail recording every state transition, user attribution, and timestamp across the platform.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 Enterprise Admin]  [Role: ADMINISTRATOR] [👤 Marcus ▾]│
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard     │ System Activity & Compliance Audit Logs                  │
│ 👥 Employees     │ Immutable forensic log of all visitor pass operations    │
│ 🔐 User Accounts ├──────────────────────────────────────────────────────────┤
│ 📈 Reports       │ ┌──────────────────────────────────────────────────────┐ │
│ 📜 Logs (Act)    │ │ [🔍 Search by pass ID, visitor, actor...] [Action ▾] │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│ ⚙️ Sign Out      │ │ TIMESTAMP    ACTION    PASS ID  PERFORMED BY   ROLE     │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 10:32:15 AM  CHECK_IN  #VP-1092 Sarah Jenkins  RECEPTN  │ │
│                  │ │              Note: Physical admission at Main Desk    │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 10:15:00 AM  APPROVED  #VP-1092 David Chen     EMPLOYEE │ │
│                  │ │              Note: "Approved for Conference Room B"   │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 09:40:22 AM  CREATED   #VP-1092 Sarah Jenkins  RECEPTN  │ │
│                  │ │              Note: Visitor registration submitted     │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 09:20:00 AM  CHECK_OUT #VP-1087 Sarah Jenkins  RECEPTN  │ │
│                  │ │              Note: Physical exit recorded             │ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [☰] System Audit Trail                  │
├─────────────────────────────────────────┤
│ [ 🔍 Search logs...                   ] │
│ Filter: [ Action: All Actions ▾ ]       │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🕒 10:32:15 AM · [ CHECK_IN ]       │ │
│ │ Target: #VP-1092 (Jane Doe)         │ │
│ │ Actor: Sarah Jenkins (Receptionist) │ │
│ │ Detail: "Admission at Main Desk"    │ │
│ ├─────────────────────────────────────┤ │
│ │ 🕒 10:15:00 AM · [ APPROVED ]       │ │
│ │ Target: #VP-1092 (Jane Doe)         │ │
│ │ Actor: David Chen (Employee)        │ │
│ │ Remark: "Approved for Conf Room B"  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 3. Audit Filtering & Security Features
- **Immutable Log Guarantee:** No edit or delete endpoints exist for the `activity_logs` collection.
- **Action Filters:** `ALL`, `CREATED`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`.
