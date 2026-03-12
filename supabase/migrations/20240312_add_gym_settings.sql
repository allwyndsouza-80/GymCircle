-- Gym settings: timing, exact location, description, photo

ALTER TABLE public.gyms
  ADD COLUMN IF NOT EXISTS opening_time TIME,
  ADD COLUMN IF NOT EXISTS closing_time TIME,
  ADD COLUMN IF NOT EXISTS exact_location TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

COMMENT ON COLUMN public.gyms.opening_time IS 'Daily opening time of the gym (local time).';
COMMENT ON COLUMN public.gyms.closing_time IS 'Daily closing time of the gym (local time).';
COMMENT ON COLUMN public.gyms.exact_location IS 'Human-readable address or directions for the gym.';
COMMENT ON COLUMN public.gyms.description IS 'Public description of the gym, facilities, rules, etc.';
COMMENT ON COLUMN public.gyms.photo_url IS 'Primary photo/hero image URL for the gym.';

