# Screen Spec 10: Administrator Reports & Analytics (`/admin/reports`)

## Document Control
- **Screen ID:** `SCR-10`
- **Route:** `/admin/reports`
- **Permitted Roles:** `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-REP-02`, `06-page-map.md`

---

## 1. Screen Purpose & User Goal
Provide executive management and compliance teams with filterable summary reports and aggregated visitor analytics across customizable timeframe windows (Today, This Week, Custom Date Range).

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 Enterprise Admin]  [Role: ADMINISTRATOR] [👤 Marcus ▾]│
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard     │ Visitor Reports & Workplace Analytics   [📥 Export CSV]  │
│ 👥 Employees     │ Filterable visitor volume, approvals, and duration stats │
│ 🔐 User Accounts ├──────────────────────────────────────────────────────────┤
│ 📈 Reports(Act)  │ TIMEFRAME FILTER BAR                                     │
│ 📜 Audit Logs    │ Filter: [ Today ] [ (Active) This Week ] [ Custom Range ]│
│                  │ Dates:  [ 📅 2026-08-18 ] to [ 📅 2026-08-24 ] [Apply]  │
│ ⚙️ Sign Out      ├──────────────────────────────────────────────────────────┤
│                  │ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐ │
│                  │ │ 📊 TOTAL     │ │ ✓ APPROVED   │ │ ⏱️ AVG VISIT TIME   │ │
│                  │ │ 142 Visits   │ │ 128 (90.1%)  │ │ 1h 42m               │ │
│                  │ └──────────────┘ └──────────────┘ └────────────────────┘ │
│                  │                                                          │
│                  │ SUMMARY BREAKDOWN BY DATE                                │
│                  │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ DATE       TOTAL PASSES  APPROVED  REJECTED COMPLETED│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 2026-08-24 24            22        2        19       │ │
│                  │ │ 2026-08-23 31            29        2        28       │ │
│                  │ │ 2026-08-22 28            25        3        24       │ │
│                  │ │ 2026-08-21 35            31        4        30       │ │
│                  │ │ 2026-08-20 24            21        3        20       │ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [☰] Visitor Reports & Stats             │
├─────────────────────────────────────────┤
│ Filter Timeframe                        │
│ [ Today ] [ (Active) This Week ]        │
│ [ Custom Date Range                   ▾]│
│ [ 📥 Export CSV Report                ] │
├─────────────────────────────────────────┤
│ Summary (This Week)                     │
│ ┌─────────────────────────────────────┐ │
│ │ 📊 Total Passes: 142 Visits         │ │
│ │ ✓ Approved: 128 (90.1%)             │ │
│ │ ✕ Rejected: 14 (9.9%)               │ │
│ │ ⏱️ Avg Duration: 1h 42m             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Daily Breakdown                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📅 Today (Aug 24) · 24 Passes       │ │
│ │ 22 Approved · 2 Rejected · 19 Exited│ │
│ ├─────────────────────────────────────┤ │
│ │ 📅 Yesterday (Aug 23) · 31 Passes   │ │
│ │ 29 Approved · 2 Rejected · 28 Exited│ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 3. Reporting Metrics & Aggregation Rules
- **Total Passes:** Total number of visitor passes created within the selected date range.
- **Approval Rate:** `(approved / total) * 100`.
- **Average Duration:** Difference between `checkOutTime` and `checkInTime` across all completed passes.
