import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { experienceService } from '../lib/supabase';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
}

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await experienceService.getAll();
        setExperiences((data || []) as ExperienceItem[]);
      } catch (err) {
        console.error('Error loading experience data:', err);
        setError('Unable to load experience data right now.');
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="mb-24 lg:mb-36">
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="mb-24 lg:mb-36">
        <p className="text-lg text-slate">{error}</p>
      </section>
    );
  }

  if (experiences.length === 0) {
    return (
      <section id="experience" className="mb-24 lg:mb-36">
        <p className="text-lg text-slate">No experience entries available yet.</p>
      </section>
    );
  }

  return (
    <section id="experience" className="mb-24 lg:mb-36">
      <div>
        <ol className="group/list">
          {experiences.map((exp, index) => (
            <motion.li
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-light-navy/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>

                <header className="z-10 mb-2 mt-1 text-lg font-semibold uppercase tracking-wide text-slate sm:col-span-2" aria-label={exp.duration}>
                  {exp.duration}
                </header>

                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-lightest-slate">
                    <div>
                      <div className="inline-flex items-baseline font-medium leading-tight text-lightest-slate hover:text-cyan focus-visible:text-cyan group/link text-base">
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span className="text-xl font-bold">
                          {exp.position} · <span className="inline-block text-cyan">{exp.company}</span>
                        </span>
                      </div>
                    </div>
                  </h3>

                  <p className="mt-4 text-lg leading-relaxed text-slate opacity-80">
                    {exp.description}
                  </p>

                  {exp.skills && exp.skills.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <li
                          key={`${exp.id}-${skill}-${i}`}
                          className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
