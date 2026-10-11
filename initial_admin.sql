-- ==============================================================================
-- JAIN VASTAR BHANDAR (JVB) - INITIAL ADMINISTRATOR SETUP
-- ==============================================================================
-- STEP 1:
-- In your Supabase Dashboard, go to "Authentication" -> "Users" -> click "Add User".
-- Enter your email (e.g. admin@jainvastarbhandar.com) and a strong password.
-- Copy the newly created user's "User UID" (a UUID like 123e4567-e89b-12d3-a456-426614174000).

-- STEP 2:
-- Replace the UUID and Email below, then run this in the Supabase "SQL Editor":

/*
INSERT INTO public.admin_users (id, email, role)
VALUES (
  'PASTE_YOUR_COPIED_USER_UID_HERE'::uuid,
  'admin@jainvastarbhandar.com',
  'super_admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
*/

-- VERIFICATION:
-- Check that your user is registered as an admin:
-- SELECT * FROM public.admin_users;

-- STEP 3 (SECURITY HARDENING):
-- In Supabase Dashboard -> Authentication -> Providers -> Email:
-- Disable "Allow new users to sign up" (or turn off public signups).
-- This ensures only shop owners manually created in the dashboard can ever log in!
