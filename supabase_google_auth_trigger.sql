-- ==============================================================================
-- Supabase Trigger: Automatic Sync from auth.users -> public.users
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
--
-- Why this is required:
-- When a user logs in via Google OAuth, Supabase automatically creates an entry
-- in auth.users. However, your transactions and savings_goals tables have foreign
-- key constraints (user_id REFERENCES public.users(id)).
-- This trigger guarantees that whenever an auth.users record is created,
-- a corresponding profile row is automatically inserted into public.users.
-- ==============================================================================

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    monthly_income,
    monthly_budget_cap,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    45000.0,
    20000.0,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger to auth.users table on INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Verification Check:
-- SELECT id, name, email, monthly_income, created_at FROM public.users LIMIT 10;
-- ==============================================================================
