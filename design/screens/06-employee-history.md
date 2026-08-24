# Screen Spec 06: Employee Hosting History (`/employee/history`)

## Document Control
- **Screen ID:** `SCR-06`
- **Route:** `/employee/history`
- **Permitted Roles:** `EMPLOYEE`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-REP-01`, `06-page-map.md`

---

## 1. Screen Purpose & User Goal
Provide employees with a personal historical log of all external guests they have hosted, approved, or rejected in the past. Allows employees to inspect visit dates, host remarks, actual check-in/out durations, and complete lifecycle audit trails.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 Host Portal]      [Role: EMPLOYEE]      [👤 David C ▾] │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📥 Approvals     │ My Hosted Visitors History                               │
│ 🕒 History (Act) │ Historical archive of all past visitors hosted by you    │
│                  ├──────────────────────────────────────────────────────────┤
│ ⚙️ Sign Out      │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ [🔍 Search visitor name, company...] [Status: All ▾] │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ PASS ID  VISITOR NAME    COMPANY      DATE   STATUS  │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1082 Sarah Connor    Cyberdyne    Aug 20 COMPLTD │ │
│                  │ │          In: 10:00 AM · Out: 11:30 AM (1h 30m) [Hist]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1077 Bruce Wayne     Wayne Ent.   Aug 18 COMPLTD │ │
│                  │ │          In: 14:00 PM · Out: 15:45 PM (1h 45m) [Hist]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1065 Peter Parker    Daily Bugle  Aug 14 REJECTED│ │
│                  │ │          Remark: "Not available for press interview" │ │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [☰] My Hosted Visitors                  │
├─────────────────────────────────────────┤
│ [ 🔍 Search past visitors...          ] │
│ Filter: [ Status: All Statuses ▾ ]      │
├─────────────────────────────────────────┤
│ Total Visitors Hosted: 18               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1082         [ COMPLETED Badge] │ │
│ │ Sarah Connor (Cyberdyne Systems)    │ │
│ │ 📅 Aug 20, 2026 · Duration: 1h 30m  │ │
│ │ Remark: "Escort to R&D Lab 4"       │ │
│ │ ─────────────────────────────────── │ │
│ │ [ 📜 View Lifecycle Timeline ]      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1065          [ REJECTED Badge] │ │
│ │ Peter Parker (Daily Bugle)          │ │
│ │ 📅 Aug 14, 2026                     │ │
│ │ Reason: "Not available for press"   │ │
│ │ ─────────────────────────────────── │ │
│ │ [ 📜 View Lifecycle Timeline ]      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 3. Component Details & Interactive Behavior
1. **Search & Filter Controls:** Filter by visitor name or status (`COMPLETED`, `REJECTED`, `CANCELLED`).
2. **Lifecycle History Trigger (`[📜]`):** Opens the Activity History drawer with full timestamp audit trail for that specific pass.
3. **Empty State:** Graphic placeholder: *"You have not hosted any visitors yet."*
