/*
  # Create Storage Bucket for Documents

  1. Storage Setup
    - Create 'documents' storage bucket for CV and certificates
    - Set bucket to public for easy access
    - Configure file size limits and allowed MIME types
  
  2. Security Policies
    - Allow public read access to all files
    - Allow authenticated users (admins) to upload files
    - Allow authenticated users (admins) to delete files
  
  3. Important Notes
    - Bucket is public so uploaded files are accessible via URL
    - Only authenticated admins can upload/delete
    - Supports common document formats: PDF, DOC, DOCX, images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files in the documents bucket
CREATE POLICY "Public can view documents"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to update documents
CREATE POLICY "Authenticated users can update documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to delete documents
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents');