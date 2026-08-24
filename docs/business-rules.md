# Business Rules & Validation Logic

The application enforces ten core business rules validated on the backend API and reflected in the frontend UI.

---

## Business Rule Matrix

| Rule # | Rule Name | Description | Error Handling |
|---|---|---|---|
| **Rule 1** | Single Active Visit | A visitor cannot have more than one active visit (`PENDING_APPROVAL`, `APPROVED`, or `CHECKED_IN`) simultaneously. | Rejects registration with HTTP 400 (`RULE_1_ACTIVE_VISIT_EXISTS`). |
| **Rule 2** | No Same-Day Duplicate | Duplicate visitor registrations for the same visitor (identified by phone number) on the same date are prohibited. | Rejects registration with HTTP 400 (`RULE_2_DUPLICATE_REGISTRATION`). |
| **Rule 3** | Non-Past Visit Date | Visit date cannot be earlier than the current calendar date (`YYYY-MM-DD`). | Rejects registration with HTTP 400 (`RULE_3_PAST_DATE`). |
| **Rule 4** | Non-Past Arrival Time | For today's registrations, expected arrival time cannot be earlier than current system time (`HH:mm`). | Rejects registration with HTTP 400 (`RULE_4_PAST_TIME`). |
| **Rule 5** | Host Pending Request Limit | An employee host cannot have more than 3 pending visitor requests awaiting approval simultaneously. | Rejects registration with HTTP 400 (`RULE_5_MAX_PENDING_EXCEEDED`). |
| **Rule 6** | Check-In After Approval | Visitors can only be checked in after the host employee has approved the request (`APPROVED` status required). | Rejects check-in attempt with HTTP 400 (`RULE_6_NOT_APPROVED`). |
| **Rule 7** | No Double Check-In | A visitor who is already checked in cannot be checked in again on another pass until checked out. | Rejects check-in attempt with HTTP 400 (`RULE_7_ALREADY_CHECKED_IN`). |
| **Rule 8** | Sequential Checkout Time | Check-out timestamp must strictly be later than the visitor's check-in timestamp. | Rejects checkout attempt with HTTP 400 (`RULE_8_INVALID_CHECKOUT_TIME`). |
| **Rule 9** | No Check-In on Rejected | Rejected visitor requests (`REJECTED`) cannot be checked in. | Rejects check-in attempt with HTTP 400 (`RULE_9_REJECTED_PASS`). |
| **Rule 10** | Active List Filtering | Cancelled and rejected visits do not appear in active premises visitor lists. | Backend filters query scope to active statuses. |

---

## Pass Lifecycle State Machine

```text
[Registration Form]
       │
       ▼
PENDING_APPROVAL ──(Host Rejects)──► REJECTED
       │
 (Host Approves)
       ▼
   APPROVED ───────(Check-In)──────► CHECKED_IN
                                         │
                                   (Check-Out)
                                         ▼
                                    CHECKED_OUT
```
