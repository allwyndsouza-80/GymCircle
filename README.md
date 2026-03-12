# Gym Social Calendar - Development Roadmap

## 🎯 Project Overview

**Gym Social Calendar** is a production-ready, multi-tenant SaaS platform that acts as a private social network for gyms, enabling members to coordinate workouts, find training partners, and increase engagement.

### Architecture Principles

- SOLID principles
- Clean Architecture
- Domain Driven Design (DDD)
- Secure authentication and authorization
- Multi-tenant SaaS architecture
- Scalable cloud infrastructure
- Cost-efficient startup infrastructure

---

## 📋 PHASED EXECUTION PLAN

Each phase is production-ready, demoable, and builds upon the previous phase.

### **PHASE 1: FOUNDATION & SINGLE GYM MVP** ✅ Current Phase
**Duration:** 2-3 weeks
**Status:** In Progress

**Features:**
- Google OAuth authentication (Supabase Auth)
- User profile management
- Gym creation with unique codes & QR codes
- Join gym via code/QR scan
- Membership approval system (pending/approved/rejected)
- Role-based access (Owner, Admin, Member)
- Workout calendar (create, view, edit, delete)
- Workout types: Chest, Back, Legs, Cardio, Full Body
- "Looking for partner" flag
- Daily & weekly calendar views
- Member directory
- Basic email notifications
- In-app notification center

**Database Tables:** users, gyms, gym_memberships, workout_plans, notifications

---

### **PHASE 2: SOCIAL FEATURES & MULTI-GYM SUPPORT** 🔜
**Duration:** 2 weeks

**Features:**
- Workout invitation system (send/accept/reject)
- Privacy controls for workouts
- Multi-gym support (users can join multiple gyms)
- Gym switcher UI
- Enhanced admin features (remove/ban members)
- Real-time updates (Supabase Realtime)
- Audit logging
- Notification preferences

**New Tables:** workout_invitations, audit_logs, notification_preferences

---

### **PHASE 3: MONETIZATION & SAAS INFRASTRUCTURE** 💰
**Duration:** 2-3 weeks

**Features:**
- 3-month free trial system
- Regional pricing (India/International)
- Subscription plans (Starter/Premium)
- Razorpay integration (India)
- Stripe integration (International)
- Subscription management
- Billing dashboard
- Invoice generation
- Payment webhooks

**New Tables:** subscriptions, billing_records, payment_methods, invoices

---

### **PHASE 4: ANALYTICS & ADMIN DASHBOARD** 📊
**Duration:** 2 weeks

**Features:**
- Gym owner dashboard
- Member growth analytics
- Workout activity trends
- Engagement metrics
- Gym announcements
- Member achievements/badges
- Enhanced calendar features (recurring workouts, reminders)
- Platform admin (super admin)

**New Tables:** announcements, member_stats, platform_analytics

---

### **PHASE 5: SCALE & POLISH** 🚀
**Duration:** 2 weeks

**Features:**
- Security hardening (rate limiting, CAPTCHA)
- Performance optimization
- Monitoring & logging (Sentry)
- Complete test suite (unit, integration, E2E)
- CI/CD pipeline
- Database optimization
- Documentation

---

### **PHASE 6: FUTURE ENHANCEMENTS** 🌟
**Post-Launch (Ongoing)**

**Features:**
- Advanced social features (friends, messaging)
- Trainer marketplace
- Gamification (challenges, leaderboards)
- AI workout recommendations
- Mobile app (React Native)
- Integrations (Strava, Google Calendar)

---

# Product Overview

Gym Social Calendar is a **web-based platform that acts as a private social network for individual gyms**.

Members of a gym can:

- see who is going to the gym today
- see what workout they plan to do
- invite other members to train together
- coordinate workouts with gym members

The goal is to **increase gym engagement and member motivation through social coordination**.

---

# Core Functional Requirements

## Authentication

Users must sign in **only using Google authentication (OAuth)**.

Requirements:

- No email/password authentication.
- Use Google identity as the primary identity provider.
- Store Google user ID as the unique identifier.
- Secure token/session handling.

---

## Gym Creation

Gym owners can create a gym profile.

When a gym is created, the system must generate:

- unique gym code
- QR code for joining
- gym profile page

Gym profile data:

- gym name
- location
- gym owner
- gym code
- QR join link
- created date.

---

## Joining a Gym

Users can join gyms by:

1. scanning QR code
2. entering gym code

Join requests must be **approved by gym admins**.

Membership states:

- Pending
- Approved
- Rejected
- Banned.

---

## Membership Roles

Each gym supports role-based permissions:

Roles:

- Gym Owner
- Gym Admin
- Gym Member

Owner/Admin permissions:

- approve/reject join requests
- remove members
- ban users
- manage gym settings.

---

## Workout Calendar

Members can create workout plans including:

- date
- time
- workout type (Chest, Back, Legs, Cardio, Full Body)
- notes
- option to mark "Looking for workout partner"

Members should see a **daily calendar showing gym activity**.

---

## Workout Invitations

Members can:

- send workout partner invites
- accept or reject invites
- receive notifications.

---

## Privacy Controls

Users should control visibility of workouts:

- visible to gym members
- visible to friends
- private.

---

## Notifications

Users should receive notifications for:

- gym join approvals
- workout invites
- invite acceptances
- gym announcements.

---

# Monetization Model

The platform will operate as a **SaaS product for gyms**.

---

## Free Trial

Every new gym that registers will receive:

**3 months free trial**

Requirements:

- trial start date
- trial expiry tracking
- notifications before expiry
- restriction after trial ends unless subscription is active.

---

## Regional Pricing

The system must support **region-based pricing**.

Example:

### India Pricing

Starter Plan
₹999 per month

Includes:

- gym community management
- workout calendar
- member invitations
- admin dashboard

Premium Plan
₹2499 per month

Includes:

- advanced analytics
- gym event tools
- enhanced admin features.

---

### International Pricing

Starter Plan
$19 per month

Premium Plan
$49 per month

---

The system must support:

- currency localization
- regional pricing
- subscription management
- billing records.

---

## Payment Gateway Integration

India payments:

Razorpay

International payments:

Stripe

The architecture should support:

- subscription billing
- recurring payments
- plan upgrades/downgrades.

---

# Recommended Tech Stack

The architecture should use modern technologies optimized for **speed of development and low infrastructure cost**.

Frontend:

Next.js (React framework)
TypeScript
Tailwind CSS

Backend / BaaS:

Supabase

Database:

PostgreSQL

Authentication:

Google OAuth via Supabase Auth

Hosting:

Vercel for frontend hosting.

Notifications:

Email service (Resend or similar)

Real-time features:

Supabase realtime subscriptions.

Payments:

Razorpay for India
Stripe for international markets.

---

# Cost Optimization Strategy

The system should be designed to **minimize infrastructure cost for early-stage startups**.

Guidelines:

- use serverless architecture
- rely on managed services
- minimize operational overhead
- avoid heavy compute workloads
- store mostly lightweight structured data.

The platform should be able to operate with **minimal monthly infrastructure cost during early adoption**.

---

# System Design Requirements

Provide the following sections.

---

## High-Level System Architecture

Explain:

- frontend architecture
- backend architecture
- database layer
- API layer
- infrastructure components.

---

## Multi-Tenant SaaS Architecture

Design the system so **each gym acts as a tenant**.

Ensure:

- proper tenant isolation
- scalable multi-gym support.

---

## Component Architecture

Define layers:

- presentation layer
- application services
- domain layer
- infrastructure layer
- repositories.

Follow **Clean Architecture principles**.

---

## Database Design

Provide relational schema including tables:

- Users
- Gyms
- GymMemberships
- WorkoutPlans
- WorkoutInvitations
- Notifications
- Subscriptions
- BillingRecords.

Explain relationships.

---

## API Design

Define REST or GraphQL APIs including:

- authentication endpoints
- gym management
- workout scheduling
- invitation system
- billing management.

Include request/response examples.

---

## Authentication Flow

Explain secure Google OAuth implementation including:

- OAuth flow
- token handling
- session management.

---

## Authorization Model

Implement **role-based access control (RBAC)**.

Define permissions for:

- owners
- admins
- members.

---

## Security Design

Include protections for:

- user impersonation
- spam accounts
- abuse
- rate limiting
- API security.

---

## Scalability Strategy

Explain how the platform scales as gyms grow.

Consider:

- caching
- database indexing
- background jobs
- real-time updates.

---

## Development Roadmap

Define phases:

Phase 1 – MVP
Phase 2 – Growth features
Phase 3 – Scalable SaaS platform.

---

## Folder Structure

Provide production-grade folder structure for:

- frontend
- backend.

---

## DevOps and Deployment

Explain:

- CI/CD pipeline
- staging environments
- production deployment
- monitoring and logging.

---

## Testing Strategy

Explain testing approach including:

- unit tests
- integration tests
- end-to-end tests.

---

## Future Enhancements

Recommend future features such as:

- trainer marketplace
- AI workout planning
- gym challenges
- community leaderboards.

---

The final output should resemble a **complete startup architecture blueprint prepared by a senior architect before development begins**.
