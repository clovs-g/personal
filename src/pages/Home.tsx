import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/UI/Button';

interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  github_url: string | null;
  linkedin_url: string | null;
  cv_url: string | null;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string[];
  order: number;
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

interface Skill {
  id: string;
  name: string;
  category: string;
}

const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, experiencesRes, projectsRes, skillsRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('experiences').select('*').order('order', { ascending: true }),
        supabase.from('projects').select('*').order('order', { ascending: true }),
        supabase.from('skills').select('*').order('order', { ascending: true }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (experiencesRes.data) setExperiences(experiencesRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24">

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex flex-col justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-cyan font-mono text-sm sm:text-base mb-5">Hi, my name is</p>
            <h1 className="text-lightest-slate text-5xl sm:text-6xl lg:text-7xl font-bold mb-3">
              Ir Rugendabanga Clovis
            </h1>
            <h2 className="text-slate text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
              {profile?.title || 'IT Professional'}
            </h2>
            <p className="text-slate text-lg max-w-xl mb-12 leading-relaxed">
              {profile?.bio || "IT Professional specializing in Network & Service Mobile, Web Development, and AI Engineering. Transforming ideas into innovative digital solutions."}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-cyan text-cyan hover:bg-cyan/10 px-8 py-4 rounded font-mono"
                >
                  View My Work
                </Button>
              </a>
              {profile?.cv_url && (
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-cyan text-cyan hover:bg-cyan/10 px-8 py-4 rounded font-mono"
                  >
                    Download CV
                  </Button>
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-6 mt-8">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-slate hover:text-cyan transition-colors duration-200"
                >
                  <Github size={24} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-slate hover:text-cyan transition-colors duration-200"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="text-light-slate hover:text-cyan transition-colors duration-200"
                >
                  <Mail size={24} />
                </a>
              )}
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 numbered-heading">
          <h2 className="section-heading">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="text-slate space-y-4 mb-6">
                <p>
                  IT Professional with 2+ years of experience in Networking & ICT Engineering.
                  I hold a Bachelor's degree in Mobile Network and Service from Hope Africa University.
                </p>
                <p>
                  My expertise spans across network administration, web development, and emerging AI technologies.
                  I'm passionate about creating accessible, efficient digital solutions that solve real-world problems.
                </p>
                <p>
                  Based in {profile?.location || 'Kampala, Uganda'}, I speak French, Swahili, and English,
                  allowing me to work effectively across diverse international teams.
                </p>
              </div>

              {/* Skills */}
              {Object.keys(groupedSkills).length > 0 && (
                <div>
                  <h3 className="text-lightest-slate text-xl font-semibold mb-4">Skills & Technologies</h3>
                  <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([category, skillList]) => (
                      <div key={category}>
                        <h4 className="text-cyan text-sm font-mono mb-2">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skillList.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-lightest-navy text-light-slate px-3 py-1 rounded text-sm font-mono"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-light-navy rounded p-6 h-fit">
              <h3 className="text-lightest-slate text-xl font-semibold mb-4">Get In Touch</h3>
              <div className="space-y-3 text-slate">
                {profile?.email && (
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-cyan mt-1 flex-shrink-0" />
                    <a href={`mailto:${profile.email}`} className="hover:text-cyan transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-start gap-3">
                    <span className="text-cyan mt-1 flex-shrink-0">📱</span>
                    <a href={`tel:${profile.phone}`} className="hover:text-cyan transition-colors">
                      {profile.phone}
                    </a>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-cyan mt-1 flex-shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 numbered-heading">
          <h2 className="section-heading">Professional Experience</h2>
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l-2 border-lightest-navy hover:border-cyan transition-colors duration-200"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan"></div>
                <h3 className="text-lightest-slate text-xl font-semibold mb-1">{exp.title}</h3>
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <span className="text-cyan font-mono">{exp.company}</span>
                  <span className="text-slate">•</span>
                  <span className="text-slate">{exp.location}</span>
                </div>
                <p className="text-slate text-sm font-mono mb-4">
                  {exp.start_date} - {exp.end_date || 'Present'}
                </p>
                <ul className="space-y-2">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="text-slate flex gap-2">
                      <span className="text-cyan mt-1">▹</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 numbered-heading">
          <h2 className="section-heading">Featured Projects</h2>
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
                {/* Project Image */}
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

                {/* Project Info */}
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

          {/* Other Projects */}
          {projects.filter(p => !p.featured).length > 0 && (
            <div className="mt-16">
              <h3 className="text-lightest-slate text-2xl font-bold mb-8 text-center">Other Projects</h3>
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
        </section>

        {/* Footer */}
        <footer className="py-12 text-center">
          <p className="text-slate text-sm">
            Built with React, TypeScript, Tailwind CSS, and Supabase
          </p>
          <p className="text-slate text-sm mt-2">
            © 2024 Ir Rugendabanga Clovis. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
