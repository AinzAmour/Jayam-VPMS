# Jayam VPMS — Frontend Developer Handoff Specification

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved Developer Handoff Specification
- **Target Stack:** React.js 18 (Vite) + Tailwind CSS 3.4+ + Axios + React Router v6
- **Design System:** Aegis UI

---

## 1. Global Setup & Tailwind Configuration

### 1.1 `tailwind.config.js` Token Extensions
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
```

---

## 2. Reusable Component Contracts & Props

### 2.1 `<StatusBadge status={status} />`
- **Props:**
  - `status`: `'PENDING_APPROVAL' | 'APPROVED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'REJECTED' | 'CANCELLED'`
- **Render Output:** Standardized pill with dot indicator and semantic color tokens.

### 2.2 `<MetricCard title={title} value={value} icon={icon} trend={trend} />`
- **Props:**
  - `title`: `string`
  - `value`: `string | number`
  - `icon`: `LucideIcon`
  - `trend?`: `string` (e.g. `"+12% today"`)
  - `highlightColor?`: `'indigo' | 'emerald' | 'amber' | 'rose'`

### 2.3 `<Modal isOpen={isOpen} onClose={onClose} title={title}>`
- **Props:**
  - `isOpen`: `boolean`
  - `onClose`: `() => void`
  - `title`: `string`
  - `children`: `ReactNode`
- **Features:** Focus lock, backdrop blur, `Escape` key close listener, transition animation.

---

## 3. Client-Side Business Rules Validation Utility (`src/utils/businessRules.js`)

Frontend forms must validate Rules 1 through 5 prior to dispatch:

```javascript
export function validateVisitorForm(formData, hostEmployee, activeVisits) {
  const errors = {};
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toTimeString().slice(0, 5);

  // Rule 3: Visit date cannot be earlier than current date
  if (formData.visitDate < todayStr) {
    errors.visitDate = "Visit date cannot be earlier than the current date (Rule 3)";
  }

  // Rule 4: For today's visit, expected arrival cannot be earlier than current time
  if (formData.visitDate === todayStr && formData.expectedArrivalTime < nowTimeStr) {
    errors.expectedArrivalTime = "Expected arrival time cannot be earlier than current time (Rule 4)";
  }

  // Rule 5: Host employee cannot have >= 3 pending requests
  if (hostEmployee && hostEmployee.pendingRequestsCount >= 3) {
    errors.hostEmployeeId = "Selected employee has reached the maximum limit of 3 pending requests (Rule 5)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

---

## 4. API Service Integration Matrix (Axios)

All API calls are encapsulated within `src/services/`:

| API Service Method | HTTP Request | Associated Screen / Component |
| :--- | :--- | :--- |
| `authService.login(email, password)` | `POST /api/auth/login` | `SCR-01` (Login) |
| `authService.getProfile()` | `GET /api/auth/me` | `AuthContext` initialization |
| `visitorService.getTodayQueue()` | `GET /api/visitors/today-queue` | `SCR-02` (Receptionist Dashboard) |
| `visitorService.registerVisitor(data)`| `POST /api/visitors` | `SCR-03` (Visitor Registration) |
| `visitorService.getVisitors(params)` | `GET /api/visitors` | `SCR-04` (Visitor Records) |
| `visitorService.updateStatus(id, action, remarks)` | `PUT /api/visitors/:id/status` | `SCR-05` (Employee Host Portal) |
| `visitorService.checkIn(id)` | `PUT /api/visitors/:id/checkin` | `SCR-02` (Check-In Desk) |
| `visitorService.checkOut(id)` | `PUT /api/visitors/:id/checkout` | `SCR-02` (Check-Out Desk) |
| `visitorService.cancelVisit(id, reason)`| `PUT /api/visitors/:id/cancel` | `SCR-04` (Visitor Records) |
| `reportService.getSummary(filter, start, end)` | `GET /api/reports/summary` | `SCR-10` (Admin Reports) |
| `auditService.getActivities(params)`| `GET /api/activities` | `SCR-11` (Admin Audit Logs) |
| `auditService.getPassActivities(id)`| `GET /api/visitors/:id/activities` | `SCR-12` (Timeline Drawer) |
| `employeeService.getEmployees()` | `GET /api/employees` | `SCR-08` (Employee Management) |
| `userService.getUsers()` | `GET /api/users` | `SCR-09` (User Management) |
