import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface AboutData {
  bio: string;
  skills: string[];
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase.from('about').select('*').single();
        if (error) throw error;
        if (data) setAboutData(data);
      } catch (error) {
        console.error('Error loading about data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-cyan text-xl">Loading...</div>
      </div>
    );
  }

  // Fallback to static content if no data is found in Supabase yet
  const displayBio = aboutData?.bio || `I'm an experienced IT Professional with expertise spanning Network & Service Mobile infrastructure, Full-Stack Web Development, and AI Engineering. With a passion for innovative technology solutions, I specialize in creating robust, scalable systems that drive business success.

My journey in technology has been driven by curiosity and a commitment to continuous learning. From optimizing network infrastructures to developing cutting-edge AI applications, I bring a comprehensive understanding of modern technology stacks and methodologies.

I believe in the power of technology to transform businesses and improve lives. Whether it's building responsive web applications, implementing AI solutions, or designing secure network architectures, I approach each project with dedication, creativity, and technical excellence.`;

  return (
    <section id="about" className="mb-24 lg:mb-36">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4 text-slate text-lg leading-relaxed max-w-3xl opacity-80 whitespace-pre-wrap">
          {displayBio}
        </div>

        <div className="mt-12">
          <h2 className="text-lightest-slate text-2xl font-semibold mb-8">Skills & Technologies</h2>

          <div className="space-y-10">
            {/* Core Skills */}
            <div>
              <h3 className="text-cyan text-sm font-mono mb-4 uppercase tracking-wider">Core Skills</h3>
              <div className="flex flex-wrap gap-3">
                {['Network Administration', 'System Virtualization', 'Windows Administration', 'Graphic Design', 'Web Design', 'Data Management'].map((skill, index) => (
                  <span key={index} className="bg-lightest-navy text-light-slate px-4 py-2 rounded text-lg font-mono border border-slate/20 hover:border-cyan transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Currently Expanding */}
            <div>
              <h3 className="text-cyan text-sm font-mono mb-4 uppercase tracking-wider">Currently Expanding</h3>
              <div className="flex flex-wrap gap-3">
                {['React.js', 'Node.js (AI-Assisted)', 'Database Design'].map((skill, index) => (
                  <span key={index} className="bg-lightest-navy text-light-slate px-4 py-2 rounded text-lg font-mono border border-slate/20 hover:border-cyan transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Specialized Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate/10">
              <div>
                <h4 className="text-white text-sm font-bold mb-3">Networking</h4>
                <p className="text-slate text-lg opacity-80 leading-relaxed font-mono">Administration, Configuration, Security</p>
              </div>
              <div>
                <h4 className="text-white text-sm font-bold mb-3">Systems</h4>
                <p className="text-slate text-lg opacity-80 leading-relaxed font-mono">Virtualization, Windows Administration</p>
              </div>
              <div>
                <h4 className="text-white text-sm font-bold mb-3">Development & Design</h4>
                <p className="text-slate text-lg opacity-80 leading-relaxed font-mono">Web Design, AI-Assisted Dev, Graphic Design</p>
              </div>
              <div>
                <h4 className="text-white text-sm font-bold mb-3">Tools & platforms</h4>
                <p className="text-slate text-lg opacity-80 leading-relaxed font-mono">MS Office, Kobo Collection, SINUT</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
