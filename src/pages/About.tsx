import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SideNavigation from '../components/Layout/SideNavigation';

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

interface Skill {
  id: string;
  name: string;
  category: string;
}

const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, skillsRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('skills').select('*').order('order', { ascending: true }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
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
    <div className="bg-navy min-h-screen relative">
      <SideNavigation />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-24 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-lightest-slate text-4xl sm:text-5xl font-bold mb-8">
            About Me
          </h1>

          <div className="space-y-8 text-slate text-lg leading-relaxed max-w-3xl">
            <p>
              I'm a developer passionate about crafting accessible, pixel-perfect user interfaces
              that blend thoughtful design with robust engineering. My favorite work lies at the
              intersection of design and development, creating experiences that not only look great
              but are meticulously built for performance and usability.
            </p>

            <p>
              Currently, I'm an IT Professional at{' '}
              <span className="text-cyan font-semibold">Hope Africa University</span>, specializing in
              accessibility. I contribute to the creation and maintenance of digital solutions that
              ensure platforms meet web accessibility standards and best practices to deliver an
              inclusive user experience.
            </p>

            <p>
              In the past, I've had the opportunity to develop software across a variety of settings
              from advertising agencies and large corporations to start-ups and small digital product
              studios. Additionally, I also released a comprehensive video course a few years ago,
              guiding learners through building web applications.
            </p>

            <p>
              In my spare time, I'm usually climbing, playing tennis, hanging out with my wife and
              two cats, or running around searching for interesting projects.
            </p>
          </div>

          {Object.keys(groupedSkills).length > 0 && (
            <div className="mt-12">
              <h2 className="text-lightest-slate text-2xl font-semibold mb-6">Skills & Technologies</h2>
              <div className="space-y-6">
                {Object.entries(groupedSkills).map(([category, skillList]) => (
                  <div key={category}>
                    <h3 className="text-cyan text-sm font-mono mb-3 uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {skillList.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-lightest-navy text-light-slate px-4 py-2 rounded text-sm font-mono border border-slate/20 hover:border-cyan transition-colors"
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

export default About;
