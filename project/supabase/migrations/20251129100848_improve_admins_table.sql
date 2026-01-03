/*
  # Improve Admins Table

  1. Changes
    - Add unique constraint on user_id to prevent duplicate admin entries
    - Add RLS policies for the admins table itself
    
  2. Security
    - Admins can read their own records
    - Only service role can insert/update/delete admins (via trigger)
*/

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key'
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can read own record" ON admins;
DROP POLICY IF EXISTS "Admins can read all admin records" ON admins;

-- Allow admins to read their own record
CREATE POLICY "Admins can read own record"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow admins to read all admin records (useful for admin management)
CREATE POLICY "Admins can read all admin records"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );
