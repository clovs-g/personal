/*
  # Create Analytics Tables

  1. New Tables
    - `page_views`
      - `id` (uuid, primary key)
      - `page_path` (text) - The page that was viewed
      - `page_title` (text) - Title of the page
      - `referrer` (text) - Where the visitor came from
      - `user_agent` (text) - Browser/device info
      - `ip_address` (text) - Visitor IP (optional)
      - `country` (text) - Visitor country (optional)
      - `device_type` (text) - desktop, mobile, tablet
      - `browser` (text) - Browser name
      - `os` (text) - Operating system
      - `session_id` (text) - Unique session identifier
      - `visitor_id` (text) - Unique visitor identifier (fingerprint)
      - `created_at` (timestamptz)

    - `project_views`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `session_id` (text)
      - `visitor_id` (text)
      - `created_at` (timestamptz)

    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `session_id` (text)
      - `visitor_id` (text)
      - `status` (text) - new, read, archived
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public write access (anonymous tracking)
    - Add policies for authenticated admin read access
*/

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  page_title text,
  referrer text,
  user_agent text,
  ip_address text,
  country text,
  device_type text,
  browser text,
  os text,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create project_views table
CREATE TABLE IF NOT EXISTS project_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  session_id text,
  visitor_id text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_project_views_project_id ON project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_project_views_created_at ON project_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Page views policies
CREATE POLICY "Allow anonymous to insert page views"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin to read page views"
  ON page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- Project views policies
CREATE POLICY "Allow anonymous to insert project views"
  ON project_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin to read project views"
  ON project_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- Contact messages policies
CREATE POLICY "Allow anonymous to insert contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );
