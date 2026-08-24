# 16. Acceptance Criteria (Given-When-Then) — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Authentication & Role-Based Navigation

### Scenario 1.1: Successful User Login
```gherkin
Given a registered active user with email "sarah.reception@jayam.com" and role "RECEPTIONIST"
When the user submits valid credentials on the "/login" page
Then the system authenticates the user and generates a signed JWT token
And stores the token in client storage
And redirects the user to "/receptionist/dashboard"
And displays navigation links specific to the Receptionist role.
```

### Scenario 1.2: Unauthorized Route Protection
```gherkin
Given an authenticated user logged in with the "EMPLOYEE" role
When the user attempts to directly navigate to "/admin/users" or "/admin/reports"
Then the system blocks access and renders a "403 Access Denied" page or redirects to "/employee/dashboard"
And no administrative data is requested or exposed.
```

---

## 2. Visitor Registration & Business Rules (Rules 1–5)

### Scenario 2.1: Valid Visitor Registration
```gherkin
Given an authenticated Receptionist on the "/receptionist/register" page
And the selected host employee currently has 1 pending request (less than 3)
And the visitor has no active visits and no existing visit scheduled for "2026-08-26"
When the Receptionist submits the form with valid details (Name, Phone, Host, Date "2026-08-26", Time "10:30 AM", Purpose)
Then the system creates a new VisitPass record with status "PENDING_APPROVAL"
And records an ActivityLog entry with action "CREATED"
And displays a success toast notification
And redirects to the Receptionist queue.
```

### Scenario 2.2: Duplicate Registration on Same Date (Rule 2)
```gherkin
Given a visitor with phone number "+15550192834" already has a visit pass on "2026-08-26"
When the Receptionist attempts to submit another registration for "+15550192834" on "2026-08-26"
Then the system rejects the submission with HTTP 400 Bad Request
And displays the error message: "Duplicate visitor registration for this visitor on the same date is not allowed."
And no new record is created.
```

### Scenario 2.3: Active Visit Concurrency Check (Rule 1)
```gherkin
Given a visitor with phone number "+15550192834" currently has an ongoing visit in "CHECKED_IN" status
When the Receptionist attempts to register a new visit for "+15550192834"
Then the system rejects the submission with HTTP 400 Bad Request
And displays the error message: "Visitor already has an active visit."
```

### Scenario 2.4: Past Date Validation (Rule 3)
```gherkin
Given today's date is "2026-08-24"
When the Receptionist inputs a visit date of "2026-08-20"
Then the system displays an inline validation error: "Visit date cannot be earlier than the current date"
And prevents form submission.
```

### Scenario 2.5: Past Arrival Time for Today's Visit (Rule 4)
```gherkin
Given today's date is "2026-08-24" and the current local time is "15:00"
When the Receptionist sets the visit date to "2026-08-24" and expected arrival time to "14:00"
Then the system displays an inline validation error: "Expected arrival time cannot be earlier than current time"
And prevents form submission.
```

### Scenario 2.6: Host Employee Pending Request Limit (Rule 5)
```gherkin
Given Host Employee "David Chen" already has 3 visitor requests with status "PENDING_APPROVAL"
When the Receptionist attempts to register a 4th visitor pass assigned to "David Chen"
Then the system rejects the request with HTTP 400 Bad Request
And displays the error message: "Selected employee cannot have more than 3 pending visitor requests awaiting approval."
```

---

## 3. Employee Approval Workflow

### Scenario 3.1: Host Approves Visitor Request
```gherkin
Given an authenticated Employee "David Chen" viewing his pending queue on "/employee/dashboard"
And a visitor pass #VP-1092 is in "PENDING_APPROVAL" status assigned to him
When David clicks "Approve", enters remarks "Approved for Lab 2", and clicks "Confirm"
Then the system updates the pass status to "APPROVED"
And stores hostRemarks "Approved for Lab 2"
And creates an ActivityLog entry with action "APPROVED" and remarks
And removes the pass from the pending approval list
And increments David's approved count.
```

### Scenario 3.2: Host Rejects Visitor Request
```gherkin
Given an authenticated Employee viewing a pending visitor request
When the Employee clicks "Reject", enters mandatory rejection remarks "Unavailable due to off-site travel", and confirms
Then the system updates the pass status to "REJECTED"
And stores the rejection remarks
And creates an ActivityLog entry with action "REJECTED"
And the pass is marked non-admissible.
```

---

## 4. Front-Desk Check-In & Check-Out Desk (Rules 6–9)

### Scenario 4.1: Check-In of Approved Visitor (Rule 6)
```gherkin
Given a visitor pass #VP-1092 with status "APPROVED"
When the Receptionist clicks "Check In"
Then the system updates status to "CHECKED_IN"
And records "checkInTime" as the current timestamp
And creates an ActivityLog entry with action "CHECKED_IN"
And increments the "Visitors Currently Inside" counter by 1.
```

### Scenario 4.2: Blocked Check-In on Pending or Rejected Pass (Rules 6 & 9)
```gherkin
Given a visitor pass with status "PENDING_APPROVAL" or "REJECTED"
When the Receptionist views the lobby queue
Then the "Check In" button is visibly disabled with a tooltip indicating host approval is required
And if an API call is made directly to "/api/visitors/:id/checkin", the server responds with HTTP 400 Bad Request.
```

### Scenario 4.3: Prevent Double Check-In (Rule 7)
```gherkin
Given a visitor pass currently in "CHECKED_IN" status
When a check-in request is received for this visitor
Then the system rejects the request with HTTP 400 Bad Request: "Visitor is already checked in."
```

### Scenario 4.4: Successful Check-Out (Rule 8)
```gherkin
Given a visitor pass currently in "CHECKED_IN" status with checkInTime recorded
When the Receptionist clicks "Check Out"
Then the system verifies the current timestamp is later than checkInTime
And updates status to "CHECKED_OUT"
And records "checkOutTime" as the current timestamp
And creates an ActivityLog entry with action "CHECKED_OUT"
And decrements the "Visitors Currently Inside" counter by 1.
```

---

## 5. Visit Cancellation (Rule 10)

### Scenario 5.1: Cancel Visit Before Check-In
```gherkin
Given a visitor pass in "PENDING_APPROVAL" or "APPROVED" status
When the Receptionist or Host clicks "Cancel Visit" and provides a cancellation reason
Then the system updates the pass status to "CANCELLED"
And stores the cancellation reason
And records an ActivityLog entry with action "CANCELLED"
And excludes the pass from active visitor queues.
```

---

## 6. Search, Reports & Audit Trail

### Scenario 6.1: Search and Filter Passes
```gherkin
Given multiple visitor records in the database
When a user enters a search term "Jane" and selects status "CHECKED_IN"
Then the table dynamically updates to display only records where the visitor name contains "Jane" AND status is "CHECKED_IN".
```

### Scenario 6.2: Summary Reports by Date Range
```gherkin
Given an Administrator on "/admin/reports"
When the Administrator selects the "This Week" filter preset
Then the system aggregates all visits within the current week
And displays accurate counts for Total Visitors, Approved, Rejected, and Completed
And renders a daily breakdown table.
```

### Scenario 6.3: Immutable Activity History Inspection
```gherkin
Given a visitor pass that has progressed through CREATED -> APPROVED -> CHECKED_IN -> CHECKED_OUT
When an authorized user opens the Activity History modal for this pass
Then the modal displays all 4 chronological events with exact timestamps, user names, roles, and remarks.
```
