# 10. REST API Specification — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Base URL:** `/api`
- **Protocol:** HTTP/1.1 or HTTP/2 over TLS (HTTPS)
- **Data Format:** `application/json`
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Authentication & Session Endpoints

### 1.1 `POST /api/auth/login`
- **Purpose:** Authenticate user credentials and return a signed JWT.
- **Auth:** Public.
- **Request Body:**
```json
{
  "email": "sarah.reception@jayam.com",
  "password": "Password123!"
}
```
- **Validation:** `email` (valid email format, required), `password` (string, required).
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "66c8fb1234567890abcdef01",
      "email": "sarah.reception@jayam.com",
      "fullName": "Sarah Jenkins",
      "role": "RECEPTIONIST",
      "employeeRef": null
    }
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Missing fields or invalid format.
  - `401 Unauthorized`: Invalid email or password.
  - `403 Forbidden`: Account is deactivated (`isActive: false`).

### 1.2 `GET /api/auth/me`
- **Purpose:** Get currently authenticated user profile from token.
- **Auth:** Required (All Roles).
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "66c8fb1234567890abcdef01",
    "email": "sarah.reception@jayam.com",
    "fullName": "Sarah Jenkins",
    "role": "RECEPTIONIST"
  }
}
```
- **Error Responses:** `401 Unauthorized` (expired or invalid token).

---

## 2. Visitor Pass Management Endpoints

### 2.1 `POST /api/visitors` (Register Visitor)
- **Purpose:** Register a new visitor pass request. Enforces Business Rules 1, 2, 3, 4, and 5.
- **Auth:** Required. Role: `RECEPTIONIST` or `ADMINISTRATOR`.
- **Request Body:**
```json
{
  "visitorName": "Jane Doe",
  "visitorPhone": "+15550192834",
  "visitorEmail": "jane.doe@acme.corp",
  "visitorCompany": "Acme Corporation",
  "hostEmployeeId": "66c8fa0987654321fedcba99",
  "visitDate": "2026-08-25",
  "expectedArrivalTime": "10:30",
  "purpose": "Vendor quarterly architecture sync"
}
```
- **Business Rule Validations:**
  - **Rule 1:** Fails with `400` if visitor has another active visit (`PENDING_APPROVAL`, `APPROVED`, `CHECKED_IN`).
  - **Rule 2:** Fails with `400` if visitor has an existing visit on the same `visitDate`.
  - **Rule 3:** Fails with `400` if `visitDate < Today`.
  - **Rule 4:** Fails with `400` if `visitDate == Today` and `expectedArrivalTime < CurrentTime`.
  - **Rule 5:** Fails with `400` if host employee has $\ge 3$ requests in `PENDING_APPROVAL` status.
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Visitor pass registered successfully and awaiting host approval",
  "data": {
    "_id": "66c8fc2233445566aabbccdd",
    "passId": "VP-20260825-001",
    "visitorName": "Jane Doe",
    "visitorPhone": "+15550192834",
    "visitorCompany": "Acme Corporation",
    "hostEmployee": {
      "id": "66c8fa0987654321fedcba99",
      "fullName": "David Chen",
      "department": "Engineering"
    },
    "visitDate": "2026-08-25T00:00:00.000Z",
    "expectedArrivalTime": "10:30",
    "purpose": "Vendor quarterly architecture sync",
    "status": "PENDING_APPROVAL",
    "createdAt": "2026-08-24T16:00:00.000Z"
  }
}
```

### 2.2 `GET /api/visitors` (Search & Filter Passes)
- **Purpose:** Search and filter visitor records.
- **Auth:** Required. All Roles (Scoped: Employee sees only their visits unless Admin/Receptionist).
- **Query Parameters:**
  - `search`: string (matches visitorName or visitorPhone)
  - `hostName`: string (matches employee name)
  - `status`: enum (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`)
  - `date`: `YYYY-MM-DD`
  - `startDate`: `YYYY-MM-DD`
  - `endDate`: `YYYY-MM-DD`
  - `page`: integer (default: 1)
  - `limit`: integer (default: 15)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "records": [ /* Array of VisitPass objects */ ],
    "pagination": {
      "totalRecords": 45,
      "currentPage": 1,
      "totalPages": 3,
      "limit": 15
    }
  }
}
```

### 2.3 `GET /api/visitors/today-queue`
- **Purpose:** Fast queue for receptionist showing today's expected and inside visitors.
- **Auth:** Required (`RECEPTIONIST`, `ADMINISTRATOR`).
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalToday": 18,
    "insideCount": 5,
    "scheduledCount": 10,
    "pendingApprovalCount": 3,
    "queue": [ /* List of today's visit pass objects */ ]
  }
}
```

### 2.4 `PUT /api/visitors/:id/status` (Employee Approve/Reject)
- **Purpose:** Host employee approves or rejects a pending visitor request.
- **Auth:** Required. Role: `EMPLOYEE` (or `ADMINISTRATOR`).
- **Request Body:**
```json
{
  "action": "APPROVE", // or "REJECT"
  "remarks": "Approved. Please ask visitor to wait at Lobby B."
}
```
- **Validation:**
  - Current status must be `PENDING_APPROVAL`.
  - If action is `REJECT`, `remarks` is required.
  - Verifies that `req.user.employeeRef == visit.hostEmployeeId` (or user is `ADMINISTRATOR`).
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Visitor request APPROVED successfully",
  "data": {
    "id": "66c8fc2233445566aabbccdd",
    "status": "APPROVED",
    "hostRemarks": "Approved. Please ask visitor to wait at Lobby B."
  }
}
```

### 2.5 `PUT /api/visitors/:id/checkin` (Check In Visitor)
- **Purpose:** Receptionist marks visitor as physically checked in.
- **Auth:** Required. Role: `RECEPTIONIST` or `ADMINISTRATOR`.
- **Business Rule Validations:**
  - **Rule 6 & Rule 9:** Visit status must be strictly `APPROVED`. If `PENDING_APPROVAL` or `REJECTED`, returns `400 Bad Request`.
  - **Rule 7:** Fails with `400` if visitor is already checked in on another active pass.
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Visitor checked in successfully",
  "data": {
    "id": "66c8fc2233445566aabbccdd",
    "status": "CHECKED_IN",
    "checkInTime": "2026-08-25T10:32:15.000Z"
  }
}
```

### 2.6 `PUT /api/visitors/:id/checkout` (Check Out Visitor)
- **Purpose:** Receptionist marks visitor as physically checked out.
- **Auth:** Required. Role: `RECEPTIONIST` or `ADMINISTRATOR`.
- **Business Rule Validations:**
  - Current status must be `CHECKED_IN`.
  - **Rule 8:** `checkOutTime` must be greater than `checkInTime`.
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Visitor checked out successfully",
  "data": {
    "id": "66c8fc2233445566aabbccdd",
    "status": "CHECKED_OUT",
    "checkOutTime": "2026-08-25T11:45:00.000Z"
  }
}
```

### 2.7 `PUT /api/visitors/:id/cancel` (Cancel Visit)
- **Purpose:** Cancel a visit before check-in.
- **Auth:** Required (`RECEPTIONIST`, `EMPLOYEE`, `ADMINISTRATOR`).
- **Validation:**
  - Can only cancel if status is `PENDING_APPROVAL` or `APPROVED`.
  - **Rule 10:** Cancelled visits are excluded from active queues.
- **Request Body:**
```json
{
  "reason": "Meeting rescheduled by client"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Visit cancelled successfully",
  "data": {
    "id": "66c8fc2233445566aabbccdd",
    "status": "CANCELLED",
    "cancellationReason": "Meeting rescheduled by client"
  }
}
```

---

## 3. Employee & User Management Endpoints (Admin)

### 3.1 `GET /api/employees`
- **Auth:** `ADMINISTRATOR`, `RECEPTIONIST` (Active list only).
- **Query Params:** `activeOnly=true|false`, `search=...`
- **Success Response (`200 OK`):** Returns array of employee objects.

### 3.2 `POST /api/employees`
- **Auth:** `ADMINISTRATOR`.
- **Request Body:** `{ employeeCode, fullName, email, phone, department, designation }`.
- **Success Response (`201 Created`):** Returns created employee record.

### 3.3 `PUT /api/employees/:id`
- **Auth:** `ADMINISTRATOR`.
- **Request Body:** Partial update fields + `isActive`.

### 3.4 `GET /api/users` & `POST /api/users`
- **Auth:** `ADMINISTRATOR`.
- **Purpose:** Provision logins, link with employee record, and assign roles.

---

## 4. Reports & Activity History Endpoints

### 4.1 `GET /api/reports/summary`
- **Auth:** `ADMINISTRATOR`.
- **Query Params:** `filter=today|this_week|custom`, `startDate`, `endDate`.
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalVisitors": 142,
    "statusBreakdown": {
      "approved": 128,
      "rejected": 14,
      "checkedOut": 121,
      "cancelled": 7
    },
    "currentInside": 5,
    "topDepartments": [
      { "department": "Engineering", "count": 68 },
      { "department": "Sales", "count": 35 }
    ]
  }
}
```

### 4.2 `GET /api/activities` (System-Wide Audit Logs)
- **Auth:** `ADMINISTRATOR`.
- **Query Params:** `action`, `startDate`, `endDate`, `page`, `limit`.
- **Success Response (`200 OK`):** Returns paginated activity log records.

### 4.3 `GET /api/visitors/:id/activities` (Per-Pass Timeline)
- **Auth:** All Roles (Scoped).
- **Success Response (`200 OK`):** Returns chronological array of lifecycle events for the specific pass.
