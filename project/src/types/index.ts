export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  category: 'network' | 'web' | 'ai';
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  skills: string[];
  created_at: string;
}

export interface About {
  id: string;
  bio: string;
  skills: string[];
  contact_info: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  resume_url: string | null;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}