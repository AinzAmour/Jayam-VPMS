# Screen Spec 01: Authentication & Demo Login (`/login`)

## Document Control
- **Screen ID:** `SCR-01`
- **Route:** `/login`
- **Permitted Roles:** Public / Unauthenticated
- **Design System:** Aegis UI
- **Source Requirement:** `FR-AUTH-01`, `FR-AUTH-02`, `11-auth-security.md`

---

## 1. Screen Purpose & User Goal
Provide a secure, streamlined gateway for staff members (Administrator, Receptionist, Host Employee) to authenticate into the system, while offering 1-click test credential switchers for effortless assessment evaluation by hiring reviewers.

---

## 2. Visual Layout Specifications

### 2.1 Desktop Visual Mockup (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                                                                             │
│                        🛡️  JAYAM  VPMS                                      │
│                Workplace Visitor Management System                          │
│                                                                             │
│         ┌─────────────────────────────────────────────────────────┐         │
│         │ Sign In to Workplace Console                            │         │
│         │ Enter your corporate credentials to access your portal  │         │
│         ├─────────────────────────────────────────────────────────┤         │
│         │ [!] Invalid email or password (Error Banner - Hidden)   │         │
│         │                                                         │         │
│         │ Email Address *                                         │         │
│         │ ┌─────────────────────────────────────────────────────┐ │         │
│         │ │ ✉️  sarah.reception@jayam.com                       │ │         │
│         │ └─────────────────────────────────────────────────────┘ │         │
│         │                                                         │         │
│         │ Password *                                              │         │
│         │ ┌─────────────────────────────────────────────────────┐ │         │
│         │ │ 🔒  ••••••••••••••••                           👁️  │ │         │
│         │ └─────────────────────────────────────────────────────┘ │         │
│         │                                                         │         │
│         │ ┌─────────────────────────────────────────────────────┐ │         │
│         │ │             Sign In to Account  →                   │ │         │
│         │ └─────────────────────────────────────────────────────┘ │         │
│         │                                                         │         │
│         │ ────────── QUICK EVALUATION TEST ACCOUNTS ─────────── │         │
│         │ Click any role below to instantly load test credentials:│         │
│         │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │         │
│         │ │ 👑 Admin Demo │ │ 🛎️ Reception  │ │ 💼 Employee   │ │         │
│         │ └───────────────┘ └───────────────┘ └───────────────┘ │         │
│         └─────────────────────────────────────────────────────────┘         │
│                                                                             │
│                🔒 256-Bit Encrypted Session · ISO 27001 Ready               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Visual Mockup (< 640px)

```
┌─────────────────────────────────────────┐
│ 🛡️ JAYAM VPMS                           │
│ Workplace Security & Visitor Pass       │
├─────────────────────────────────────────┤
│ Sign In                                 │
│ Enter credentials to access portal      │
│                                         │
│ Email Address *                         │
│ [ ✉️ sarah.reception@jayam.com        ] │
│                                         │
│ Password *                              │
│ [ 🔒 ••••••••••••••••             👁️ ] │
│                                         │
│ [        Sign In to Account →         ] │
│                                         │
│ ── QUICK TEST ACCOUNTS ──               │
│ [ 👑 Administrator (admin@jayam.com) ]  │
│ [ 🛎️ Receptionist  (reception@jayam)  ]  │
│ [ 💼 Host Employee (david.chen@jayam) ]  │
│                                         │
│ 🔒 Encrypted Enterprise Authentication  │
└─────────────────────────────────────────┘
```

---

## 3. Component Anatomy & Tailwind Classes

1. **Background Canvas:** `min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden`. Features subtle dark gradient backdrop (`bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900`).
2. **Brand Title Section:**
   - Shield Icon: `h-12 w-12 text-indigo-400 bg-indigo-500/20 p-2.5 rounded-2xl ring-1 ring-indigo-400/30`.
   - Title: `text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3`.
   - Subtitle: `text-sm text-slate-400 mt-1`.
3. **Authentication Card:** `w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 mt-6`.
4. **Form Inputs:**
   - Label: `block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5`.
   - Input Wrapper: `relative rounded-lg shadow-sm`.
   - Input Element: `w-full h-11 pl-10 pr-10 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`.
   - Left Icon: `absolute left-3.5 top-3 h-5 w-5 text-slate-400`.
   - Password Visibility Toggle: `absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none`.
5. **Primary Submit Button:** `w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mt-2`.
6. **Demo Switcher Pills:**
   - Pill Button: `flex-1 py-2 px-2.5 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-700 transition-all text-center`.

---

## 4. Interactive States & Behavior

| State | Visual Behavior |
| :--- | :--- |
| **Default** | Inputs clean with placeholder hints; submit button active. |
| **Hover (Submit)** | Button elevates with `bg-indigo-700 shadow-lg`. |
| **Focus (Input)** | Input border becomes `border-indigo-500` with `ring-2 ring-indigo-100`. |
| **Loading** | Submit button renders spinning SVG loader (`animate-spin`), text changes to "Authenticating...", inputs disabled. |
| **Error (Invalid Creds)** | Red alert banner renders above email input (`bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2`). |
| **Success** | Successful token stored; seamless redirect to role dashboard (`/admin/dashboard`, `/receptionist/dashboard`, `/employee/dashboard`). |
| **1-Click Demo Fill** | Clicking any demo button automatically injects credentials into fields with an emerald flash highlight. |

---

## 5. Accessibility & Mobile Optimization
- Explicit `aria-label` and `htmlFor` attributes on all form fields.
- Password input supports standard screen reader toggling (`aria-expanded`).
- Mobile touch targets adhere to $\ge 44\text{px}$ height standards.
- Fully navigable using `Tab`, `Enter`, and keyboard shortcuts.
