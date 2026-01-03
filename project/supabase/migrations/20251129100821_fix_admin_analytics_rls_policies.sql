/*
  # Fix Admin Analytics RLS Policies

  1. Changes
    - Update RLS policies on analytics tables to correctly check `admins.user_id` instead of `admins.id`
    - This allows authenticated admin users to read analytics data
    
  2. Security
    - Maintains existing security model
    - Only authenticated users who exist in the admins table can read analytics
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated admin to read page views" ON page_views;
DROP POLICY IF EXISTS "Allow authenticated admin to read project views" ON project_views;
DROP POLICY IF EXISTS "Allow authenticated admin full access to contact messages" ON contact_messages;

-- Recreate policies with correct admin check
CREATE POLICY "Allow authenticated admin to read page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow authenticated admin to read project views"
  ON project_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow authenticated admin full access to contact messages"
  ON contact_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );
