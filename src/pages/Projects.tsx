import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SideNavigation from '../components/Layout/SideNavigation';

interface Profile {
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  order: number;
}

const Projects: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, projectsRes] = await Promise.all([
        supabase.from('profile').select('email, github_url, linkedin_url').single(),
        supabase.from('projects').select('*').order('order', { ascending: true }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen relative">
      <SideNavigation />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-lightest-slate text-4xl sm:text-5xl font-bold mb-12">
            Things I've Built
          </h1>

          <div className="space-y-24">
            {projects.filter(p => p.featured).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative grid md:grid-cols-12 gap-4 items-center ${
                  index % 2 === 0 ? '' : 'md:dir-rtl'
                }`}
              >
                {project.image_url && (
                  <div className="md:col-span-7 relative group">
                    <div className="relative overflow-hidden rounded bg-light-navy">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-auto opacity-30 group-hover:opacity-60 transition-opacity duration-200"
                      />
                    </div>
                  </div>
                )}

                <div className={`md:col-span-5 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} space-y-4`}>
                  <p className="text-cyan font-mono text-sm">Featured Project</p>
                  <h3 className="text-lightest-slate text-2xl font-bold">{project.title}</h3>
                  <div className="bg-light-navy p-6 rounded text-slate">
                    <p>{project.description}</p>
                  </div>
                  <div className={`flex flex-wrap gap-3 font-mono text-sm text-slate ${
                    index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                  }`}>
                    {project.technologies.map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                  </div>
                  <div className={`flex gap-4 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-slate hover:text-cyan transition-colors"
                      >
                        <Github size={22} />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-slate hover:text-cyan transition-colors"
                      >
                        <ExternalLink size={22} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {projects.filter(p => !p.featured).length > 0 && (
            <div className="mt-24">
              <h2 className="text-lightest-slate text-2xl font-bold mb-8 text-center">Other Noteworthy Projects</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.filter(p => !p.featured).map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-light-navy p-6 rounded hover:transform hover:-translate-y-2 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-cyan">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div className="flex gap-3">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light-slate hover:text-cyan transition-colors"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light-slate hover:text-cyan transition-colors"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                    <h4 className="text-lightest-slate text-lg font-semibold mb-2">{project.title}</h4>
                    <p className="text-slate text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 font-mono text-xs text-slate">
                      {project.technologies.map((tech, i) => (
                        <span key={i}>{tech}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="fixed bottom-8 left-12 hidden lg:flex flex-col items-center gap-6">
        {profile?.github_url && (
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-light-slate hover:text-cyan transition-all duration-200 hover:-translate-y-1"
          >
            <Github size={22} />
          </a>
        )}
        {profile?.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-light-slate hover:text-cyan transition-all duration-200 hover:-translate-y-1"
          >
            <Linkedin size={22} />
          </a>
        )}
        {profile?.email && (
          <a
            href={`mailto:${profile.email}`}
            className="text-light-slate hover:text-cyan transition-all duration-200 hover:-translate-y-1"
          >
            <Mail size={22} />
          </a>
        )}
        <div className="w-[1px] h-24 bg-slate"></div>
      </div>
    </div>
  );
};

export default Projects;
