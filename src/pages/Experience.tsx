import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SideNavigation from '../components/Layout/SideNavigation';

interface Profile {
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
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

const Experience: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, experiencesRes] = await Promise.all([
        supabase.from('profile').select('email, github_url, linkedin_url').single(),
        supabase.from('experiences').select('*').order('order', { ascending: true }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (experiencesRes.data) setExperiences(experiencesRes.data);
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

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-24 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-lightest-slate text-4xl sm:text-5xl font-bold mb-12">
            Where I've Worked
          </h1>

          <div className="space-y-12 max-w-3xl">
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

                <h3 className="text-lightest-slate text-xl font-semibold mb-1">
                  {exp.title}
                </h3>

                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <span className="text-cyan font-mono text-base">{exp.company}</span>
                  <span className="text-slate">•</span>
                  <span className="text-slate">{exp.location}</span>
                </div>

                <p className="text-slate text-sm font-mono mb-4">
                  {exp.start_date} - {exp.end_date || 'Present'}
                </p>

                <ul className="space-y-2">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="text-slate flex gap-2">
                      <span className="text-cyan mt-1 flex-shrink-0">▹</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
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

export default Experience;
