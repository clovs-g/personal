import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackProjectView } from '../lib/analytics';

import { useQuery } from '@tanstack/react-query';
import type { Project } from '../types';

const Projects: React.FC = () => {
  const { data: projects = [], isLoading: loading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, description, tech_stack, image_url, demo_url, repo_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleProjectClick = (projectId: string) => {
    trackProjectView(projectId);
  };

  if (loading) {
    return (
      <section id="projects" className="mb-24 lg:mb-36">
        <div>
          <ul className="group/list">
            {[1, 2, 3].map((i) => (
              <li key={i} className="mb-12">
                <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
                  <div className="z-10 sm:order-2 sm:col-span-5 space-y-2">
                    <div className="h-6 bg-light-navy/50 rounded w-3/4 animate-pulse"></div>
                    <div className="h-20 bg-light-navy/50 rounded w-full animate-pulse"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-6 w-16 bg-light-navy/50 rounded-full animate-pulse"></div>
                      <div className="h-6 w-16 bg-light-navy/50 rounded-full animate-pulse"></div>
                      <div className="h-6 w-16 bg-light-navy/50 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="z-10 sm:order-1 sm:col-span-3">
                    <div className="h-48 bg-light-navy/50 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="mb-24 lg:mb-36">


      <div>
        <ul className="group/list">
          {projects.map((project) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-light-navy/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                <div className="z-10 sm:order-2 sm:col-span-5">
                  <h3>
                    <a
                      className="inline-flex items-baseline font-medium leading-tight text-lightest-slate hover:text-cyan focus-visible:text-cyan group/link text-base"
                      href={project.demo_url || project.repo_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={project.title}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                      <span>{project.title}</span>
                      <ExternalLink className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none" />
                    </a>
                  </h3>
                  <p className="mt-2 text-lg leading-relaxed text-slate">
                    {project.description}
                  </p>
                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    {project.tech_stack.map((tech, i) => (
                      <li key={i} className="mr-1.5 mt-2">
                        <div className="flex items-center rounded-full bg-cyan-tint/10 px-3 py-1 text-xs font-medium leading-5 text-cyan">
                          {tech}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-4">
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate hover:text-cyan z-10 relative"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="z-10 sm:order-1 sm:col-span-3">
                  {project.image_url ? (
                    <img
                      alt=""
                      loading="lazy"
                      decoding="async"
                      data-nimg="1"
                      className="rounded border-2 border-slate/10 transition group-hover:border-cyan/30 sm:order-1 sm:col-span-3 sm:translate-y-1 w-full object-cover"
                      src={project.image_url}
                      style={{ color: 'transparent' }}
                    />
                  ) : (
                    <div className="rounded border-2 border-slate/10 bg-light-navy/50 h-48 w-full sm:order-1 sm:col-span-3 sm:translate-y-1"></div>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
