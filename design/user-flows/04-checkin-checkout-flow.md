# User Flow 04: Front-Desk Check-In & Check-Out Operations

## Document Control
- **Flow ID:** `UF-04`
- **User Role:** `RECEPTIONIST`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-VIS-03`, `FR-VIS-04`, Rules 6, 7, 8, 9

---

## 1. Visual User Journey Diagram

```mermaid
flowchart TD
    GuestArrives([Visitor arrives at Lobby Desk]) --> RecepSearch[Receptionist locates record on /receptionist/dashboard]
    RecepSearch --> CheckStatus{Current Pass Status?}
    
    CheckStatus -->|PENDING_APPROVAL| BlockPending[Check-In Disabled: 'Awaiting host approval']
    CheckStatus -->|REJECTED| BlockRejected[Check-In Disabled: 'Request rejected by host']
    CheckStatus -->|CANCELLED| BlockCancelled[Check-In Disabled: 'Pass cancelled']
    CheckStatus -->|CHECKED_OUT| BlockCompleted[Check-In Disabled: 'Visit completed']
    
    CheckStatus -->|APPROVED| ClickCheckIn[Receptionist clicks 'Check In']
    ClickCheckIn --> Rule7Check{Is visitor already checked in elsewhere?}
    Rule7Check -->|Yes| E7[Toast: 'Visitor is already checked in on another pass']
    Rule7Check -->|No| APICheckIn[PUT /api/visitors/:id/checkin]
    APICheckIn --> UpdateInside[Status -> CHECKED_IN, checkInTime -> NOW]
    UpdateInside --> LogCheckIn[Activity Log: CHECKED_IN]
    LogCheckIn --> IncOccupancy[Occupancy KPI Increments +1]
    IncOccupancy --> ToastCheckIn[Toast: 'Visitor Checked In Successfully']
    
    UpdateInside --> GuestDeparts([Visitor finishes meeting & returns to desk])
    GuestDeparts --> ClickCheckOut[Receptionist clicks 'Check Out']
    ClickCheckOut --> APICheckOut[PUT /api/visitors/:id/checkout]
    APICheckOut --> Rule8Check{checkOutTime > checkInTime?}
    Rule8Check -->|No| E8[Toast: 'Check-out time must be after check-in time']
    Rule8Check -->|Yes| UpdateCompleted[Status -> CHECKED_OUT, checkOutTime -> NOW]
    UpdateCompleted --> LogCheckOut[Activity Log: CHECKED_OUT]
    LogCheckOut --> DecOccupancy[Occupancy KPI Decrements -1]
    DecOccupancy --> ToastCheckOut[Toast: 'Visitor Checked Out. Visit Complete']
```

---

## 2. Real-Time Occupancy Impact
- Every successful Check-In immediately increments the live workplace occupancy count.
- Every successful Check-Out immediately decrements the live occupancy count and archives the pass into historical records.
