/*
  # Fix Projects Admin Policy

  1. Changes
    - Update admin policy on projects table to check admins.user_id
    - Keeps public read access intact
    
  2. Security
    - Public users can read all projects
    - Only authenticated admins can insert/update/delete projects
*/

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow authenticated admin full access to projects" ON projects;

-- Recreate with proper admin check
CREATE POLICY "Allow authenticated admin full access to projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );
