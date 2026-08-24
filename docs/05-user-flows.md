# 05. User Flows & State Machines — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Overall Visitor Pass State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING_APPROVAL: Receptionist Registers Visit (Rules 1-5 checked)
    
    PENDING_APPROVAL --> APPROVED: Host Approves (Remarks recorded)
    PENDING_APPROVAL --> REJECTED: Host Rejects (Remarks recorded)
    PENDING_APPROVAL --> CANCELLED: Receptionist/Host Cancels (Rule 10)
    
    APPROVED --> CHECKED_IN: Receptionist Checks In (Rules 6, 7 & Timestamp recorded)
    APPROVED --> CANCELLED: Receptionist/Host Cancels (Rule 10)
    
    CHECKED_IN --> CHECKED_OUT: Receptionist Checks Out (Rule 8 & Timestamp recorded)
    
    REJECTED --> [*]
    CHECKED_OUT --> [*]
    CANCELLED --> [*]
```

---

## 2. Core User Flows

### Flow 1: Authentication & Role-Based Routing

```mermaid
flowchart TD
    A([User arrives at Application]) --> B{Has valid JWT token in storage?}
    B -->|Yes| C[Decode user role]
    B -->|No| D[Render /login page]
    
    D --> E[User enters Email & Password]
    E --> F[Submit to POST /api/auth/login]
    F --> G{Credentials valid & active?}
    G -->|No| H[Display inline error: 'Invalid credentials']
    G -->|Yes| I[Store JWT in storage & set Auth Context]
    
    I --> C
    C --> J{User Role?}
    J -->|ADMINISTRATOR| K[Redirect to /admin/dashboard]
    J -->|RECEPTIONIST| L[Redirect to /receptionist/dashboard]
    J -->|EMPLOYEE| M[Redirect to /employee/dashboard]
```

- **Goal:** Securely authenticate user and route them directly to their role-specific workspace.
- **Starting Point:** `/login` or application root `/`.
- **Decision Points:** Valid credentials? Active account status? Role identifier.
- **Success State:** User land on their designated dashboard with token persisted.
- **Failure State:** Toast/alert showing invalid credentials; login form resets password field.
- **Edge Cases:** Token expired mid-session (interceptor captures 401, clears storage, redirects to `/login` with flash message "Session expired").

---

### Flow 2: Visitor Registration Flow (Receptionist)

```mermaid
flowchart TD
    A([Receptionist on /receptionist/register]) --> B[Enters Visitor Details: Name, Phone, Email, Org]
    B --> C[Selects Host Employee from dropdown]
    C --> D[Selects Visit Date & Expected Arrival Time]
    D --> E[Enters Purpose of Visit]
    E --> F[Clicks 'Submit Registration']
    
    F --> G{Frontend Validation Passed?}
    G -->|No| H[Display field-level error messages]
    G -->|Yes| I[POST /api/visitors request dispatched]
    
    I --> J{Rule 3: Visit Date >= Today?}
    J -->|No| K[Error 400: 'Visit date cannot be in the past']
    J -->|Yes| L{Rule 4: If Today, Arrival Time >= Current Time?}
    
    L -->|No| M[Error 400: 'Expected arrival time cannot be earlier than current time']
    L -->|Yes| N{Rule 2: Duplicate registration for visitor on same date?}
    
    N -->|Yes| O[Error 400: 'Visitor already registered for this date']
    N -->|No| P{Rule 1: Visitor has an active visit?}
    
    P -->|Yes| Q[Error 400: 'Visitor already has an active ongoing visit']
    P -->|No| R{Rule 5: Target Employee has >= 3 pending requests?}
    
    R -->|Yes| S[Error 400: 'Selected employee has 3 pending requests awaiting review']
    R -->|No| T[Create Visit Pass in DB with status PENDING_APPROVAL]
    
    T --> U[Create Audit Log entry: CREATED]
    U --> V[Return 201 Created & Pass Summary]
    V --> W[Show Success Toast & Redirect to /receptionist/dashboard or show Pass Slip]
```

- **Goal:** Register a legitimate visitor without violating scheduling, concurrency, or host capacity rules.
- **Starting Point:** Receptionist clicks "Register Visitor" (`/receptionist/register`).
- **Decision Points:** Date $\ge$ Today; Time $\ge$ Now (if today); Duplicate on same date; Active visit exists; Host pending count $< 3$.
- **Success State:** Pass generated with `PENDING_APPROVAL` status; activity log created; receptionist sees success feedback.
- **Failure State:** Specific error toast returned for any breached business rule; form state preserved for easy correction.
- **Edge Cases:** Host employee is marked inactive while form was open (backend validates employee is active).

---

### Flow 3: Employee Review & Approval Flow

```mermaid
flowchart TD
    A([Employee logs into /employee/dashboard]) --> B[Views 'Pending Visitor Requests' table]
    B --> C[Clicks on a request to view details]
    C --> D{Employee Decision?}
    
    D -->|Approve| E[Clicks 'Approve' button]
    E --> F[Optional Remarks modal opens]
    F --> G[Enters remarks e.g. 'Approved, send to 3rd floor']
    G --> H[PUT /api/visitors/:id/status with action='APPROVE']
    H --> I[DB updates status to APPROVED]
    I --> J[Audit log entry: APPROVED with remarks]
    J --> K[Toast: 'Visit Approved'; row moves to Approved list]
    
    D -->|Reject| L[Clicks 'Reject' button]
    L --> M[Remarks modal opens - remarks required/recommended]
    M --> N[Enters reason e.g. 'Unavailable at this time']
    N --> O[PUT /api/visitors/:id/status with action='REJECT']
    O --> P[DB updates status to REJECTED]
    P --> Q[Audit log entry: REJECTED with remarks]
    Q --> R[Toast: 'Visit Rejected'; row removed from pending queue]
```

- **Goal:** Employee reviews pending requests and either approves or rejects with contextual remarks.
- **Starting Point:** `/employee/dashboard`.
- **Decision Points:** Approve or Reject; remarks entered.
- **Success State:** Request status updated; host's pending count decrements; activity log recorded.
- **Failure State:** Network failure or request already modified by admin/receptionist (error toast displayed, table refreshed).
- **Edge Cases:** Employee attempts to approve an already cancelled or rejected visit (backend blocks transition).

---

### Flow 4: Front-Desk Check-In & Check-Out Operations

```mermaid
flowchart TD
    A([Visitor arrives at Front Desk]) --> B[Receptionist searches visitor by Name/Phone/Pass ID]
    B --> C[Locates visit record]
    C --> D{Current Visit Status?}
    
    D -->|PENDING_APPROVAL| E[Action blocked: 'Cannot check in. Awaiting host approval']
    D -->|REJECTED| F[Action blocked: 'Cannot check in. Visit was rejected by host']
    D -->|CHECKED_IN| G[Check-In disabled; 'Check-Out' button is active]
    D -->|CHECKED_OUT| H[Actions disabled: 'Visit is already completed']
    D -->|CANCELLED| I[Actions disabled: 'Visit was cancelled']
    
    D -->|APPROVED| J[Receptionist clicks 'Check In']
    J --> K{Rule 7: Is visitor already checked in elsewhere?}
    K -->|Yes| L[Error: 'Visitor is currently checked in on another pass']
    K -->|No| M[PUT /api/visitors/:id/checkin]
    M --> N[Set checkInTime = NOW, status = CHECKED_IN]
    N --> O[Audit log entry: CHECKED_IN]
    O --> P[Toast: 'Visitor Checked In Successfully'; Live Occupancy +1]
    
    G --> Q[Visitor departs & approaches reception]
    Q --> R[Receptionist clicks 'Check Out']
    R --> S[PUT /api/visitors/:id/checkout]
    S --> T{Rule 8: checkOutTime > checkInTime?}
    T -->|No| U[Error: 'Check-out time must be after check-in time']
    T -->|Yes| V[Set checkOutTime = NOW, status = CHECKED_OUT]
    V --> W[Audit log entry: CHECKED_OUT]
    W --> X[Toast: 'Visitor Checked Out'; Live Occupancy -1]
```

- **Goal:** Accurately control physical access and record precise check-in and check-out timestamps.
- **Starting Point:** Receptionist Dashboard or Visitor List.
- **Decision Points:** Status must be `APPROVED` for check-in; Status must be `CHECKED_IN` for check-out; Timestamps logically consistent.
- **Success State:** Timestamps recorded; occupancy counter correctly increments/decrements.
- **Failure State:** Action denied with explicit business rule explanation.

---

### Flow 5: Search, Reports & Audit Log Inspection

```mermaid
flowchart TD
    A([Administrator / Receptionist on Visitor History]) --> B[Enters search query / applies filters]
    B --> C[Filters: Visitor Name, Host Name, Date Range, Status]
    C --> D[GET /api/visitors?search=...&status=...&date=...]
    D --> E[Table renders matching records with pagination]
    E --> F[User clicks 'View Audit History' on a record]
    F --> G[GET /api/visitors/:id/activities]
    G --> H[Modal renders chronological timeline of all actions with user & timestamp]
```

- **Goal:** Filter historical data and inspect complete audit trails.
- **Starting Point:** Visitor History or Reports page.
- **Decision Points:** Filter parameters selected.
- **Success State:** Dynamic list updates instantly; audit modal shows complete chronological timeline.
