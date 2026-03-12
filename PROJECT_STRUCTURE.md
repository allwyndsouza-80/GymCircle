# 📁 Project Structure

## Overview

This document shows the complete file structure of the Gym Social Calendar project (Phase 1).

```
GymCircle/
│
├── 📄 Configuration Files
│   ├── .env.example                    # Environment variables template
│   ├── .gitignore                      # Git ignore rules
│   ├── next.config.js                  # Next.js configuration
│   ├── package.json                    # Dependencies and scripts
│   ├── postcss.config.js               # PostCSS configuration
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   └── tsconfig.json                   # TypeScript configuration
│
├── 📚 Documentation
│   ├── README.md                       # Project overview & phased roadmap
│   ├── SETUP.md                        # Detailed setup instructions
│   ├── GETTING_STARTED.md              # Quick start guide
│   ├── PHASE1_PROGRESS.md              # Progress tracker
│   └── NEXT_STEPS.md                   # Current status & next tasks
│
├── 📱 app/                             # Next.js App Router
│   ├── layout.tsx                      # Root layout (global)
│   ├── page.tsx                        # Landing page (/)
│   ├── globals.css                     # Global CSS styles
│   │
│   ├── login/
│   │   └── page.tsx                    # Login page (/login)
│   │
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts                # OAuth callback handler
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                  # Dashboard layout (with navbar)
│   │   └── page.tsx                    # Main dashboard (/dashboard)
│   │
│   └── gyms/
│       ├── create/
│       │   └── page.tsx                # Create gym page
│       └── join/
│           └── page.tsx                # Join gym page
│
├── 🧩 components/                      # React Components
│   ├── auth/
│   │   └── google-sign-in-button.tsx  # Google OAuth button
│   │
│   ├── layout/
│   │   └── navbar.tsx                  # Navigation bar
│   │
│   └── gym/
│       ├── create-gym-form.tsx         # Gym creation form
│       └── join-gym-form.tsx           # Gym joining form
│
├── 🛠️ lib/                             # Core Library Code
│   ├── actions/                        # Server Actions
│   │   └── gym.actions.ts              # Gym-related actions
│   │
│   ├── supabase/                       # Supabase Configuration
│   │   ├── client.ts                   # Browser client
│   │   ├── server.ts                   # Server client
│   │   └── middleware.ts               # Auth middleware
│   │
│   ├── constants.ts                    # App constants
│   ├── utils.ts                        # Utility functions
│   └── validations.ts                  # Zod validation schemas
│
├── 🗄️ supabase/                        # Supabase Files
│   └── migrations/
│       └── 20240312_phase1_initial_schema.sql  # Database schema
│
├── 📘 types/                           # TypeScript Types
│   └── database.types.ts               # Database type definitions
│
└── 🔧 middleware.ts                    # Next.js middleware (auth)
```

---

## 📂 Detailed Breakdown

### Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables (Supabase, Google OAuth) |
| `.gitignore` | Specifies files to ignore in Git |
| `next.config.js` | Next.js configuration (image domains, etc.) |
| `package.json` | Project dependencies and npm scripts |
| `postcss.config.js` | PostCSS plugins configuration |
| `tailwind.config.js` | Tailwind CSS theme and configuration |
| `tsconfig.json` | TypeScript compiler options |

---

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview, phases, and architecture |
| `SETUP.md` | Step-by-step setup guide (Supabase + OAuth) |
| `GETTING_STARTED.md` | Quick start guide and current status |
| `PHASE1_PROGRESS.md` | Detailed progress tracker |
| `NEXT_STEPS.md` | Current status and next actions |

---

### App Directory (`app/`)

**Next.js App Router** - File-based routing

#### Root Level
- `layout.tsx` - Root layout with `<html>` and `<body>`
- `page.tsx` - Landing page (`/`)
- `globals.css` - Global CSS with Tailwind directives

#### Routes

| Route | File | Description |
|-------|------|-------------|
| `/login` | `app/login/page.tsx` | Login page with Google OAuth |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth callback handler |
| `/dashboard` | `app/dashboard/page.tsx` | Main dashboard (protected) |
| `/gyms/create` | `app/gyms/create/page.tsx` | Create gym page |
| `/gyms/join` | `app/gyms/join/page.tsx` | Join gym page |

---

### Components Directory (`components/`)

Reusable React components organized by feature

#### `auth/`
- `google-sign-in-button.tsx` - Google OAuth button with icon

#### `layout/`
- `navbar.tsx` - Top navigation bar with user menu

#### `gym/`
- `create-gym-form.tsx` - Form to create a gym
- `join-gym-form.tsx` - Form to join a gym by code

---

### Library Directory (`lib/`)

Core business logic and utilities

#### `actions/`
**Server Actions** - Type-safe server-side mutations

- `gym.actions.ts`:
  - `createGym()` - Create new gym with code and QR
  - `joinGym()` - Request to join gym
  - `approveMembership()` - Approve join request
  - `rejectMembership()` - Reject join request

#### `supabase/`
**Supabase Configuration**

- `client.ts` - Browser client (client components)
- `server.ts` - Server client (server components)
- `middleware.ts` - Auth session handling

#### Core Files
- `constants.ts` - App-wide constants (workout types, roles, etc.)
- `utils.ts` - Utility functions (date formatting, gym code generation, etc.)
- `validations.ts` - Zod schemas for form validation

---

### Types Directory (`types/`)

- `database.types.ts` - TypeScript types for all database tables

---

### Supabase Directory (`supabase/`)

- `migrations/20240312_phase1_initial_schema.sql`:
  - Creates 5 tables
  - Sets up Row-Level Security policies
  - Creates triggers for automation
  - Adds performance indexes

---

### Root Files

- `middleware.ts` - Next.js middleware for auth protection

---

## 🎯 File Naming Conventions

### Pages
- `page.tsx` - Route page component
- `layout.tsx` - Layout wrapper
- `route.ts` - API route handler

### Components
- `kebab-case.tsx` - All components use kebab-case
- Example: `create-gym-form.tsx`

### Actions
- `*.actions.ts` - Server actions
- Example: `gym.actions.ts`

### Types
- `*.types.ts` - Type definitions
- Example: `database.types.ts`

---

## 📊 File Count Summary

| Category | Count |
|----------|-------|
| Pages | 7 |
| Components | 5 |
| Server Actions | 1 file (4 functions) |
| Supabase Config | 3 |
| Utilities | 3 |
| Database Migrations | 1 |
| Documentation | 5 |
| Configuration | 7 |
| **Total Files** | **~35** |

---

## 🔜 Files to Create (Phase 1 Remaining)

### Workout Calendar
```
app/gyms/[gymId]/
├── calendar/
│   └── page.tsx
└── workouts/
    └── create/
        └── page.tsx

components/workout/
├── calendar-view.tsx
├── workout-card.tsx
├── create-workout-form.tsx
└── workout-type-badge.tsx

lib/actions/
└── workout.actions.ts
```

### Member Management
```
app/gyms/[gymId]/
├── members/
│   └── page.tsx
└── requests/
    └── page.tsx

components/members/
├── member-card.tsx
├── member-list.tsx
└── join-request-card.tsx
```

### Notifications
```
app/notifications/
└── page.tsx

components/notifications/
├── notification-bell.tsx
├── notification-list.tsx
└── notification-item.tsx

lib/actions/
└── notification.actions.ts
```

---

## 🗂️ Clean Architecture Layers

Our file structure follows Clean Architecture:

```
Presentation Layer (UI)
    ↓
    app/ + components/

Application Layer (Use Cases)
    ↓
    lib/actions/

Domain Layer (Business Logic)
    ↓
    lib/utils.ts + lib/validations.ts

Infrastructure Layer (External Services)
    ↓
    lib/supabase/ + types/
```

---

## 📝 Notes

- All TypeScript files use `.ts` or `.tsx` extension
- All components are functional (no class components)
- Server Actions eliminate need for API routes for most operations
- Middleware handles authentication automatically
- RLS policies in database handle authorization

---

**Last Updated:** 2024-03-12 (Phase 1 Foundation Complete)
