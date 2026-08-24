# Screen Spec 12: Modals, Dialogs & Action Overlays (`SCR-12`)

## Document Control
- **Screen ID:** `SCR-12`
- **Permitted Roles:** All Roles (Contextual)
- **Design System:** Aegis UI
- **Source Requirement:** `FR-VIS-02`, `FR-VIS-03`, `FR-VIS-04`, `FR-VIS-05`, `FR-AUD-01`

---

## 1. Modal Dialog Specifications

---

### 1.1 Host Request Approval Modal (`Modal`)
- **Trigger:** Host clicks `[✓ Approve]` on `/employee/dashboard`.
- **Purpose:** Capture optional host instructions (e.g. room number, escort instructions) before transitioning pass to `APPROVED`.

```
┌──────────────────────────────────────────────────────────┐
│  Confirm Visitor Approval                            [✕] │
├──────────────────────────────────────────────────────────┤
│  You are approving the visit request for:                │
│  👤 Jane Doe (Acme Corporation)                          │
│  🕒 Scheduled: Tomorrow, 10:30 AM · Pass #VP-1094        │
│                                                          │
│  Host Remarks / Instructions (Optional):                 │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Please escort visitor to Conference Room B on Floor 3│ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  [ Cancel ]                      [ ✓ Confirm Approval(P)]│
└──────────────────────────────────────────────────────────┘
```

---

### 1.2 Host Request Rejection Modal (`Modal`)
- **Trigger:** Host clicks `[✕ Reject]` on `/employee/dashboard`.
- **Purpose:** Capture mandatory rejection remarks (min 5 characters) before transitioning pass to `REJECTED`.

```
┌──────────────────────────────────────────────────────────┐
│  Reject Visitor Request                              [✕] │
├──────────────────────────────────────────────────────────┤
│  You are rejecting the visit request for:                │
│  👤 Jane Doe (Acme Corporation)                          │
│                                                          │
│  Reason for Rejection * (Mandatory):                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Conflict with emergency executive off-site meeting  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  [ Cancel ]                      [ ✕ Confirm Rejection]  │
└──────────────────────────────────────────────────────────┘
```

---

### 1.3 Per-Pass Activity Lifecycle Timeline Drawer (`Drawer / Modal`)
- **Trigger:** Clicking `[📜 View History]` on any visitor pass row.
- **Purpose:** Display the complete chronological audit trail of a visitor pass.

```
┌──────────────────────────────────────────────────────────┐
│  Activity Lifecycle: Pass #VP-1092                   [✕] │
│  Visitor: Jane Doe · Host: David Chen                    │
├──────────────────────────────────────────────────────────┤
│  ● CHECKED_IN                                            │
│    2026-08-25 10:32:15 AM · by Sarah Jenkins (Reception)│
│    "Physical check-in at front desk"                     │
│    │                                                     │
│  ● APPROVED                                              │
│    2026-08-24 16:15:00 PM · by David Chen (Employee)     │
│    "Approved. Escort to Lab 2"                           │
│    │                                                     │
│  ● CREATED                                               │
│    2026-08-24 15:40:00 PM · by Sarah Jenkins (Reception)│
│    "Pass registered and dispatched to host"              │
│                                                          │
│  [ Close Timeline ]                                      │
└──────────────────────────────────────────────────────────┘
```

---

### 1.4 Printable Visitor Pass Card Modal (`Modal`)
- **Trigger:** Clicking `[Print Pass]` upon check-in.
- **Purpose:** Formatted badge ready for thermal printing or front-desk display.

```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🛡️ JAYAM VISITOR PASS       #VP-20260825-001       │  │
│  │                                                    │  │
│  │ VISITOR:  Jane Doe                                 │  │
│  │ COMPANY:  Acme Corporation                         │  │
│  │ HOST:     David Chen (Engineering Dept)            │  │
│  │ DATE:     2026-08-25                               │  │
│  │ TIME IN:  10:32 AM                                 │  │
│  │                                                    │  │
│  │ STATUS:   APPROVED & CHECKED IN                    │  │
│  └────────────────────────────────────────────────────┘  │
│  [ Close ]                              [ 🖨️ Print Badge ]│
└──────────────────────────────────────────────────────────┘
```
