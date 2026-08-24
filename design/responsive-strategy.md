# Jayam VPMS — Multi-Device Responsive Strategy

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved Responsive Architecture
- **Design System:** Aegis UI
- **Source Specification:** `06-page-map.md`, `08-ui-ux-requirements.md`

---

## 1. Responsive Viewport Definitions & Breakpoints

The responsive system is architected across three primary viewport tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DESKTOP (>= 1024px)                                                        │
│  • Fixed 260px Sidebar                                                      │
│  • 4-Column KPI Grid                                                        │
│  • Full Dense Data Tables with Fixed Action Columns                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  TABLET (768px - 1023px)                                                    │
│  • Collapsible / Overlay Sidebar                                            │
│  • 2-Column KPI Grid                                                        │
│  • Horizontal Scrolling Tables with Sticky Headers                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  MOBILE (< 768px)                                                           │
│  • Off-Canvas Slide-In Navigation Drawer                                    │
│  • 1-Column Stacked Metric Cards                                            │
│  • Responsive Data Card List (Table to Card Transformation)                 │
│  • Full-Width Stacked Form Controls with 44px Touch Targets                  │
│  • Bottom-Anchored Sheet Modals                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layout & Component Responsive Transformations

### 2.1 Navigation Shell

| Viewport | Navigation Architecture | User Interaction |
| :--- | :--- | :--- |
| **Desktop ($\ge 1024\text{px}$)** | Fixed persistent Left Sidebar ($260\text{px}$ width) | Always visible; main content offset with `ml-64`. |
| **Tablet ($768\text{px} - 1023\text{px}$)** | Icon-collapsed Sidebar ($72\text{px}$) or Hamburger toggle | Toggles slide-over with full labels; content spans full screen. |
| **Mobile ($< 768\text{px}$)** | Top Bar with Hamburger `[☰]` icon | Clicking `[☰]` animates a full-height slide-over drawer from left (`w-72`) with backdrop overlay (`bg-slate-900/60`). |

---

### 2.2 Metric KPI Summary Grids

```
Desktop (4 Columns):
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ Metric 1  │ │ Metric 2  │ │ Metric 3  │ │ Metric 4  │
└───────────┘ └───────────┘ └───────────┘ └───────────┘

Tablet (2 Columns):
┌─────────────────────────┐ ┌─────────────────────────┐
│ Metric 1                │ │ Metric 2                │
└─────────────────────────┘ └─────────────────────────┘
┌─────────────────────────┐ ┌─────────────────────────┐
│ Metric 3                │ │ Metric 4                │
└─────────────────────────┘ └─────────────────────────┘

Mobile (1 Column Stacked):
┌─────────────────────────────────────────────────────┐
│ Metric 1                                            │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Metric 2                                            │
└─────────────────────────────────────────────────────┘
```

- **Tailwind Grid Configuration:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6`.

---

### 2.3 Data Tables vs. Mobile Responsive Cards

On desktop screens, large dense tabular data is optimal for scanning. On mobile devices ($< 640\text{px}$), horizontal table scanning causes friction; tables automatically transform into touch-friendly **Data Cards**:

```
Desktop / Tablet View (Standard <table>):
┌────────────┬──────────────┬──────────────┬────────────┬──────────┬──────────┐
│ Pass ID    │ Visitor Name │ Host Name    │ Date / Time│ Status   │ Actions  │
├────────────┼──────────────┼──────────────┼────────────┼──────────┼──────────┤
│ #VP-1092   │ Jane Doe     │ David Chen   │ 10:30 AM   │ APPROVED │[Check-In]│
└────────────┴──────────────┴──────────────┴────────────┴──────────┴──────────┘

Mobile View (< 640px Card-Based Transformation):
┌─────────────────────────────────────────────────────┐
│ #VP-1092                    [ APPROVED Badge ]      │
│ Jane Doe (Acme Corp)                                │
│ Host: David Chen · Engineering                      │
│ Scheduled: Today, 10:30 AM                          │
│ Purpose: "Q3 Architecture Review"                   │
│ ─────────────────────────────────────────────────── │
│ [ 📋 View Details ]            [ ✓ Check In (Full) ]│
└─────────────────────────────────────────────────────┘
```

- **Implementation Strategy:**
  - Standard table container: `hidden sm:block overflow-x-auto rounded-xl border border-slate-200`.
  - Mobile card container: `sm:hidden space-y-3`.

---

### 2.4 Form Layouts & Touch Controls

```
Desktop (2-Column Grid):
┌─────────────────────────────┬─────────────────────────────┐
│ Full Name *                 │ Phone Number *              │
│ [ Jane Doe                ] │ [ +1 555 019 2834         ] │
├─────────────────────────────┼─────────────────────────────┤
│ Host Employee *             │ Visit Date *                │
│ [ David Chen            ▾ ] │ [ 2026-08-25              ] │
└─────────────────────────────┴─────────────────────────────┘

Mobile (Single-Column Full-Width Stack):
┌───────────────────────────────────────────────────────────┐
│ Full Name *                                               │
│ [ Jane Doe                                              ] │
│ Phone Number *                                            │
│ [ +1 555 019 2834                                       ] │
│ Host Employee *                                           │
│ [ David Chen                                          ▾ ] │
│ Visit Date *                                              │
│ [ 2026-08-25                                            ] │
└───────────────────────────────────────────────────────────┘
```

- **Touch Target Ergonomics:**
  - All button and form input heights are at least $44\text{px}$ (`h-11` on mobile) to eliminate touch mis-clicks.
  - Generous field spacing (`space-y-4`) prevents accidental taps on neighboring inputs.
  - Numeric keyboards triggered natively on mobile using `type="tel"` and `inputMode="numeric"`.

---

### 2.5 Modals & Bottom Sheets

- **Desktop & Tablet:** Centered modal dialog (`max-w-lg w-full rounded-2xl p-6 shadow-2xl`) with backdrop blur.
- **Mobile ($< 640\text{px}$):** Transitions to a **Bottom Sheet Drawer** anchored to the bottom edge (`fixed inset-x-0 bottom-0 rounded-t-2xl max-h-[90vh] overflow-y-auto p-5 animate-in slide-in-from-bottom duration-200`). This aligns with natural single-thumb ergonomic zones on smartphones.

---

## 3. Responsive Quality Checklist

1. [x] Zero horizontal scrolling on root document canvas across all devices ($320\text{px}$ to $2560\text{px}$).
2. [x] Touch target sizes strictly $\ge 44\times 44\text{px}$ on mobile screens.
3. [x] Font sizes maintained at $\ge 14\text{px}$ for inputs to prevent iOS automatic zoom on focus.
4. [x] Action buttons in tables/cards remain fully reachable and never truncate.
5. [x] Modals auto-scroll internally if content height exceeds mobile viewport height.
