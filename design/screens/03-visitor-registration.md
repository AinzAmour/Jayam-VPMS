# Screen Spec 03: Visitor Pass Registration (`/receptionist/register`)

## Document Control
- **Screen ID:** `SCR-03`
- **Route:** `/receptionist/register`
- **Permitted Roles:** `RECEPTIONIST`, `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-VIS-01`, Rules 1, 2, 3, 4, 5

---

## 1. Screen Purpose & User Goal
Enable the front-desk receptionist to register arriving or advance visitors, assign the visit to an active host employee, specify the visit schedule and purpose, and dispatch the request for host approval while enforcing **Business Rules 1 through 5**.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS    [🏢 HQ Lobby Desk]    [Role: RECEPTIONIST]  [👤 Sarah J ▾] │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ 📊 Dashboard     │ Register New Visitor Pass      [ ✕ Cancel & Return ]     │
│ ➕ Register Pass │ Create visitor pass and dispatch for host approval       │
│ 📋 Visitor Queue ├──────────────────────────────────────────────────────────┤
│ 🔍 Records       │ ┌──────────────────────────────────────────────────────┐ │
│                  │ │ 1. VISITOR INFORMATION                               │ │
│ ⚙️ Sign Out      │ │                                                      │ │
│                  │ │ Full Legal Name *             Mobile Phone Number *  │ │
│                  │ │ ┌───────────────────────────┐ ┌────────────────────┐ │ │
│                  │ │ │ Jane Doe                  │ │ +1 555 019 2834    │ │ │
│                  │ │ └───────────────────────────┘ └────────────────────┘ │ │
│                  │ │                                                      │ │
│                  │ │ Email Address (Optional)      Company / Organization*│ │
│                  │ │ ┌───────────────────────────┐ ┌────────────────────┐ │ │
│                  │ │ │ jane.doe@acme.corp        │ │ Acme Corporation   │ │ │
│                  │ │ └───────────────────────────┘ └────────────────────┘ │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 2. HOST EMPLOYEE & VISIT SCHEDULE                    │ │
│                  │ │                                                      │ │
│                  │ │ Host Employee *               Visit Date *           │ │
│                  │ │ ┌───────────────────────────┐ ┌────────────────────┐ │ │
│                  │ │ │ David Chen (Engineering)▾ │ │ 📅 2026-08-25      │ │ │
│                  │ │ └───────────────────────────┘ └────────────────────┘ │ │
│                  │ │ ℹ️ David has 1 / 3 pending   ℹ️ Min date is Today   │ │
│                  │ │                                                      │ │
│                  │ │ Expected Arrival Time *                              │ │
│                  │ │ ┌───────────────────────────┐                        │ │
│                  │ │ │ 🕒 10:30 AM               │                        │ │
│                  │ │ └───────────────────────────┘                        │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ 3. PURPOSE OF VISIT                                  │ │
│                  │ │ Stated Purpose *                                     │ │
│                  │ │ ┌──────────────────────────────────────────────────┐ │ │
│                  │ │ │ Q3 Vendor Architecture Review & Technical Deep   │ │ │
│                  │ │ │ Dive in Conference Room B                        │ │ │
│                  │ │ └──────────────────────────────────────────────────┘ │ │
│                  │ ├──────────────────────────────────────────────────────┤ │
│                  │ │ [ Reset Form ]           [ ✓ Create Visitor Pass (P) ] │
│                  │ └──────────────────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ [←] Register Visitor Pass               │
├─────────────────────────────────────────┤
│ 1. Visitor Details                      │
│                                         │
│ Full Legal Name *                       │
│ [ Jane Doe                            ] │
│                                         │
│ Mobile Phone Number *                   │
│ [ +1 555 019 2834                     ] │
│                                         │
│ Company / Organization *                │
│ [ Acme Corporation                    ] │
│                                         │
│ 2. Host & Schedule                      │
│                                         │
│ Host Employee *                         │
│ [ David Chen (Engineering)          ▾ ] │
│ ℹ️ 1 of 3 pending requests used         │
│                                         │
│ Visit Date *                            │
│ [ 📅 2026-08-25                       ] │
│                                         │
│ Expected Arrival Time *                 │
│ [ 🕒 10:30 AM                         ] │
│                                         │
│ 3. Purpose of Visit *                   │
│ [ Q3 Vendor Architecture Review...    ] │
│                                         │
│ ─────────────────────────────────────── │
│ [      ✓ Create Visitor Pass →        ] │
│ [ Cancel & Return to Lobby            ] │
└─────────────────────────────────────────┘
```

---

## 3. Form Fields, Validations & Business Rules Enforcement

| Form Field | Type / Control | Validation Rule | Business Rule Enforced |
| :--- | :--- | :--- | :--- |
| **`visitorName`** | Text Input | Required, min 2 chars | Basic identification |
| **`visitorPhone`**| Tel Input | Required, E.164 / standard phone format | **Rule 1 & Rule 2:** Used to check for active visits & same-day duplicates. |
| **`visitorCompany`**| Text Input | Required, min 2 chars | Organization attribution |
| **`hostEmployeeId`**| Select Dropdown | Required, active employee | **Rule 5:** Server & client check that host has $< 3$ pending requests. If $\ge 3$, disabled in dropdown. |
| **`visitDate`** | Date Input | Required, ISO `YYYY-MM-DD` | **Rule 3:** `min={currentDate}` prevents past dates. |
| **`expectedArrivalTime`**| Time Input | Required, `HH:mm` format | **Rule 4:** If `visitDate === Today`, arrival time must be $\ge$ current local time. |
| **`purpose`** | Textarea | Required, min 5 chars | Context for host approval |

---

## 4. Real-Time Feedback & Helper Callouts

1. **Host Capacity Badge:** When selecting an employee from the dropdown, an inline badge displays:
   - Green: `● David Chen (1 / 3 Pending Requests)`
   - Yellow: `● Alex Wong (2 / 3 Pending Requests)`
   - Red (Disabled): `✕ Sarah Connors (3 / 3 Limit Reached — Cannot select)` (Enforcing Rule 5).
2. **Duplicate Detection Alert:** If the receptionist types a phone number with an active pass scheduled for that date, a warning banner flashes: `"Visitor +15550192834 already has a pass scheduled on 2026-08-25 (Rule 2)"`.
3. **Submit Loading State:** Submit button disables, shows spinner, and updates text to `"Validating Business Rules & Dispatching..."`.
4. **Success State:** Displays green toast notification `"Visitor pass #VP-1092 created and dispatched to David Chen"` and routes back to `/receptionist/dashboard`.
