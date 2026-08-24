# User Flow 02: Visitor Registration & Business Rules Enforcement

## Document Control
- **Flow ID:** `UF-02`
- **User Role:** `RECEPTIONIST`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-VIS-01`, Rules 1, 2, 3, 4, 5

---

## 1. Visual User Journey Diagram

```mermaid
flowchart TD
    Start([Receptionist on /receptionist/register]) --> InputInfo[Enters Name, Phone, Email, Company]
    InputInfo --> SelectHost[Selects Host Employee from active roster]
    SelectHost --> SelectDate[Selects Visit Date & Expected Time]
    SelectDate --> EnterPurpose[Enters Visit Purpose]
    EnterPurpose --> ClickSubmit[Clicks 'Create Visitor Pass']
    
    ClickSubmit --> ClientVal{Client Validation}
    ClientVal -->|Fails| ShowFieldErrors[Show red inline input errors]
    
    ClientVal -->|Passes| ServerReq[POST /api/visitors]
    
    ServerReq --> R3{Rule 3: Date >= Today?}
    R3 -->|No| E3[Toast: 'Visit date cannot be in the past']
    
    R3 -->|Yes| R4{Rule 4: If Today, Time >= Now?}
    R4 -->|No| E4[Toast: 'Expected arrival cannot be earlier than current time']
    
    R4 -->|Yes| R2{Rule 2: Duplicate on same date?}
    R2 -->|Yes| E2[Toast: 'Visitor already registered for this date']
    
    R2 -->|No| R1{Rule 1: Visitor has active visit?}
    R1 -->|Yes| E1[Toast: 'Visitor has another active visit ongoing']
    
    R1 -->|No| R5{Rule 5: Host has >= 3 pending?}
    R5 -->|Yes| E5[Toast: 'Selected host has reached 3 pending requests limit']
    
    R5 -->|No| CreatePass[Create DB Pass: PENDING_APPROVAL]
    CreatePass --> LogCreated[Activity Log: CREATED]
    LogCreated --> SuccessToast[Toast: 'Visitor pass created & dispatched']
    SuccessToast --> RedirectQueue[Redirect to /receptionist/dashboard]
```

---

## 2. Decision Points & Error Recovery

- **Rule 5 Breach Recovery:** If the selected host has 3 pending requests, the form highlights the host field and suggests alternative staff or requests the employee clear their queue.
- **Rule 2/1 Duplicate Breach Recovery:** If an active pass exists, the system provides a link to view the existing pass in `/receptionist/visitors`.
