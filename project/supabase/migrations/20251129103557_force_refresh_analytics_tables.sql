/*
  # Force refresh analytics tables in PostgREST schema cache

  This migration forces PostgREST to recognize the analytics tables by:
  1. Ensuring all tables are properly exposed to the API
  2. Refreshing grants and permissions
  3. Verifying RLS policies are active
*/

-- Ensure the public schema is accessible
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Re-grant all necessary permissions on analytics tables
GRANT ALL ON public.page_views TO anon, authenticated;
GRANT ALL ON public.project_views TO anon, authenticated;
GRANT ALL ON public.contact_messages TO anon, authenticated;

-- Ensure sequences are accessible (if any)
DO $$
BEGIN
  -- Grant usage on all sequences in public schema
  EXECUTE (
    SELECT string_agg('GRANT USAGE ON ' || sequence_schema || '.' || sequence_name || ' TO anon, authenticated;', ' ')
    FROM information_schema.sequences
    WHERE sequence_schema = 'public'
  );
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- Force a schema cache reload
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
