/*
  # Create documents table for CV and certificates

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `type` (text) - Type of document: 'cv' or 'certificate'
      - `title` (text) - Document title/name
      - `file_url` (text) - Public URL to the document
      - `file_name` (text) - Original file name
      - `file_size` (integer) - File size in bytes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `documents` table
    - Add policy for public read access (anyone can view/download)
    - Add policy for authenticated admin users to create/update/delete
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('cv', 'certificate')),
  title text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to documents
CREATE POLICY "Public can view documents"
  ON documents
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users (admins) can insert documents
CREATE POLICY "Authenticated users can insert documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users (admins) can update documents
CREATE POLICY "Authenticated users can update documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users (admins) can delete documents
CREATE POLICY "Authenticated users can delete documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (true);