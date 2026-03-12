-- Platform subscription for gym owners (no gym membership for owners)
-- First-time owners get 3 months free trial, max 2 gyms; upgrade for more.

-- Add platform subscription columns to users (for owners only)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT CHECK (subscription_tier IN ('trial', 'starter', 'growth', 'enterprise')),
  ADD COLUMN IF NOT EXISTS max_gyms_allowed INTEGER;

-- Remove trigger that created owner row in gym_memberships (owners are identified by gyms.owner_id only)
DROP TRIGGER IF EXISTS on_gym_created ON public.gyms;

-- RLS: allow gym owners (via gyms.owner_id) to view and update memberships (owners have no gym_membership row)
DROP POLICY IF EXISTS "Users can view memberships in their gyms" ON public.gym_memberships;
CREATE POLICY "Users can view memberships in their gyms" ON public.gym_memberships
  FOR SELECT USING (
    user_id = auth.uid()
    OR gym_id IN (SELECT id FROM public.gyms WHERE owner_id = auth.uid())
    OR gym_id IN (
      SELECT gym_id FROM public.gym_memberships m2
      WHERE m2.user_id = auth.uid() AND m2.status = 'approved'
    )
  );

DROP POLICY IF EXISTS "Gym owners and admins can update memberships" ON public.gym_memberships;
CREATE POLICY "Gym owners and admins can update memberships" ON public.gym_memberships
  FOR UPDATE USING (
    gym_id IN (SELECT id FROM public.gyms WHERE owner_id = auth.uid())
    OR gym_id IN (
      SELECT gym_id FROM public.gym_memberships m2
      WHERE m2.user_id = auth.uid() AND m2.role IN ('owner', 'admin') AND m2.status = 'approved'
    )
  );

-- Workout plans: allow gym owners to view/create (they have no gym_membership row)
DROP POLICY IF EXISTS "Members can view workouts in their gyms" ON public.workout_plans;
CREATE POLICY "Members can view workouts in their gyms" ON public.workout_plans
  FOR SELECT USING (
    gym_id IN (SELECT id FROM public.gyms WHERE owner_id = auth.uid())
    OR gym_id IN (
      SELECT gym_id FROM public.gym_memberships WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

DROP POLICY IF EXISTS "Approved members can create workouts" ON public.workout_plans;
CREATE POLICY "Approved members can create workouts" ON public.workout_plans
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      gym_id IN (SELECT id FROM public.gyms WHERE owner_id = auth.uid())
      OR gym_id IN (
        SELECT gym_id FROM public.gym_memberships WHERE user_id = auth.uid() AND status = 'approved'
      )
    )
  );

COMMENT ON COLUMN public.users.trial_ends_at IS 'When the owner trial ends; set on first gym creation.';
COMMENT ON COLUMN public.users.subscription_tier IS 'trial = 3 months free, starter/growth/enterprise = paid tiers.';
COMMENT ON COLUMN public.users.max_gyms_allowed IS 'Max gyms this owner can create; 2 on trial, higher on upgrade.';
