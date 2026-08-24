# Jayam VPMS — Screen Inventory & State Coverage Matrix

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved Screen Inventory
- **Design System:** Aegis UI
- **Source Specification:** `06-page-map.md`, `07-wireframe-spec.md`

---

## 1. Master Screen Inventory

| Screen ID | Screen Name | Route / Path | Target Role | MVP Status | Desktop Layout Archetype | Mobile Layout Archetype | Specification Doc |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **`SCR-01`** | **Sign In & Demo Auth** | `/login` | Public / All | `MUST HAVE` | Centered floating card with demo switchers | Full-width single-column stacked card | [`01-authentication.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/01-authentication.md) |
| **`SCR-02`** | **Receptionist Lobby Desk** | `/receptionist/dashboard` | `RECEPTIONIST` | `MUST HAVE` | 4-card KPI grid + Active queue table with 1-click check-in/out | 1-col stacked KPI cards + Touch-friendly Data Card queue | [`02-receptionist-dashboard.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/02-receptionist-dashboard.md) |
| **`SCR-03`** | **Visitor Pass Registration**| `/receptionist/register` | `RECEPTIONIST` | `MUST HAVE` | Multi-section 2-column form with live rule hints | Single-column stacked form with sticky bottom action bar | [`03-visitor-registration.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/03-visitor-registration.md) |
| **`SCR-04`** | **Receptionist Visitor Records**| `/receptionist/visitors` | `RECEPTIONIST` | `MUST HAVE` | Multi-criteria search bar + full data table with status filters | Inline filter pills + searchable mobile card list | [`04-receptionist-visitor-history.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/04-receptionist-visitor-history.md) |
| **`SCR-05`** | **Employee Host Portal** | `/employee/dashboard` | `EMPLOYEE` | `MUST HAVE` | 2-card host KPI + Pending requests queue with Approve/Reject | Stacked cards + prominent Approve/Reject action triggers | [`05-employee-dashboard.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/05-employee-dashboard.md) |
| **`SCR-06`** | **Employee Hosting History** | `/employee/history` | `EMPLOYEE` | `MUST HAVE` | Filterable table of past guests hosted by user | Chronological visit history cards with remarks preview | [`06-employee-history.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/06-employee-history.md) |
| **`SCR-07`** | **Administrator Dashboard** | `/admin/dashboard` | `ADMINISTRATOR` | `MUST HAVE` | 4-card occupancy & staff KPIs + live activity feed | Stacked KPI cards + compact audit list | [`07-admin-dashboard.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/07-admin-dashboard.md) |
| **`SCR-08`** | **Employee Directory CRUD** | `/admin/employees` | `ADMINISTRATOR` | `MUST HAVE` | Staff directory table + Add/Edit Employee modal | Searchable staff card list with action menus | [`08-admin-employee-management.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/08-admin-employee-management.md) |
| **`SCR-09`** | **User Accounts & RBAC CRUD**| `/admin/users` | `ADMINISTRATOR` | `MUST HAVE` | User accounts table + Create/Edit User modal | User cards with role badges and status toggles | [`09-admin-user-management.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/09-admin-user-management.md) |
| **`SCR-10`** | **Visitor Reports & Stats** | `/admin/reports` | `ADMINISTRATOR` | `MUST HAVE` | Date filter pills (Today/Week/Custom) + Summary KPIs + Table | Wrapped filter pills + stacked summary cards + export | [`10-admin-reports.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/10-admin-reports.md) |
| **`SCR-11`** | **System Audit Trail** | `/admin/audit-logs` | `ADMINISTRATOR` | `MUST HAVE` | Filterable immutable audit table with action badges | Audit log list with expandable change details drawer | [`11-admin-audit-logs.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/11-admin-audit-logs.md) |
| **`SCR-12`** | **Modals & Action Overlays** | Overlays | All Roles | `MUST HAVE` | Centered dialogs with backdrop blur | Bottom-anchored sliding sheet modals | [`12-modals-and-overlays.md`](file:///c:/Users/AinZ/Documents/Side_Quests/Jayam%20FrontEnd/design/screens/12-modals-and-overlays.md) |

---

## 2. Interactive States Coverage Matrix

| Screen ID | Default | Loading (Skeleton / Spin) | Empty State | Error / Toast | Validation Feedback | Success Feedback |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`SCR-01` (Login)** | ✅ | ✅ (Button spinner) | N/A | ✅ (Banner alert) | ✅ (Email/Pass inline) | ✅ (Redirect) |
| **`SCR-02` (Reception)**| ✅ | ✅ (Table & KPI skeleton) | ✅ ("No visitors today") | ✅ (Toast notification) | ✅ (Rule guards) | ✅ (CheckIn/Out toast) |
| **`SCR-03` (Register)** | ✅ | ✅ (Form submitting) | N/A | ✅ (Rule breach toasts) | ✅ (Rules 1-5 inline) | ✅ (Created toast + redirect) |
| **`SCR-04` (Visitors)** | ✅ | ✅ (Table skeleton) | ✅ ("No matches found") | ✅ (Fetch error retry) | N/A | ✅ (Cancel toast) |
| **`SCR-05` (Employee)** | ✅ | ✅ (Queue skeleton) | ✅ ("All caught up!") | ✅ (Action error toast) | ✅ (Remarks required on reject) | ✅ (Approve/Reject toast) |
| **`SCR-06` (Emp History)**| ✅ | ✅ (Table skeleton) | ✅ ("No past visits") | ✅ (Fetch error retry) | N/A | N/A |
| **`SCR-07` (Admin Dash)** | ✅ | ✅ (KPI skeletons) | ✅ ("No activity today") | ✅ (Retry trigger) | N/A | N/A |
| **`SCR-08` (Employees)**| ✅ | ✅ (Table skeleton) | ✅ ("No staff found") | ✅ (CRUD error toasts) | ✅ (Code/Email unique) | ✅ (Created/Updated toast) |
| **`SCR-09` (Users)** | ✅ | ✅ (Table skeleton) | ✅ ("No users found") | ✅ (CRUD error toasts) | ✅ (Password complexity)| ✅ (Account saved toast) |
| **`SCR-10` (Reports)** | ✅ | ✅ (Chart/Table skeleton) | ✅ ("No data in range") | ✅ (Date range error) | ✅ (Start $\le$ End date) | ✅ (Report generated) |
| **`SCR-11` (Audit Logs)**| ✅ | ✅ (Log table skeleton) | ✅ ("No logs found") | ✅ (Fetch error retry) | N/A | N/A |
| **`SCR-12` (Modals)** | ✅ | ✅ (Modal action spin) | N/A | ✅ (Inline modal error) | ✅ (Remarks validation) | ✅ (Action confirmation) |
