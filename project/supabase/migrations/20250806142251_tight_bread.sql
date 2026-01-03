/*
  # Portfolio Website Database Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `tech_stack` (text array)
      - `image_url` (text, nullable)
      - `demo_url` (text, nullable)
      - `repo_url` (text, nullable)
      - `category` (text with check constraint)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `experience`
      - `id` (uuid, primary key)
      - `company` (text)
      - `position` (text)
      - `duration` (text)
      - `description` (text)
      - `skills` (text array)
      - `created_at` (timestamptz)
    
    - `about`
      - `id` (uuid, primary key, default 1)
      - `bio` (text)
      - `skills` (text array)
      - `contact_info` (jsonb)
      - `resume_url` (text, nullable)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access

  3. Sample Data
    - Initial about record
    - Demo projects and experiences
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  image_url text,
  demo_url text,
  repo_url text,
  category text NOT NULL CHECK (category IN ('network', 'web', 'ai')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  position text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create about table
CREATE TABLE IF NOT EXISTS about (
  id integer PRIMARY KEY DEFAULT 1,
  bio text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  contact_info jsonb NOT NULL DEFAULT '{}',
  resume_url text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_about_record CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to experience"
  ON experience
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to about"
  ON about
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow authenticated admin full access to projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to experience"
  ON experience
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to about"
  ON about
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create update trigger for projects updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert initial about data
INSERT INTO about (id, bio, skills, contact_info, resume_url, updated_at) 
VALUES (
  1,
  'I''m an experienced IT Professional with expertise spanning Network & Service Mobile infrastructure, Full-Stack Web Development, and AI Engineering. With a passion for innovative technology solutions, I specialize in creating robust, scalable systems that drive business success.

My journey in technology has been driven by curiosity and a commitment to continuous learning. From optimizing network infrastructures to developing cutting-edge AI applications, I bring a comprehensive understanding of modern technology stacks and methodologies.

I believe in the power of technology to transform businesses and improve lives. Whether it''s building responsive web applications, implementing AI solutions, or designing secure network architectures, I approach each project with dedication, creativity, and technical excellence.',
  ARRAY[
    'Network Architecture',
    'Mobile Service Infrastructure',
    'React.js & Next.js',
    'Node.js & Python',
    'Machine Learning',
    'AI Model Development',
    'Cloud Computing (AWS, Azure)',
    'Database Design',
    'DevOps & CI/CD',
    'Cybersecurity',
    'Project Management',
    'Technical Leadership'
  ],
  '{
    "email": "clovis@example.com",
    "phone": "+250 123 456 789",
    "location": "Kigali, Rwanda",
    "linkedin": "https://linkedin.com/in/clovis",
    "github": "https://github.com/clovis"
  }'::jsonb,
  null,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Insert demo projects
INSERT INTO projects (title, description, tech_stack, image_url, demo_url, repo_url, category, created_at, updated_at) VALUES
(
  'Network Infrastructure Optimization',
  'Comprehensive network redesign for a large enterprise, improving performance by 40% and reducing latency by 60%.',
  ARRAY['Cisco', 'MPLS', 'BGP', 'OSPF', 'SD-WAN'],
  'https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg',
  null,
  null,
  'network',
  '2024-01-15'::timestamptz,
  '2024-01-15'::timestamptz
),
(
  'AI-Powered Analytics Dashboard',
  'Machine learning dashboard providing real-time insights and predictive analytics for business intelligence.',
  ARRAY['Python', 'TensorFlow', 'React', 'D3.js', 'PostgreSQL'],
  'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
  'https://demo.example.com',
  'https://github.com/example',
  'ai',
  '2024-02-10'::timestamptz,
  '2024-02-10'::timestamptz
),
(
  'E-Commerce Platform',
  'Full-stack e-commerce solution with modern UI, payment integration, and admin dashboard.',
  ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
  'https://demo.example.com',
  'https://github.com/example',
  'web',
  '2024-03-05'::timestamptz,
  '2024-03-05'::timestamptz
),
(
  'Mobile Network Monitoring System',
  'Real-time monitoring system for mobile network infrastructure with automated alerting.',
  ARRAY['Java', 'Spring Boot', 'Kafka', 'Elasticsearch', 'React'],
  'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg',
  null,
  null,
  'network',
  '2024-01-20'::timestamptz,
  '2024-01-20'::timestamptz
),
(
  'Natural Language Processing API',
  'RESTful API for text analysis, sentiment analysis, and entity recognition using transformer models.',
  ARRAY['Python', 'FastAPI', 'Transformers', 'Docker', 'Redis'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  'https://api.example.com',
  'https://github.com/example',
  'ai',
  '2024-02-25'::timestamptz,
  '2024-02-25'::timestamptz
),
(
  'Portfolio Management System',
  'Comprehensive web application for investment portfolio tracking and analysis.',
  ARRAY['Vue.js', 'Laravel', 'MySQL', 'Chart.js', 'Tailwind CSS'],
  'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
  'https://portfolio.example.com',
  'https://github.com/example',
  'web',
  '2024-03-15'::timestamptz,
  '2024-03-15'::timestamptz
) ON CONFLICT DO NOTHING;

-- Insert demo experiences
INSERT INTO experience (company, position, duration, description, skills, created_at) VALUES
(
  'TechCorp Solutions',
  'Senior Network Engineer',
  '2022 - Present',
  'Leading network infrastructure projects for enterprise clients, specializing in SD-WAN implementations and network security optimization. Managed a team of 5 engineers and delivered solutions that improved network performance by 45%.',
  ARRAY['Network Architecture', 'SD-WAN', 'Cisco', 'Security', 'Team Leadership'],
  '2024-01-01'::timestamptz
),
(
  'InnovateAI Labs',
  'AI Engineering Consultant',
  '2021 - 2022',
  'Developed and deployed machine learning models for various clients, focusing on natural language processing and computer vision applications. Built scalable ML pipelines and reduced model inference time by 60%.',
  ARRAY['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps'],
  '2024-01-02'::timestamptz
),
(
  'WebDev Pro',
  'Full Stack Developer',
  '2020 - 2021',
  'Built modern web applications using React, Node.js, and cloud technologies. Collaborated with cross-functional teams to deliver high-quality solutions for clients in various industries.',
  ARRAY['React', 'Node.js', 'MongoDB', 'AWS', 'GraphQL', 'TypeScript'],
  '2024-01-03'::timestamptz
),
(
  'NetSecure Systems',
  'Network Administrator',
  '2019 - 2020',
  'Maintained and optimized network infrastructure for a mid-sized company. Implemented security protocols and monitoring systems that reduced downtime by 30%.',
  ARRAY['Network Monitoring', 'Firewall Management', 'VPN', 'Security Protocols'],
  '2024-01-04'::timestamptz
) ON CONFLICT DO NOTHING;