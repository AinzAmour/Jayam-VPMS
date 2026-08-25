# Jayam VPMS

Jayam VPMS is a full-stack Visitor Pass Management System designed to manage corporate visitor lifecycle operations. It provides role-based workflows for front desk receptionists to register and check in guests, host employees to approve or reject visit requests, and administrators to oversee workplace occupancy, manage staff directories, and review audit logs.

### 🌐 Live Deployment
- **Web Application (Frontend)**: [https://jayam-vpms-frontend.vercel.app](https://jayam-vpms-frontend.vercel.app)
- **API Server (Backend)**: [https://jayam-vpms-backend.onrender.com](https://jayam-vpms-backend.onrender.com)

> ⏳ **Note on Initial Backend Latency (Render Free Tier)**:  
> The backend is hosted on Render's free tier. As noted by Render: *"Your free instance will spin down with inactivity, which can delay requests by 50 seconds or more."*  
> If the live application takes a short while to log in or respond on initial visit, please allow ~50 seconds for the backend instance to spin back up.

---

## Features

- **Role-Based Portals**: Dedicated interfaces for Administrators, Receptionists, and Host Employees with protected routes.
- **Visitor Lifecycle Management**: End-to-end request, host approval, check-in, badge view, and checkout workflow.
- **Real-Time Validation**: Enforces visitor scheduling constraints, prevents duplicate same-day visits, and limits active visits per host.
- **Pass Badge Modal**: Printable visitor slip modal containing host info, visit schedule, and security details.
- **Staff Directory & User Management**: Administrative CRUD operations for employee records and system user accounts.
- **Audit & Analytics**: Complete activity logs tracking state transitions and analytical visitor reports with custom date filters.
- **Command Palette (Spotlight Search)**: Fast keyboard navigation (`Ctrl+K` / `Cmd+K`) for switching portals, searching actions, and shortcuts.
- **Responsive Layout**: Fluid design scaled for phones, tablets, laptops, and ultra-wide displays.

---

## Tech Stack & Libraries Used

### 🖥️ Frontend (Client)
| Package / Library | Version | Purpose & Description |
|---|---|---|
| **[React](https://react.dev/)** | `^18.3.1` | Core declarative UI library for building component-based user interfaces. |
| **[React DOM](https://react.dev/)** | `^18.3.1` | DOM renderer for React web applications. |
| **[React Router DOM](https://reactrouter.com/)** | `^6.26.1` | Client-side routing, protected route wrappers, and navigation guards. |
| **[Vite](https://vitejs.dev/)** | `^5.4.2` | Fast build tool and development server with Hot Module Replacement (HMR). |
| **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** | `^4.3.1` | Babel/Fast Refresh plugin for React in Vite. |
| **[Tailwind CSS](https://tailwindcss.com/)** | `^3.4.10` | Utility-first CSS framework for responsive, theme-consistent UI styling. |
| **[PostCSS](https://postcss.org/)** & **[Autoprefixer](https://github.com/postcss/autoprefixer)** | `^8.4.41` / `^10.4.20` | CSS transformations and automatic vendor prefixing. |
| **[Framer Motion](https://www.framer.com/motion/)** | `^13.1.1` | Motion library for micro-interactions, stateful button feedback, and modal animations. |
| **[Lucide React](https://lucide.dev/)** | `^0.436.0` | Comprehensive icon library for UI icons, badge states, and action triggers. |
| **[React CMDK](https://github.com/alexpate/react-cmdk)** | `^1.3.9` | Keyboard-first command palette component (`Cmd+K` / `Ctrl+K`) for quick navigation. |
| **[Axios](https://axios-http.com/)** | `^1.7.5` | Promise-based HTTP client with request/response interceptors for JWT token handling. |
| **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** | `^2.1.1` / `^2.5.2` | Utility for conditionally constructing and conflict-free merging of Tailwind classes. |

### ⚙️ Backend (Server)
| Package / Library | Version | Purpose & Description |
|---|---|---|
| **[Node.js](https://nodejs.org/)** | `>=18.0.0` | Server-side JavaScript runtime environment. |
| **[Express.js](https://expressjs.com/)** | `^4.19.2` | RESTful API framework managing routes, controller logic, and HTTP middleware. |
| **[Mongoose](https://mongoosejs.com/)** | `^8.5.2` | MongoDB Object Data Modeling (ODM) with validation schemas, indexing, and hooks. |
| **[JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)** | `^9.0.2` | Stateless authentication tokens signed with HMAC SHA256 for secure session validation. |
| **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)** | `^2.4.3` | One-way password hashing with salt generation to securely store user credentials. |
| **[Helmet](https://helmetjs.github.io/)** | `^7.1.0` | Security middleware setting secure HTTP response headers (XSS, Clickjacking, MIME sniffing). |
| **[Express Rate Limit](https://express-rate-limit.github.io/)** | `^7.4.0` | Rate-limiting middleware for brute-force protection and API endpoint abuse prevention. |
| **[CORS](https://github.com/expressjs/cors)** | `^2.8.5` | Middleware for configuring Cross-Origin Resource Sharing policies with frontend domains. |
| **[Dotenv](https://github.com/motdotla/dotenv)** | `^16.4.5` | Environment variable loader from `.env` files into `process.env`. |
| **[mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)** | `^9.4.0` | In-memory MongoDB instance for zero-config local development and isolated test execution. |

### 🧪 Testing
| Tool | Description |
|---|---|
| **Node.js Native Test Runner (`node:test`)** | Built-in test runner executing asynchronous business logic and security unit tests. |
| **Node.js Strict Assertions (`node:assert/strict`)** | Assertion library for verifying HTTP contracts, rejection codes, and DB constraints. |

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/AinzAmour/Jayam-VPMS.git
cd Jayam-VPMS
```

### 2. Install dependencies
Install dependencies for root, server, and client:
```bash
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

Set your configuration values (or keep defaults to use the zero-config in-memory database):
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

All accounts use the default password: **`Password123!`** (also available via 1-click quick-fill buttons on the login page):

| Email | Role | Department | Description |
|---|---|---|---|
| `admin@jayam.com` | `ADMINISTRATOR` | Management | Full system access, staff CRUD, user provisioning & audit trail |
| `receptionist@jayam.com` | `RECEPTIONIST` | Front Desk | Visitor registration, approval checks, badge view, check-in/out |
| `receptionist2@jayam.com` | `RECEPTIONIST` | Front Desk | Secondary receptionist portal account |
| `david.chen@jayam.com` | `EMPLOYEE` | Engineering | Lead Software Architect (Host with pending approvals) |
| `ananya.sharma@jayam.com` | `EMPLOYEE` | Human Resources | Talent Acquisition Lead |
| `marcus.vance@jayam.com` | `EMPLOYEE` | Product Management | VP of Product |
| `priya.patel@jayam.com` | `EMPLOYEE` | Operations | Head of Facilities |
| `alexander.wright@jayam.com` | `EMPLOYEE` | Engineering | Principal Cloud Architect |
| `samantha.cruz@jayam.com` | `EMPLOYEE` | Finance | Chief Financial Controller |
| `rajesh.varma@jayam.com` | `EMPLOYEE` | Information Security | Director of Cyber Defense |
| `elena.morales@jayam.com` | `EMPLOYEE` | Marketing | Global Brand Director |
| `jordan.lee@jayam.com` | `EMPLOYEE` | Design | Lead UX Strategist |
| `michael.thorne@jayam.com` | `EMPLOYEE` | Legal & Compliance | General Counsel |
| `claire.dubois@jayam.com` | `EMPLOYEE` | Customer Success | Enterprise Operations Lead |
| `nathan.scott@jayam.com` | `EMPLOYEE` | Engineering | Senior DevOps Engineer |

---

## Business Rules

The backend enforces the following business logic rules:

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

## Running Tests & Production Build

Execute the backend business rule unit test suite:
```bash
npm test
```

To run the production build:
```bash
npm run build:client
```
