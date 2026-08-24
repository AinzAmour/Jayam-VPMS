# User Flow 03: Host Employee Request Review & Approvals

## Document Control
- **Flow ID:** `UF-03`
- **User Role:** `EMPLOYEE`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-VIS-02`, `05-user-flows.md`

---

## 1. Visual User Journey Diagram

```mermaid
flowchart TD
    Start([Employee opens /employee/dashboard]) --> ViewQueue[Views 'Pending Visitor Requests' list]
    ViewQueue --> SelectReq[Inspects Request: Visitor, Org, Date, Time, Purpose]
    SelectReq --> Decision{Host Decision?}
    
    Decision -->|Approve| OpenApproveModal[Opens 'Confirm Approval' Modal]
    OpenApproveModal --> EnterApproveRemarks[Enters optional host instructions]
    EnterApproveRemarks --> ConfirmApprove[Clicks 'Confirm Approval']
    ConfirmApprove --> APIApprove[PUT /api/visitors/:id/status action=APPROVE]
    APIApprove --> UpdateApproved[DB Status: APPROVED + remarks]
    UpdateApproved --> LogApprove[Activity Log: APPROVED]
    LogApprove --> ToastApprove[Toast: 'Visit Approved']
    ToastApprove --> MoveToConfirmed[Row moves to Today's Confirmed list]
    
    Decision -->|Reject| OpenRejectModal[Opens 'Reject Request' Modal]
    OpenRejectModal --> EnterRejectReason[Enters mandatory rejection reason]
    EnterRejectReason --> ValReason{Reason >= 5 chars?}
    ValReason -->|No| ShowRejectErr[Inline error: 'Rejection reason is mandatory']
    ValReason -->|Yes| ConfirmReject[Clicks 'Confirm Rejection']
    ConfirmReject --> APIReject[PUT /api/visitors/:id/status action=REJECT]
    APIReject --> UpdateRejected[DB Status: REJECTED + reason]
    UpdateRejected --> LogReject[Activity Log: REJECTED]
    LogReject --> ToastReject[Toast: 'Visit Request Rejected']
    ToastReject --> RemoveQueue[Row removed from Pending list]
```

---

## 2. Capacity & Real-Time Queue Updates
- Both Approval and Rejection immediately decrement the host employee's pending count, freeing up capacity for new visitor passes under Rule 5.
