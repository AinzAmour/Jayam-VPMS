# User Flow 01: Authentication, Role Routing & Session Lifecycle

## Document Control
- **Flow ID:** `UF-01`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-AUTH-01`, `FR-AUTH-02`, `05-user-flows.md`

---

## 1. Visual User Journey Diagram

```mermaid
flowchart TD
    Start([User opens Web Application]) --> CheckToken{JWT token exists in storage?}
    
    CheckToken -->|Yes| DecodeRole[Decode user payload & role]
    CheckToken -->|No| ShowLogin[Render /login page with Demo Switchers]
    
    ShowLogin --> UserAction{User Action?}
    UserAction -->|Click Demo Pill| FillDemo[Auto-populate role credentials]
    UserAction -->|Manual Input| EnterCreds[User enters Email & Password]
    
    FillDemo --> Submit[Click 'Sign In to Account']
    EnterCreds --> Submit
    
    Submit --> APIAuth[POST /api/auth/login]
    APIAuth --> ResAuth{Valid & Active?}
    
    ResAuth -->|No| ShowBanner[Display Red Error Banner: 'Invalid credentials']
    ShowBanner --> ShowLogin
    
    ResAuth -->|Yes| StoreToken[Store JWT & Init Auth Context]
    StoreToken --> DecodeRole
    
    DecodeRole --> RoleSwitch{User Role?}
    RoleSwitch -->|ADMINISTRATOR| RouteAdmin[Navigate to /admin/dashboard]
    RoleSwitch -->|RECEPTIONIST| RouteRecep[Navigate to /receptionist/dashboard]
    RoleSwitch -->|EMPLOYEE| RouteEmp[Navigate to /employee/dashboard]
```

---

## 2. Screen & UI State Transitions

1. **Unauthenticated Access:** Navigating directly to any internal URL (`/receptionist/register`, `/admin/users`) without a valid token immediately triggers a redirect to `/login` with an informational toast.
2. **Role Clearance Gate:** Attempting to navigate across roles (e.g. Employee visiting `/admin/dashboard`) renders the 403 Forbidden screen.
3. **Session Expiry (401 Interception):** When an API call returns `401 Unauthorized`, Axios interceptor purges `localStorage` and routes to `/login` with alert: `"Your session has expired. Please sign in again."`
