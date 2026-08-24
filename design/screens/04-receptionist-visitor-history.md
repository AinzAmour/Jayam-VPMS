# Screen Spec 04: Receptionist Visitor Records & Search (`/receptionist/visitors`)

## Document Control
- **Screen ID:** `SCR-04`
- **Route:** `/receptionist/visitors`
- **Permitted Roles:** `RECEPTIONIST`, `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-REP-01`, `FR-VIS-05`, Rule 10

---

## 1. Screen Purpose & User Goal
Provide receptionists and administrators with a comprehensive, searchable archive of all historical and active visitor passes. Enables fast querying across visitor names, contact details, host employees, visit dates, and status filters, as well as accessing per-pass activity timelines and executing visit cancellations.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 HQ Lobby Desk]    [Role: RECEPTIONIST]  [👤 Sarah J ▾] │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard     │ Visitor Records & Search                                 │
│ ➕ Register Pass │ Search, filter, and inspect past and current visitor log │
│ 📋 Visitor Queue ├──────────────────────────────────────────────────────────┤
│ 🔍 Records (Act) │ MULTI-CRITERIA SEARCH & FILTERS                          │
│                  │ ┌──────────────────────────────────────────────────────┐ │
│ ⚙️ Sign Out      │ │ [🔍 Search visitor name, phone...] [Host: All ▾]     │ │
│                  │ │ [📅 Date: All Dates ▾] [Status: All Statuses ▾] [Clr]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ PASS ID  VISITOR / ORG    HOST       DATE/TIME STATUS│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1092 Jane Doe         David Chen Today     APPRVD│ │
│                  │ │          Acme Corporation Engineerg  10:30 AM  [Hist]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1090 Mike Taylor      David Chen Today     INSIDE│ │
│                  │ │          Global Logistics Engineerg  09:15 AM  [Hist]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1085 Alice Brown      Priya P.   Yesterday CMPLTD│ │
│                  │ │          TechVentures     Marketing  14:00 PM  [Hist]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ #VP-1081 John Smith       Alex Wong  2026-08-22 CNCLD│ │
│                  │ │          Apex Systems     Design     11:30 AM  [Hist]│ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ Showing 1-10 of 142 records      [< Prev] [1] [2] [Next>]│
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [☰] Visitor Records & Search            │
├─────────────────────────────────────────┤
│ [ 🔍 Search name or phone...          ] │
│ Filter: [ Status: All ▾ ] [ Date ▾ ]    │
├─────────────────────────────────────────┤
│ Records Found: 142                      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1092         [ APPROVED Badge ] │ │
│ │ Jane Doe (Acme Corporation)         │ │
│ │ 👤 Host: David Chen · Engineering   │ │
│ │ 🕒 Scheduled: Today, 10:30 AM       │ │
│ │ ─────────────────────────────────── │ │
│ │ [ 📜 View Timeline ]   [ ✕ Cancel ] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #VP-1090           [ INSIDE Badge ] │ │
│ │ Mike Taylor (Global Logistics)      │ │
│ │ 👤 Host: David Chen · Engineering   │ │
│ │ 🕒 Checked in: Today, 09:18 AM      │ │
│ │ ─────────────────────────────────── │ │
│ │ [ 📜 View Timeline ]                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [ < Previous ]  Page 1 of 15  [ Next > ]│
└─────────────────────────────────────────┘
```

---

## 3. Filter Controls & Component Behaviors

1. **Multi-Criteria Search Inputs:**
   - **Text Query (`search`):** Live substring search on `visitorName`, `visitorPhone`, `visitorCompany`, and `passId`. Debounced by $300\text{ms}$.
   - **Host Dropdown (`hostId`):** Filters by specific host employee.
   - **Status Dropdown (`status`):** Filters by `ALL`, `PENDING_APPROVAL`, `APPROVED`, `CHECKED_IN`, `CHECKED_OUT`, `REJECTED`, `CANCELLED`.
   - **Date Range Selector (`date` / `dateRange`):** Standard date picker supporting exact dates or presets (Today, This Week, Past 30 Days).
2. **Contextual Action Menu:**
   - **View History (`[📜]`):** Opens the Activity History drawer/modal displaying all lifecycle timestamps, actors, and remarks.
   - **Cancel Pass (`[✕]`):** Visible only on passes in `PENDING_APPROVAL` or `APPROVED` status (Rule 10). Opens cancellation reason modal.
3. **Empty State:**
   - Graphic with copy: *"No visitor records match your filter criteria. Try adjusting search parameters or clearing filters."* + Button: `[Reset All Filters]`.
