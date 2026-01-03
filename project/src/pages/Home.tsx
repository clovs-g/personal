import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Button from '../components/UI/Button';

interface Profile {
  title: string;
  bio: string;
  github_url: string | null;
  linkedin_url: string | null;
  email: string;
}

const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: profileRes } = await supabase.from('profile').select('*').single();
      if (profileRes) setProfile(profileRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl"
      >
        <h1 className="text-lightest-slate text-5xl sm:text-6xl lg:text-7xl font-bold mb-3">
          Ir Rugendabanga Clovis
        </h1>
        <h2 className="text-slate text-3xl sm:text-4xl lg:text-5xl font-semibold mb-8">
          {profile?.title || 'IT Professional'}
        </h2>
        <p className="text-slate text-lg max-w-2xl leading-relaxed mb-8">
          {profile?.bio || "I build accessible, pixel-perfect digital experiences for the web."}
        </p>
        <Button href="/projects" variant="outline" size="lg">
          Check out my work!
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
