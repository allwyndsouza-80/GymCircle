-- Add persona and onboarding flags to users

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS persona TEXT CHECK (persona IN ('owner', 'member')),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

