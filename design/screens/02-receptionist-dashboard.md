# Screen Spec 02: Receptionist Lobby Desk & Queue (`/receptionist/dashboard`)

## Document Control
- **Screen ID:** `SCR-02`
- **Route:** `/receptionist/dashboard`
- **Permitted Roles:** `RECEPTIONIST`, `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-DASH-02`, `FR-VIS-03`, `FR-VIS-04`, Rules 6, 7, 8, 9

---

## 1. Screen Purpose & User Goal
Act as the operational command hub for front-desk receptionists. Provides real-time visibility into today's visitor flow, enables rapid 1-click Check-In for host-approved visitors, records Check-Out for departing guests, and provides instant access to register new arrivals.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 HQ Lobby Desk]    [Role: RECEPTIONIST]  [👤 Sarah J ▾] │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard     │ Lobby Operations & Check-In Desk  [+ Register Visitor Btn]│
│ ➕ Register Pass │ Manage today's physical visitor arrivals and departures  │
│ 📋 Visitor Queue ├──────────────────────────────────────────────────────────┤
│ 🔍 Records       │ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐ │
│                  │ │ 👥 TODAY'S   │ │ 🏢 INSIDE    │ │ ⏳ PENDING HOST    │ │
│ ⚙️ Sign Out      │ │ 24 Visitors  │ │ 7 Inside     │ │ 5 Awaiting Review  │ │
│                  │ └──────────────┘ └──────────────┘ └────────────────────┘ │
│                  │                                                          │
│                  │ TODAY'S VISITOR QUEUE                                    │
│                  │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ 🔍 [ Search visitor name, phone, host... ] [Status ▾]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ PASS ID  VISITOR NAME    HOST EMPLOYEE TIME   STATUS │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1092 Jane Doe (Acme) David Chen    10:30A APPROVED││
│                  │ │          +1 555 019 2834 Engineering          [CheckIn]│
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1090 Mike Taylor     David Chen    09:15A INSIDE  ││
│                  │ │          +1 555 088 1920 Engineering          [CheckOut│
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1093 Robert Fox      Alex Wong     11:00A PENDING ││
│                  │ │          +1 555 044 9911 Design               [Blocked]│
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1088 Sara Lee        Priya Patel   09:00A REJECTED││
│                  │ │          +1 555 033 1122 Marketing            [Blocked]│
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [☰] 🛡️ JAYAM VPMS    [RECEPTION] [👤]   │
├─────────────────────────────────────────┤
│ Lobby Operations                        │
│ [+ Register New Visitor Button (Full) ] │
├─────────────────────────────────────────┤
│ ┌──────────────────┐ ┌────────────────┐ │
│ │ 👥 TODAY'S TOTAL │ │ 🏢 INSIDE NOW  │ │
│ │ 24 Passes        │ │ 7 Visitors     │ │
│ └──────────────────┘ └────────────────┘ │
│                                         │
│ Today's Visitors (24)                   │
│ [ 🔍 Quick Search...                  ] │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1092         [ APPROVED Badge ] │ │
│ │ Jane Doe (Acme Corp)                │ │
│ │ 👤 Host: David Chen · Engineering   │ │
│ │ 🕒 Expected: 10:30 AM               │ │
│ │ ─────────────────────────────────── │ │
│ │ [ ✓ Check In Visitor (Full Emerald)]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1090           [ INSIDE Badge ] │ │
│ │ Mike Taylor                         │ │
│ │ 👤 Host: David Chen · Engineering   │ │
│ │ 🕒 Checked in at 09:18 AM           │ │
│ │ ─────────────────────────────────── │ │
│ │ [ ⎋ Check Out Visitor (Full Indigo)]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1093          [ PENDING Badge ] │ │
│ │ Robert Fox                          │ │
│ │ 👤 Host: Alex Wong · Design         │ │
│ │ 🕒 Expected: 11:00 AM               │ │
│ │ ─────────────────────────────────── │ │
│ │ [ ⏳ Awaiting Host Approval (Muted)] │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 3. Component Anatomy & Tailwind Classes

1. **Top Metric Cards Grid:**
   - Container: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6`.
   - Card: `bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all`.
   - Number Value: `text-3xl font-bold tracking-tight text-slate-900`.
   - Label: `text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5`.
2. **Search & Filter Control Bar:**
   - Container: `bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-col sm:flex-row gap-3 items-center justify-between`.
   - Search Input: `w-full sm:w-80 h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500`.
3. **Queue Data Table (Desktop):**
   - Table Surface: `w-full text-left border-collapse`.
   - Header Row: `bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200`.
   - Data Row: `border-b border-slate-100 hover:bg-slate-50/70 transition-colors`.
4. **Action Buttons (Contextual Rule Enforcement):**
   - **Check-In Trigger (Active):** `bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all`.
   - **Check-Out Trigger (Active):** `bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all`.
   - **Disabled Action (Pending/Rejected):** `bg-slate-100 text-slate-400 border border-slate-200 text-xs px-3 py-1.5 rounded-lg cursor-not-allowed flex items-center gap-1.5`.

---

## 4. Interactive States & Business Rules Logic

1. **Rule 6 & 9 (Approval Gate):**
   - If `status === 'APPROVED'`, Check-In button is **enabled** in vibrant emerald.
   - If `status === 'PENDING_APPROVAL'`, Check-In is **disabled** with label `"Awaiting Host"`.
   - If `status === 'REJECTED'`, Check-In is **disabled** with label `"Rejected"`.
2. **Rule 7 & 8 (Occupancy Lifecycle):**
   - If `status === 'CHECKED_IN'`, Check-In transforms into **[Check Out]** (Indigo button).
   - Clicking Check-Out verifies `checkOutTime > checkInTime`, updates status to `CHECKED_OUT`, and live inside counter decrements.
3. **Empty Queue State:**
   - When no visitors exist for today: Centered illustration with copy: *"No visitors scheduled or checked in for today."* + Primary CTA button: `[+ Register First Visitor]`.
4. **Loading State:**
   - 3 skeleton KPI cards and 5 pulsing table skeleton rows.
