# 18. Pre-Launch & Submission Verification Checklist — VPMS

## Document Control
- **Document Version:** 1.0.0
- **Status:** Approved for Discovery / Pre-Development
- **Source Specification:** `React Interview Task V5.0.md`

---

## 1. Product & Business Logic Checklist

- [ ] **Role-Based Authentication:**
  - [ ] Login screen authenticates Admin, Receptionist, Employee accounts.
  - [ ] Invalid passwords display concise error feedback.
  - [ ] Role-based redirect to respective dashboards upon login.
  - [ ] Unauthenticated requests to protected pages blocked and redirected.
- [ ] **Business Rules Verification (Rules 1–10):**
  - [ ] **Rule 1:** Blocked multiple active visits for the same visitor.
  - [ ] **Rule 2:** Blocked duplicate registrations on the same date for the same visitor.
  - [ ] **Rule 3:** Blocked visit dates earlier than current date.
  - [ ] **Rule 4:** Blocked expected arrival times earlier than current time for today's visits.
  - [ ] **Rule 5:** Enforced maximum 3 pending requests per host employee.
  - [ ] **Rule 6:** Check-in strictly blocked until visitor is approved.
  - [ ] **Rule 7:** Blocked double check-in for visitors already inside.
  - [ ] **Rule 8:** Enforced check-out timestamp is strictly later than check-in timestamp.
  - [ ] **Rule 9:** Blocked check-in for rejected visitor requests.
  - [ ] **Rule 10:** Cancelled visits excluded from active queues and lists.
- [ ] **Role Dashboards:**
  - [ ] Admin dashboard displays live premises occupancy and aggregate metrics.
  - [ ] Receptionist dashboard displays today's queue and quick check-in/out triggers.
  - [ ] Employee dashboard displays pending approval cards and hosted visitor list.
- [ ] **Search & Reports:**
  - [ ] Search by Visitor Name, Host Employee, Date, and Status functions accurately.
  - [ ] Summary reports filterable by Today, This Week, and Custom Date Range.
- [ ] **Audit Trail & Activity Log:**
  - [ ] Every status change (Created, Approved, Rejected, Checked In, Checked Out, Cancelled) creates an immutable audit record with timestamp and user.

---

## 2. Security & Application Hardening Checklist

- [ ] **JWT & Session Security:**
  - [ ] Tokens signed with strong `JWT_SECRET` from environment variables.
  - [ ] Expired tokens gracefully redirect user to login.
  - [ ] Passwords hashed with `bcryptjs` (salt rounds $\ge 10$).
  - [ ] Passwords excluded from user query API responses (`select: false`).
- [ ] **API & Backend Protection:**
  - [ ] Role clearance verified on all sensitive routes.
  - [ ] Host ownership verified when approving/rejecting requests.
  - [ ] CORS middleware configured with explicit client origin whitelist.
  - [ ] Helmet middleware configured for HTTP security headers.
  - [ ] Rate limiting attached to `/api/auth/login`.

---

## 3. UI / UX & Responsiveness Checklist

- [ ] **Responsive Viewports:**
  - [ ] Desktop ($1280\text{px}+$): Multi-column layouts and expanded tables.
  - [ ] Tablet ($768\text{px} - 1024\text{px}$): 2-column KPI grids, responsive navigation.
  - [ ] Mobile ($375\text{px} - 767\text{px}$): Hamburger drawer, stacked cards, touch targets $\ge 44\text{px}$.
- [ ] **Visual Polish & Feedback:**
  - [ ] Loading skeleton loaders present during API fetches.
  - [ ] Toast notifications present for all success and error actions.
  - [ ] Empty state graphic/messaging when tables or queues are empty.
  - [ ] Semantic status badges with distinct colors (Green, Yellow, Blue, Red, Gray).

---

## 4. Infrastructure, Deployment & Submission Checklist

- [ ] **Database & Seeding:**
  - [ ] MongoDB Atlas cluster provisioned with IP access configured.
  - [ ] Compound indexes created for performance and rule enforcement.
  - [ ] Seed script (`npm run seed`) verified to populate demo accounts.
- [ ] **Production Hosting:**
  - [ ] Backend deployed and reachable over HTTPS (Render/Railway).
  - [ ] Frontend deployed and reachable over HTTPS (Vercel/Netlify).
  - [ ] SPA route rewrites configured to prevent 404 on refresh.
  - [ ] Frontend `VITE_API_URL` pointed to live production backend.
- [ ] **Assessment Deliverables:**
  - [ ] Clean GitHub repository with no `.env` or `node_modules` committed.
  - [ ] Comprehensive `README.md` with architecture, local setup instructions, test credentials, and API documentation.
  - [ ] Live Vercel/Netlify URL verified and ready for submission via WhatsApp to `98405 99789` along with candidate Name & Phone number.
