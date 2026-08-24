# 08. UI / UX Design & Interaction Requirements — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Information Architecture & Navigation

### 1.1 Structural Hierarchy
- **Top Bar:** Shows Application Title, Contextual Role Badge (`ADMIN`, `RECEPTIONIST`, `EMPLOYEE`), Current User Name, and Logout action.
- **Sidebar (Collapsible on Mobile):** Shows role-authorized destination links with active state indicator.
- **Breadcrumbs / Header:** Clear page titling with contextual action buttons (e.g. `+ Register Visitor`, `Export Report`).

### 1.2 Role Navigation Matrix

| Navigation Item | Administrator | Receptionist | Employee |
| :--- | :---: | :---: | :---: |
| **Dashboard** | `/admin/dashboard` | `/receptionist/dashboard` | `/employee/dashboard` |
| **Register Visitor** | ❌ *(or View)* | `/receptionist/register` | ❌ |
| **Visitor History / Search** | ❌ *(via Reports)* | `/receptionist/visitors` | `/employee/history` |
| **Manage Employees** | `/admin/employees` | ❌ | ❌ |
| **Manage User Accounts** | `/admin/users` | ❌ | ❌ |
| **Reports & Analytics** | `/admin/reports` | ❌ | ❌ |
| **Audit Logs** | `/admin/audit-logs` | ❌ | ❌ |

---

## 2. Interaction Patterns & Design System Tokens

### 2.1 Color Semantics & Badges
To guarantee instant situational awareness across busy front-desk environments, status badges follow strict semantic color tokens:

| Status Token | Background | Text Color | Border | Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `PENDING_APPROVAL` | Amber / `#FEF3C7` | Brown / `#92400E` | `#FDE68A` | Awaiting host employee decision |
| `APPROVED` | Emerald / `#D1FAE5` | Dark Green / `#065F46` | `#A7F3D0` | Approved by host; ready for Check-In |
| `CHECKED_IN` | Indigo / `#E0E7FF` | Deep Blue / `#3730A3` | `#C7D2FE` | Visitor is currently inside building |
| `CHECKED_OUT` | Slate / `#F1F5F9` | Charcoal / `#334155` | `#CBD5E1` | Visit completed and visitor exited |
| `REJECTED` | Rose / `#FFE4E6` | Dark Red / `#9F1239` | `#FECDD3` | Request rejected by host |
| `CANCELLED` | Gray / `#F3F4F6` | Dark Gray / `#4B5563` | `#E5E7EB` | Cancelled prior to check-in |

### 2.2 Button Hierarchy & Micro-Interactions
- **Primary Action (Brand Indigo/Blue):** "Sign In", "Submit Registration", "Confirm Check-In".
- **Success Action (Emerald Green):** "Approve Request".
- **Danger Action (Rose Red):** "Reject Request", "Cancel Visit", "Deactivate User".
- **Secondary Action (Neutral Outline):** "Back", "Close", "Reset Filters".
- **Hover & Focus States:** Smooth 150ms ease transitions, subtle elevation lift (`shadow-md`), and explicit 2px focus ring (`ring-2 ring-offset-2 ring-indigo-500`).

---

## 3. Forms & Real-Time Validation

### 3.1 Input Standards
- Explicit `<label>` elements linked to `<input id="...">`.
- Clear placeholder cues with format examples (e.g. `+1 555 019 2834`).
- Required fields clearly designated with an asterisk (`*`).
- Disabled input state with muted background and `cursor-not-allowed`.

### 3.2 Dynamic Validation & Immediate Feedback
- **Date Picker:** Enforce `min={today}` attribute in HTML5 date input to block past dates client-side (Rule 3).
- **Time Picker:** If selected date equals Today, dynamically validate that expected arrival time $\ge$ current local time (Rule 4).
- **Host Employee Dropdown:** Show real-time indicator of host capacity. If host has 3 pending requests, disable option or show badge `(3/3 Pending - Limit Reached)` to prevent submission failure (Rule 5).
- **Inline Field Errors:** Display concise red error text below the field immediately upon blur or failed submit.

---

## 4. UI Feedback, Feedback Loops & Modals

### 4.1 Toast Notifications
- Position: Top-Right floating container (`z-index: 9999`).
- Duration: 4 seconds auto-dismiss with manual close `[✕]` icon.
- Variants:
  - **Success (Green):** "Visitor #VP-1092 checked in successfully."
  - **Error (Red):** "Employee has reached the 3 pending requests limit."
  - **Warning (Yellow):** "Check-in blocked: Host has not approved this request."
  - **Info (Blue):** "Visitor list refreshed."

### 4.2 Modal Dialogs
- Backdrop overlay (`bg-black/50` with blur).
- Trap keyboard focus inside modal during open state.
- Pressing `Escape` or clicking backdrop dismisses non-destructive modals.
- Confirmation Modals for:
  - Approving with remarks
  - Rejecting with mandatory remarks
  - Checking in visitor
  - Checking out visitor
  - Cancelling a visit pass

---

## 5. State Handling: Loading, Empty & Error States

### 5.1 Loading States
- **Page / Table Loading:** Render Skeleton loaders matching the exact table column layout with a gentle pulsing gradient.
- **Button Actions:** Render a centered spinning indicator (`animate-spin`) while disabling repeated clicks to prevent double submissions.

### 5.2 Empty States
- Custom illustrated/icon empty states with helpful guidance:
  - *No Pending Requests:* "All caught up! You have no visitor requests waiting for approval."
  - *No Visitors Inside:* "No external visitors are currently inside the premises."
  - *No Search Results:* "No records matched your search query. Try clearing filters."

### 5.3 Error States
- Full-page error boundary for uncaught exceptions with "Reload Application" button.
- Component-level error banner with "Retry Request" trigger.

---

## 6. Accessibility & Keyboard Navigation (WCAG 2.1 AA)

1. **Color Contrast:** All text meets minimum 4.5:1 contrast ratio against backgrounds.
2. **Keyboard Navigation:**
   - Full keyboard accessibility across all interactive elements (`Tab`, `Shift+Tab`, `Enter`, `Space`).
   - Modal focus trapping using focus-lock.
   - Clear visual focus indicator (`ring-2 ring-indigo-500`).
3. **Screen Readers:**
   - ARIA labels (`aria-label="Approve visitor Jane Doe"`, `aria-live="polite"` for status changes).
   - Semantic HTML tags (`<nav>`, `<main>`, `<header>`, `<section>`, `<table>`, `<thead>`, `<tbody>`).

---

## 7. Responsive Layouts & Touch Interaction

- **Touch Target Sizes:** Minimum touch target size of $44 \times 44\text{ px}$ for buttons and inputs on mobile devices.
- **Responsive Tables:** Tables on mobile screens support horizontal scroll with sticky headers or transform into card-based list views.
- **Mobile Menu Drawer:** Smooth sliding animation with full viewport backdrop.
