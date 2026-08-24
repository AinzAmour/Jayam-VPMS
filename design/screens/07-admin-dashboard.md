# Screen Spec 07: Administrator Overview Dashboard (`/admin/dashboard`)

## Document Control
- **Screen ID:** `SCR-07`
- **Route:** `/admin/dashboard`
- **Permitted Roles:** `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-DASH-01`, `06-page-map.md`

---

## 1. Screen Purpose & User Goal
Provide system administrators and facility security leadership with an executive command center displaying real-time workplace occupancy, visitor traffic trends, staff counts, quick administrative actions, and recent activity logs.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 Enterprise Admin]  [Role: ADMINISTRATOR] [👤 Marcus ▾]│
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard(Act)│ Enterprise Operations & Security Overview                │
│ 👥 Employees     │ Real-time facility occupancy, visitor metrics & shortcuts│
│ 🔐 User Accounts ├──────────────────────────────────────────────────────────┤
│ 📈 Reports       │ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐ │
│ 📜 Audit Logs    │ │ 👥 TODAY'S   │ │ 🏢 INSIDE NOW│ │ 🧑‍💼 TOTAL STAFF   │ │
│                  │ │ 24 Visitors  │ │ 7 Inside     │ │ 48 Active Staff    │ │
│ ⚙️ Sign Out      │ └──────────────┘ └──────────────┘ └────────────────────┘ │
│                  │                                                          │
│                  │ QUICK ADMINISTRATIVE SHORTCUTS                           │
│                  │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ [ + Add Employee ]  [ + Provision User ] [ 📈 Reports│ │
│                  │ └──────────────────────────────────────────────────────┘ │
│                  │                                                          │
│                  │ RECENT VISITOR ACTIVITY FEED (REAL-TIME AUDIT)           │
│                  │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ TIME     ACTION     TARGET PASS  ACTOR      ROLE     │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 10:32 AM CHECK_IN   #VP-1092     S. Jenkins RECEPTION│ │
│                  │ │ 10:15 AM APPROVED   #VP-1092     David Chen EMPLOYEE │ │
│                  │ │ 09:40 AM CREATED    #VP-1092     S. Jenkins RECEPTION│ │
│                  │ │ 09:20 AM CHECK_OUT  #VP-1087     S. Jenkins RECEPTION│ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [☰] 🛡️ Enterprise Admin  [Marcus Vance] │
├─────────────────────────────────────────┤
│ Executive Overview                      │
│ ┌─────────────────────────────────────┐ │
│ │ 🏢 VISITORS INSIDE: 7 ACTIVE GUESTS │ │
│ │ 👥 Total Today: 24 Passes           │ │
│ │ 🧑‍💼 Active Staff: 48 Registered     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Quick Management Actions                │
│ [ + Add New Employee                  ] │
│ [ + Provision User Account            ] │
│ [ 📈 View Detailed Visitor Reports    ] │
│                                         │
│ Live Activity Stream                    │
│ ┌─────────────────────────────────────┐ │
│ │ 🕒 10:32 AM · [ CHECK_IN ]          │ │
│ │ #VP-1092 (Jane Doe)                 │ │
│ │ Actor: Sarah Jenkins (Receptionist) │ │
│ ├─────────────────────────────────────┤ │
│ │ 🕒 10:15 AM · [ APPROVED ]          │ │
│ │ #VP-1092 (Jane Doe)                 │ │
│ │ Actor: David Chen (Employee)        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 3. Component Hierarchy & Tailwind Classes
1. **Executive Metric Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6`.
2. **Occupancy Alert Card:** `bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-md flex items-center justify-between`.
3. **Quick Action Grid:** `grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6`.
4. **Recent Activity Table:** `bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm`.
