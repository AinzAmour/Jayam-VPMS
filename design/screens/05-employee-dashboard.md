# Screen Spec 05: Employee Host Portal & Approvals (`/employee/dashboard`)

## Document Control
- **Screen ID:** `SCR-05`
- **Route:** `/employee/dashboard`
- **Permitted Roles:** `EMPLOYEE`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-DASH-03`, `FR-VIS-02`, Rule 5

---

## 1. Screen Purpose & User Goal
Provide host employees with a focused, clutter-free workspace to inspect incoming visitor requests assigned to them, review the stated purpose and schedule, and grant **Approval** (with optional host instructions) or **Rejection** (with explanatory remarks), while monitoring their **Rule 5** pending approval capacity ($\le 3$ requests).

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 Host Portal]      [Role: EMPLOYEE]      [👤 David C ▾] │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📥 Approvals     │ My Visitor Approvals & Daily Schedule                    │
│ 🕒 Visit History │ Review incoming requests and manage hosted guests        │
│                  ├──────────────────────────────────────────────────────────┤
│ ⚙️ Sign Out      │ ┌───────────────────────────┐ ┌────────────────────────┐ │
│                  │ │ ⏳ PENDING YOUR APPROVAL   │ │ 👥 TODAY'S CONFIRMED   │ │
│                  │ │ 2 / 3 Limit Used          │ │ 3 Guests Expected    │ │
│                  │ │ [████████████░░░░] 66%    │ │ 1 Currently Inside   │ │
│                  │ └───────────────────────────┘ └────────────────────────┘ │
│                  │                                                          │
│                  │ PENDING VISITOR REQUESTS REQUIRING YOUR ACTION           │
│                  │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ PASS ID: #VP-1094 | Jane Doe (Acme Corporation)      │ │
│                  │ │ 🕒 Scheduled: Tomorrow, 10:30 AM | 📞 +1 555 019 2834 │ │
│                  │ │ 📄 Purpose: "Q3 Architecture Review & Security Sync" │ │
│                  │ │ Actions: [ ✓ Approve (Green) ]   [ ✕ Reject (Rose) ] │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ PASS ID: #VP-1095 | Liam Nelson (TechVentures)       │ │
│                  │ │ 🕒 Scheduled: Friday, 02:00 PM   | 📞 +1 555 077 3344 │ │
│                  │ │ 📄 Purpose: "Consulting Interview & Portfolio Review"│ │
│                  │ │ Actions: [ ✓ Approve (Green) ]   [ ✕ Reject (Rose) ] │ │
│                  │ └──────────────────────────────────────────────────────┘ │
│                  │                                                          │
│                  │ TODAY'S CONFIRMED GUESTS                                 │
│                  │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ PASS ID  VISITOR NAME    TIME     STATUS   MY REMARKS│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1090 Mike Taylor     09:15 AM INSIDE   Rm 302    │ │
│                  │ │ #VP-1089 Clara Oswald    03:30 PM APPROVED Lobby B   │ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [☰] 🛡️ Host Portal     [David Chen]     │
├─────────────────────────────────────────┤
│ Pending Approvals                       │
│ ┌─────────────────────────────────────┐ │
│ │ ⏳ 2 OF 3 PENDING LIMIT USED        │ │
│ │ Capacity: [████████████░░░░] 66%    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Action Required (2 Requests)            │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1094       [ PENDING APPROVAL ] │ │
│ │ Jane Doe (Acme Corporation)         │ │
│ │ 🕒 Tomorrow, 10:30 AM               │ │
│ │ 📄 "Q3 Architecture Review..."      │ │
│ │ ─────────────────────────────────── │ │
│ │ [ ✓ Approve (Full) ] [ ✕ Reject ]   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1095       [ PENDING APPROVAL ] │ │
│ │ Liam Nelson (TechVentures)          │ │
│ │ 🕒 Friday, 02:00 PM                 │ │
│ │ 📄 "Consulting Interview..."        │ │
│ │ ─────────────────────────────────── │ │
│ │ [ ✓ Approve (Full) ] [ ✕ Reject ]   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Today's Expected Visitors (2)           │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1090           [ INSIDE Badge ] │ │
│ │ Mike Taylor · Arrived 09:18 AM      │ │
│ │ Note: "Meet in Conference Room 302" │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 3. Approval & Rejection Modal Interactions

1. **Approve Action Trigger:**
   - Clicking **[✓ Approve]** opens the Approval Modal.
   - Field: Optional Host Remarks textarea (e.g. *"Please have guest wait at 3rd Floor Reception"*).
   - Confirming updates status to `APPROVED`, decrements host pending count, logs `APPROVED` in audit trail, and fires success toast.
2. **Reject Action Trigger:**
   - Clicking **[✕ Reject]** opens the Rejection Modal.
   - Field: Mandatory Rejection Reason textarea (min 5 characters, e.g. *"Unavailable due to conflicting client deployment"*).
   - Confirming updates status to `REJECTED`, decrements host pending count, logs `REJECTED` with remarks, and fires confirmation toast.
3. **Empty State (Zero Pending Requests):**
   - Renders a clean success graphic with copy: *"All caught up! You have no pending visitor requests awaiting approval."*
