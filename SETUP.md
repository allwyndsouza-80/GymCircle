# Phase 1 Setup Guide

This guide will help you set up the development environment for Phase 1 of Gym Social Calendar.

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- A Supabase account (free tier works)
- A Google Cloud Console account

---

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - Name: `gym-social-calendar`
   - Database Password: (generate a strong password)
   - Region: Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

### 1.2 Run Database Migration

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/20240312_phase1_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run"
6. Verify all tables are created in **Database > Tables**

### 1.3 Get Your Supabase Keys

1. Go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

---

## Step 2: Google OAuth Setup

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Name it: `Gym Social Calendar`

### 2.2 Enable Google+ API

1. In your Google Cloud project, go to **APIs & Services > Library**
2. Search for "Google+ API"
3. Click and enable it

### 2.3 Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `Gym Social Calendar`
   - User support email: Your email
   - Developer contact: Your email
   - Save and Continue
4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Gym Social Calendar`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://xxxxx.supabase.co` (your Supabase URL)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://xxxxx.supabase.co/auth/v1/callback` (your Supabase URL)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 2.4 Configure Google OAuth in Supabase

1. In Supabase, go to **Authentication > Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google**
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## Step 3: Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your `.env.local` file:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Email Service (Optional for Phase 1)
   RESEND_API_KEY=
   RESEND_FROM_EMAIL=
   ```

---

## Step 4: Install Dependencies

```bash
npm install
```

---

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 6: Test the Application

### Test Authentication

1. Go to `http://localhost:3000`
2. Click "Sign In"
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to the dashboard

### Test Gym Creation

1. On the dashboard, click "Create a Gym"
2. Enter gym name and location
3. Click "Create Gym"
4. You should see your gym on the dashboard

### Test Gym Joining

1. In one browser, create a gym and note the gym code
2. In another browser (or incognito), sign in with a different Google account
3. Click "Join a Gym"
4. Enter the gym code
5. As the gym owner, approve the join request
6. The member should now see the gym on their dashboard

---

## Troubleshooting

### "Invalid auth credentials" error

- Double-check your Supabase URL and keys in `.env.local`
- Make sure you're using the `anon` key, not the `service_role` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Google OAuth not working

- Verify redirect URIs in Google Cloud Console match exactly
- Check that Google+ API is enabled
- Ensure Client ID and Secret are correctly entered in Supabase

### Database errors

- Verify the migration ran successfully in Supabase SQL Editor
- Check **Database > Logs** in Supabase for error details

### "User already exists" error

- This is normal if you've signed in before
- The trigger will automatically create a user profile

---

## Next Steps

Once Phase 1 is working:

1. Test all features (create gym, join gym, approve members)
2. Invite real users to test
3. Gather feedback
4. Proceed to Phase 2 implementation

---

## Support

If you encounter issues:

1. Check Supabase logs: **Database > Logs**
2. Check browser console for errors
3. Check the terminal for Next.js errors
4. Review this setup guide again

---

## Phase 1 Checklist

- [ ] Supabase project created
- [ ] Database migration run successfully
- [ ] Google OAuth configured
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Can sign in with Google
- [ ] Can create a gym
- [ ] Can join a gym
- [ ] Can approve members

---

Congratulations! Once all items are checked, Phase 1 is complete and you're ready to build more features! 🎉
