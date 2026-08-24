# Jayam VPMS

Jayam VPMS is a full-stack Visitor Pass Management System designed to manage corporate visitor lifecycle operations. It provides role-based workflows for front desk receptionists to register and check in guests, host employees to approve or reject visit requests, and administrators to oversee workplace occupancy, manage staff directories, and review audit logs.

### 🌐 Live Deployment
- **Web Application (Frontend)**: [https://jayam-vpms-frontend.vercel.app](https://jayam-vpms-frontend.vercel.app)
- **API Server (Backend)**: [https://jayam-vpms-backend.onrender.com](https://jayam-vpms-backend.onrender.com)

---

## Features

- **Role-Based Portals**: Dedicated interfaces for Administrators, Receptionists, and Host Employees with protected routes.
- **Visitor Lifecycle Management**: End-to-end request, host approval, check-in, badge view, and checkout workflow.
- **Real-Time Validation**: Enforces visitor scheduling constraints, prevents duplicate same-day visits, and limits active visits per host.
- **Pass Badge Modal**: Printable visitor slip modal containing host info, visit schedule, and security details.
- **Staff Directory & User Management**: Administrative CRUD operations for employee records and system user accounts.
- **Audit & Analytics**: Complete activity logs tracking state transitions and analytical visitor reports with custom date filters.
- **Responsive Layout**: Desktop and mobile layouts with clean typography and slide-out navigation.

---

## Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Lucide React, Axios, Vite
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Helmet, Express Rate Limit
- **Database**: MongoDB (supports MongoDB Atlas, local MongoDB, or zero-config in-memory MongoDB fallback)
- **Testing**: Node.js Native Test Runner (`node --test`)

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/AinzAmour/Jayam-VPMS.git
cd Jayam-VPMS
```

### 2. Install dependencies
Install dependencies for root, server, and client:
```bash
# Root and workspaces
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configure environment variables
Create `.env` inside the `server/` directory:
```bash
cp server/.env.example server/.env
```

Set your configuration values (or keep defaults to use the in-memory database):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
# Optional: MONGODB_URI=mongodb://localhost:27017/jayam_vpms
```

### 4. Start the backend server
```bash
cd server
npm run dev
```
*(By default, the server auto-seeds sample demo data on first start if the database is empty).*

### 5. Start the frontend client
In a separate terminal:
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port for Express API server | `5000` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |
| `JWT_SECRET` | Secret key used for signing JSON Web Tokens | Required |
| `MONGODB_URI` | MongoDB connection URI (Atlas or local). If omitted, falls back to in-memory MongoDB | *Optional* |

---

## Demo Accounts

The database includes pre-configured demo accounts for local testing:

| Email | Password | Role | Description |
|---|---|---|---|
| `admin@jayam.com` | `Password123!` | `ADMINISTRATOR` | Full system access, staff CRUD, user provisioning & audit trail |
| `receptionist@jayam.com` | `Password123!` | `RECEPTIONIST` | Front desk visitor registration, check-in/out & pass badge view |
| `david.chen@jayam.com` | `Password123!` | `EMPLOYEE` | Host profile with pending visitor approvals & history |
| `ananya.sharma@jayam.com` | `Password123!` | `EMPLOYEE` | Host profile in HR department |

---

## Business Rules

The backend enforces the following business logic:

1. **Single Active Visit**: A visitor cannot have more than one active visit pass (`PENDING_APPROVAL`, `APPROVED`, or `CHECKED_IN`) at the same time.
2. **Same-Day Duplicate Prevention**: Duplicate registrations for the same visitor (by phone number) on the same date are rejected.
3. **Valid Visit Dates**: Visit dates cannot be scheduled in the past.
4. **Valid Arrival Times**: For same-day visits, expected arrival time cannot be earlier than current time.
5. **Host Request Limit**: An employee cannot have more than 3 pending visitor requests awaiting approval at any time.
6. **Approved Check-In Only**: Visitors can only be checked in once the host employee approves the request.
7. **No Re-Entry While Checked In**: A visitor currently checked in cannot be checked in again until checked out.
8. **Sequential Checkout**: Checkout time must strictly be later than check-in time.
9. **Rejected Passes Blocked**: Rejected visitor requests cannot be checked in.
10. **Active List Isolation**: Cancelled and rejected visits are excluded from active occupancy counts.

---

## Known Limitations

1. **Email / SMS Notifications**: Currently, visit approvals and pass generation are handled in-app; automated email/SMS alerts to hosts and visitors are not yet integrated.
2. **Photo ID Upload**: Visitor badges currently display system avatars rather than camera-captured ID photos.
3. **Self-Service Kiosk Flow**: The workflow currently requires a receptionist to create visitor passes; direct visitor self-registration via QR code is a planned future enhancement.

---

## Running Tests

Execute the backend business rule unit test suite:
```bash
npm test
```
To run the production build:
```bash
npm run build:client
```
