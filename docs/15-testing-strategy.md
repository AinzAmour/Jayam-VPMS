# 15. Comprehensive Testing Strategy & Test Scenarios — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Multi-Tier Testing Pyramid

```
                ▲
               / \
              /   \
             / E2E \       End-to-End User Journeys (Lifecycle Verification)
            /-------\
           /  Integ  \     API Endpoint & DB Integration Tests (Supertest)
          /-----------\
         /    Unit     \   Business Rules & Utility Logic Tests
        /---------------\
```

---

## 2. Business Rules Test Scenarios (Mandatory Rules 1 to 10)

| Rule ID | Rule Statement | Test Scenario & Input | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **`TC-BR-01`** | **Rule 1:** A visitor cannot have more than one active visit at the same time. | 1. Register visitor with phone `+15550192834` (Status: `PENDING_APPROVAL`).<br>2. Attempt to register another pass for `+15550192834`. | Second request rejected with HTTP `400 Bad Request` ("Visitor already has an active ongoing visit"). |
| **`TC-BR-02`** | **Rule 2:** Duplicate visitor registrations for same visitor on same date not allowed. | 1. Register visitor for date `2026-08-26`.<br>2. Attempt to register same phone for `2026-08-26`. | Second request rejected with HTTP `400 Bad Request` ("Duplicate visit registration on same date"). |
| **`TC-BR-03`** | **Rule 3:** Visit date cannot be earlier than current date. | Register visitor with `visitDate: 2026-08-20` (when today is `2026-08-24`). | Rejected with HTTP `400 Bad Request` ("Visit date cannot be in the past"). |
| **`TC-BR-04`** | **Rule 4:** For today's registrations, expected arrival time cannot be earlier than current time. | If local time is `14:30`, attempt to submit registration for today with `expectedArrivalTime: 13:00`. | Rejected with HTTP `400 Bad Request` ("Expected arrival time cannot be earlier than current time"). |
| **`TC-BR-05`** | **Rule 5:** An employee cannot have $> 3$ pending visitor requests. | 1. Employee A has 3 visits with status `PENDING_APPROVAL`.<br>2. Attempt to register 4th visit targeting Employee A. | Rejected with HTTP `400 Bad Request` ("Employee has reached the limit of 3 pending requests"). |
| **`TC-BR-06`** | **Rule 6:** Visitors can only be checked in after approval. | Attempt to call `PUT /api/visitors/:id/checkin` on a pass with status `PENDING_APPROVAL`. | Rejected with HTTP `400 Bad Request` ("Cannot check in: Pass is pending approval"). |
| **`TC-BR-07`** | **Rule 7:** A visitor already checked in cannot be checked in again until checked out. | Attempt to call `PUT /api/visitors/:id/checkin` on a pass with status `CHECKED_IN`. | Rejected with HTTP `400 Bad Request` ("Visitor is already checked in"). |
| **`TC-BR-08`** | **Rule 8:** Check-out time must always be later than check-in time. | Manually send check-out request with timestamp earlier than `checkInTime`. | Database pre-save hook throws validation error; API returns HTTP `400 Bad Request`. |
| **`TC-BR-09`** | **Rule 9:** Rejected visitor requests cannot be checked in. | Attempt to call `PUT /api/visitors/:id/checkin` on a pass with status `REJECTED`. | Rejected with HTTP `400 Bad Request` ("Cannot check in a rejected visitor request"). |
| **`TC-BR-10`** | **Rule 10:** Cancelled visits should not appear in active visitor lists. | 1. Cancel a visit (`PUT /api/visitors/:id/cancel`).<br>2. Query `GET /api/visitors/today-queue`. | Cancelled record is excluded from active queue. |

---

## 3. Role-Based Access Control (RBAC) Test Scenarios

| Test ID | User Role | Action Attempted | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **`TC-RBAC-01`** | Unauthenticated | `GET /api/visitors` without token | HTTP `401 Unauthorized` |
| **`TC-RBAC-02`** | `EMPLOYEE` | Access `/admin/users` or `GET /api/users` | HTTP `403 Forbidden` |
| **`TC-RBAC-03`** | `RECEPTIONIST` | Access `/admin/reports` or `POST /api/employees` | HTTP `403 Forbidden` |
| **`TC-RBAC-04`** | `EMPLOYEE` | Approve visit assigned to *different* employee | HTTP `403 Forbidden` ("Unauthorized to review this request") |
| **`TC-RBAC-05`** | `ADMINISTRATOR` | Full access across all endpoints | HTTP `200` / `201` Success |

---

## 4. End-to-End User Journey Test Scenarios

### 4.1 Scenario: Complete Happy Path Lifecycle
1. **Receptionist Log In:** Log in at `/login` with receptionist credentials.
2. **Registration:** Submit new visitor pass for tomorrow (`2026-08-25 10:00 AM`) targeting Employee David Chen.
   - *Verify:* Pass created with ID `VP-...` and status `PENDING_APPROVAL`.
3. **Employee Notification & Review:** Log in as Employee David Chen.
   - *Verify:* New request appears in Pending queue.
   - *Action:* Click Approve, input remarks `"Approved for Conference Room 1"`, and confirm.
   - *Verify:* Status updates to `APPROVED`.
4. **Physical Check-In:** Log in as Receptionist on the visit date.
   - *Action:* Locate approved pass in lobby queue, click **[Check In]**.
   - *Verify:* Status becomes `CHECKED_IN`, `checkInTime` recorded, "Visitors Inside" count increments.
5. **Physical Check-Out:**
   - *Action:* Click **[Check Out]**.
   - *Verify:* Status becomes `CHECKED_OUT`, `checkOutTime` recorded, "Visitors Inside" decrements.
6. **Audit Trail Verification:** Log in as Admin and inspect Activity History for this pass.
   - *Verify:* 4 sequential log entries present: `CREATED` $\to$ `APPROVED` $\to$ `CHECKED_IN` $\to$ `CHECKED_OUT`.

---

## 5. UI, Responsive & Edge Case Testing

1. **Responsive Viewport Checks:**
   - Mobile ($375\text{px}$, $414\text{px}$): Sidebar collapses into hamburger drawer; tables scroll or display as responsive cards.
   - Tablet ($768\text{px}$, $1024\text{px}$): 2-column metric cards; filters wrap gracefully.
   - Desktop ($1440\text{px}$): Full 4-column KPI grid and expanded data tables.
2. **Empty State Validation:**
   - Verify empty tables display clear graphic placeholders and helpful messaging (e.g. "No pending requests").
3. **Loading State Verification:**
   - Verify skeleton loaders trigger on API fetches, preventing layout shifts (CLS).
4. **Error Toast Verification:**
   - Disconnect network or trigger validation failure $\to$ verify non-intrusive red toast notification appears for 4 seconds.
