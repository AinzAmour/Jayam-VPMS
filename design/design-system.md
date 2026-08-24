# Jayam VPMS — Visual Design System Specification

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved Design System Blueprint
- **Design System Name:** *Aegis UI (Workplace Security & Visitor Operations)*
- **Applicable Framework:** React.js 18 + Tailwind CSS 3.4+ / Vanilla CSS Tokens
- **Target Products:** Jayam Visitor Pass Management System (Desktop, Tablet, Mobile)

---

## 1. Brand Identity & Visual Direction

### 1.1 Brand Personality & Aesthetic Values
Jayam VPMS is an enterprise-grade physical security and visitor operations platform. Its visual language balances **military-grade security precision** with **frictionless corporate hospitality**:
- **Trustworthy & Authoritative:** High-contrast, clean lines, and unambiguous status indicators eliminate operational ambiguity for front-desk and security staff.
- **Operational Velocity:** Dense yet breathable data tables, rapid 1-click actions, keyboard-friendly navigation, and clear visual cues minimize lobby wait times.
- **Modern Executive Polish:** Sleek dark slate accents, rich indigo brand anchors, crisp typography, and refined micro-interactions convey premium corporate software quality.

### 1.2 Core Design Principles
1. **Status Clarity Above All:** Every visitor pass state (`PENDING`, `APPROVED`, `INSIDE`, `CHECKED_OUT`, `REJECTED`, `CANCELLED`) must be instantly distinguishable via unique semantic color tokens, badges, and icon glyphs.
2. **Contextual Action Availability:** Action triggers (Check-In, Check-Out, Approve, Reject) are visibly state-aware—disabled with helpful tooltips when prerequisites are not met (e.g. Check-In blocked when status is Pending).
3. **Zero Layout Shifts (CLS):** High-fidelity skeleton loaders mirror exact table and card geometries during async API operations.
4. **Accessible by Default:** Full WCAG 2.1 AA compliance, minimum 4.5:1 text contrast ratios, standard $44\text{px}$ minimum mobile touch targets, and visible focus rings.

---

## 2. Color Palette & Semantic Design Tokens

### 2.1 Primary & Brand Palette
The core brand identity uses deep corporate indigos paired with neutral slate surfaces.

| Token Name | Hex Code | Tailwind Class | Usage / Context |
| :--- | :--- | :--- | :--- |
| `color-brand-50` | `#EEF2FF` | `bg-indigo-50` | Subdued brand container backgrounds, active navigation highlights |
| `color-brand-100` | `#E0E7FF` | `bg-indigo-100` | Hover states on brand pills, subtle borders |
| `color-brand-500` | `#6366F1` | `bg-indigo-500` | Accent elements, focus rings, interactive toggles |
| `color-brand-600` | `#4F46E5` | `bg-indigo-600` | Primary interactive buttons, active sidebar links, key headers |
| `color-brand-700` | `#4338CA` | `bg-indigo-700` | Primary button hover state, prominent active elements |
| `color-brand-900` | `#312E81` | `bg-indigo-900` | Dark navigation brand headers, high-emphasis icons |

### 2.2 Neutral & Surface Palette (Slate)

| Token Name | Hex Code | Tailwind Class | Usage / Context |
| :--- | :--- | :--- | :--- |
| `color-surface-bg` | `#F8FAFC` | `bg-slate-50` | Global application canvas background |
| `color-surface-card`| `#FFFFFF` | `bg-white` | Content cards, modals, table surfaces, dropdown containers |
| `color-surface-muted`| `#F1F5F9` | `bg-slate-100` | Table headers, disabled input fills, secondary container fills |
| `color-border-subtle`| `#E2E8F0` | `border-slate-200` | Card borders, table dividers, input borders |
| `color-border-strong`| `#CBD5E1` | `border-slate-300` | Form input focus borders, active separators |
| `color-text-primary`| `#0F172A` | `text-slate-900` | Main headings, primary table cell text, card titles |
| `color-text-secondary`| `#475569` | `text-slate-600` | Subheadings, descriptive copy, table headers |
| `color-text-muted` | `#94A3B8` | `text-slate-400` | Placeholders, timestamps, breadcrumb dividers |

### 2.3 Semantic Status Tokens (Visitor Lifecycle)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    VISITOR PASS SEMANTIC STATUS TOKENS                     │
├────────────────────────────────────────────────────────────────────────────┤
│  [ PENDING_APPROVAL ]  Amber   · Bg: #FEF3C7 · Text: #92400E · Bd: #FDE68A │
│  [ APPROVED ]          Emerald · Bg: #D1FAE5 · Text: #065F46 · Bd: #A7F3D0 │
│  [ CHECKED_IN (INSIDE)]Indigo  · Bg: #E0E7FF · Text: #3730A3 · Bd: #C7D2FE │
│  [ CHECKED_OUT ]       Slate   · Bg: #F1F5F9 · Text: #334155 · Bd: #CBD5E1 │
│  [ REJECTED ]          Rose    · Bg: #FFE4E6 · Text: #9F1239 · Bd: #FECDD3 │
│  [ CANCELLED ]         Gray    · Bg: #F3F4F6 · Text: #4B5563 · Bd: #E5E7EB │
└────────────────────────────────────────────────────────────────────────────┘
```

| Lifecycle Status | Background | Text Color | Border Color | Meaning & Operational Context |
| :--- | :--- | :--- | :--- | :--- |
| `PENDING_APPROVAL` | `#FEF3C7` (`amber-100`) | `#92400E` (`amber-800`) | `#FDE68A` (`amber-200`) | Awaiting host employee approval (Rule 5 pending queue) |
| `APPROVED` | `#D1FAE5` (`emerald-100`) | `#065F46` (`emerald-800`) | `#A7F3D0` (`emerald-200`) | Host approved; visitor is cleared for front-desk Check-In |
| `CHECKED_IN` | `#E0E7FF` (`indigo-100`) | `#3730A3` (`indigo-800`) | `#C7D2FE` (`indigo-200`) | Visitor physically inside premises (Increments occupancy KPI) |
| `CHECKED_OUT` | `#F1F5F9` (`slate-100`) | `#334155` (`slate-700`) | `#CBD5E1` (`slate-300`) | Visit completed; guest exited premises |
| `REJECTED` | `#FFE4E6` (`rose-100`) | `#9F1239` (`rose-800`) | `#FECDD3` (`rose-200`) | Host denied access with explanatory remarks |
| `CANCELLED` | `#F3F4F6` (`gray-100`) | `#4B5563` (`gray-700`) | `#E5E7EB` (`gray-200`) | Cancelled before check-in; excluded from active queues (Rule 10)|

---

## 3. Typography & Hierarchy

### 3.1 Font Family Stack
- **Primary Body & UI Font:** `Inter`, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Monospace / Numerical Identifiers:** `JetBrains Mono`, "Fira Code", monospace (used for Pass IDs e.g. `VP-20260824-001` and Employee Codes `EMP-1001`).

### 3.2 Typographic Hierarchy Scale

| Level | Size (Rem / Px) | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `1.75rem` ($28\text{px}$) | Bold ($700$) | `2.25rem` ($36\text{px}$) | `-0.02em` | Auth headings, Executive KPI summary numbers |
| **Page Title / H2** | `1.50rem` ($24\text{px}$) | SemiBold ($600$) | `2.00rem` ($32\text{px}$) | `-0.01em` | Screen titles, Main section headers |
| **Card Title / H3** | `1.125rem` ($18\text{px}$) | SemiBold ($600$) | `1.75rem` ($28\text{px}$) | `0em` | Widget headers, Modal titles, Table group headers |
| **Section / H4** | `1.00rem` ($16\text{px}$) | Medium ($500$) | `1.50rem` ($24\text{px}$) | `0em` | Form section titles, Metric card labels |
| **Body (Default)** | `0.875rem` ($14\text{px}$) | Regular ($400$) | `1.25rem` ($20\text{px}$) | `0em` | Primary table data, Form inputs, Standard text |
| **Body Medium** | `0.875rem` ($14\text{px}$) | Medium ($500$) | `1.25rem` ($20\text{px}$) | `0em` | Table headers, Button labels, Navigation links |
| **Caption / Small** | `0.75rem` ($12\text{px}$) | Medium ($500$) | `1.00rem` ($16\text{px}$) | `+0.01em` | Badges, Timestamp subtext, Form helper text |
| **Micro Code** | `0.75rem` ($12\text{px}$) | SemiBold ($600$) | `1.00rem` ($16\text{px}$) | `+0.02em` | Pass IDs (`#VP-1092`), Status codes |

---

## 4. Spacing Scale & Elevation (Shadows)

### 4.1 Spatial Grid (4px / 8pt Scale)
- `space-1`: $4\text{px}$ (`0.25rem`) — Badge padding, icon gap
- `space-2`: $8\text{px}$ (`0.50rem`) — Input inline padding, button internal gap
- `space-3`: $12\text{px}$ (`0.75rem`) — Table cell vertical padding, card inner elements gap
- `space-4`: $16\text{px}$ (`1.00rem`) — Standard container padding, form field vertical margin
- `space-5`: $20\text{px}$ (`1.25rem`) — Card padding, modal internal header spacing
- `space-6`: $24\text{px}$ (`1.50rem`) — Main dashboard grid gap, screen margin
- `space-8`: $32\text{px}$ (`2.00rem`) — Large section dividers, auth card padding
- `space-12`: $48\text{px}$ (`3.00rem`) — Major layout separators

### 4.2 Elevation & Shadows
- **Flat Surface (`shadow-none`):** Standard table rows, inline form elements.
- **Low Elevation (`shadow-sm`):** Form inputs, secondary buttons (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`).
- **Card Elevation (`shadow`):** Metric cards, content containers (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`).
- **Interactive Hover (`shadow-md`):** Hovered cards, primary button active state (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`).
- **Modal / Overlay (`shadow-xl`):** Dialog overlays, popovers, dropdown menus (`box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1)`).

---

## 5. UI Component Library Specifications

### 5.1 Buttons
Buttons provide clear visual hierarchy and state feedback.

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Primary Button  │  │  Success Action  │  │  Danger Action   │  │ Secondary Button │
│  [ + Register ]  │  │  [ ✓ Approve ]   │  │  [ ✕ Reject ]    │  │  [ Cancel / Back]│
│  bg-indigo-600   │  │  bg-emerald-600  │  │  bg-rose-600     │  │  border-slate-300│
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

| Button Variant | Default Style | Hover Style | Active / Focus | Disabled Style |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm` | `bg-indigo-700` | `ring-2 ring-indigo-500 ring-offset-2` | `bg-indigo-300 text-white cursor-not-allowed` |
| **Success Action** | `bg-emerald-600 text-white font-medium px-3.5 py-1.5 rounded-lg` | `bg-emerald-700` | `ring-2 ring-emerald-500 ring-offset-2` | `bg-emerald-300 text-white cursor-not-allowed` |
| **Danger Action** | `bg-rose-600 text-white font-medium px-3.5 py-1.5 rounded-lg` | `bg-rose-700` | `ring-2 ring-rose-500 ring-offset-2` | `bg-rose-300 text-white cursor-not-allowed` |
| **Secondary / Ghost**| `bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg` | `bg-slate-50 border-slate-400` | `ring-2 ring-slate-400 ring-offset-2` | `opacity-50 cursor-not-allowed` |
| **1-Click Check-In** | `bg-emerald-50 border border-emerald-300 text-emerald-700 font-semibold px-3 py-1 rounded-md text-xs` | `bg-emerald-600 text-white` | `ring-2 ring-emerald-500` | `bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed` |
| **1-Click Check-Out**| `bg-indigo-50 border border-indigo-300 text-indigo-700 font-semibold px-3 py-1 rounded-md text-xs` | `bg-indigo-600 text-white` | `ring-2 ring-indigo-500` | `bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed` |

### 5.2 Form Inputs & Controls
- **Text / Phone / Email Input:**
  - Height: $40\text{px}$ (`h-10`), padding: $12\text{px}$ (`px-3 py-2`).
  - Border: `border border-slate-300 rounded-lg text-slate-900 bg-white placeholder-slate-400`.
  - Focus: `outline-none ring-2 ring-indigo-500 border-indigo-500`.
  - Error: `border-rose-500 text-rose-900 ring-2 ring-rose-200`.
- **Select Dropdown:**
  - Standardized custom arrow icon (`lucide:ChevronDown`).
  - Optgroup support for employee department groupings.
- **Date & Time Picker Inputs:**
  - Standard HTML5 inputs styled consistently with calendar/clock glyphs.
  - Min date constraint enforcement (`min="YYYY-MM-DD"`).

### 5.3 Metric Summary KPI Cards
- Structure: White surface card (`bg-white rounded-xl border border-slate-200 p-5 shadow-sm`).
- Layout: Icon container with semantic background (e.g. `bg-indigo-100 text-indigo-600 p-3 rounded-lg`) + Label (`text-xs font-medium text-slate-500 uppercase tracking-wider`) + Primary Value (`text-2xl font-bold text-slate-900 mt-1`) + Subtext / Trend badge (`text-xs text-slate-500 mt-1`).

```
┌────────────────────────────────────────┐
│ [Icon: Users]     TODAYS VISITORS      │
│                   24 Passes            │
│                   +12% vs yesterday    │
└────────────────────────────────────────┘
```

### 5.4 Data Tables
- Header: `bg-slate-50 text-slate-600 uppercase text-xs font-semibold px-4 py-3 border-b border-slate-200 tracking-wider`.
- Row: `border-b border-slate-100 hover:bg-slate-50/80 transition-colors duration-150`.
- Cell: `px-4 py-3.5 text-sm text-slate-700 align-middle`.
- Sticky Action Column: Action buttons right-aligned with fixed width to prevent overflow clutter.

### 5.5 Status Badges & Pills
- Inline pill container: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border`.
- Contains a $6\text{px}$ solid dot colored to match the badge text for instant accessibility.

### 5.6 Modals & Confirmation Dialogs
- Backdrop: `fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4`.
- Dialog Container: `bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150`.
- Header: `px-6 py-4 border-b border-slate-100 flex items-center justify-between`.
- Body: `p-6 space-y-4 text-sm text-slate-600`.
- Footer: `px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3`.

### 5.7 Toast Notifications
- Floating container: `fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none`.
- Toast Card: `pointer-events-auto bg-white rounded-xl shadow-lg border p-4 flex items-start gap-3 animate-in slide-in-from-top-4 duration-200`.
  - **Success:** `border-emerald-200 text-emerald-900`, Icon: `CheckCircle2` (`text-emerald-600`).
  - **Error:** `border-rose-200 text-rose-900`, Icon: `AlertCircle` (`text-rose-600`).
  - **Warning:** `border-amber-200 text-amber-900`, Icon: `AlertTriangle` (`text-amber-600`).
  - **Info:** `border-indigo-200 text-indigo-900`, Icon: `Info` (`text-indigo-600`).

---

## 6. Responsive Breakpoints

| Breakpoint | Prefix | Width Range | Layout Rules |
| :--- | :--- | :--- | :--- |
| **Mobile** | `<sm` | $< 640\text{px}$ | 1-column KPI grid, hamburger navigation drawer, full-width inputs, responsive card view for tables, bottom-docked action modals. |
| **Tablet** | `md` | $640\text{px} - 1023\text{px}$ | 2-column KPI grid, collapsible sidebar, horizontal scrollable data tables, wrapped filter bars. |
| **Desktop** | `lg` | $1024\text{px} - 1279\text{px}$| Fixed $260\text{px}$ sidebar, 4-column KPI grid, full data tables with sticky headers. |
| **Wide Screen** | `xl` | $\ge 1280\text{px}$ | Max-width container ($1440\text{px}$) with comfortable gutter spacing and high-density dashboard layouts. |
