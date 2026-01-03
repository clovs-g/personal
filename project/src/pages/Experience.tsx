import React from 'react';
import { motion } from 'framer-motion';

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  duration: string;
  description: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: '1',
    position: 'Trainer and Professional Intern in Network Administration',
    company: 'SAZIRIS Bujumbura',
    duration: 'August 2023 - May 2024',
    description: [
      'Developed and delivered comprehensive training courses on network setup, configuration, management, virtualization, monitoring, and security',
      'Taught fundamental computer concepts, covering hardware functionality, modern computing applications, and technological evolution',
      'Conducted practical training sessions on Windows installation, configuration, file management, and device connectivity',
      'Provided instruction in Microsoft Word and Excel for professional document creation and data handling',
      'Trained participants on data organization, information structuring, and practical computer technology applications'
    ]
  },
  {
    id: '2',
    position: 'Administrator',
    company: 'SAZIRIS Bujumbura',
    duration: 'January 2022 - March 2023',
    description: [
      'Enhanced service delivery processes, improving customer satisfaction and reducing post-purchase issues',
      'Provided excellent after-sales support, resolving complex technical problems and maintaining strong client relationships',
      'Managed customer solutions, increasing client satisfaction and service utilization',
      'Developed and implemented strategic plans that improved operational efficiency and supported long-term company growth'
    ]
  },
  {
    id: '3',
    position: 'Network Administrator & Customer Manager',
    company: 'TAO BUSINESS Burundi',
    duration: 'March 2021 - December 2022',
    description: [
      'Maintained network stability through continuous monitoring and rapid troubleshooting, ensuring uninterrupted operations',
      'Performed critical network maintenance and system updates, enhancing performance and strengthening security defenses',
      'Ensured customer service systems operated correctly with consistent availability and optimal performance',
      'Provided comprehensive after-sales support, successfully resolving technical issues and improving customer satisfaction',
      'Managed diverse customer solutions, enhancing service delivery and client happiness',
      'Contributed to strategic operational planning, aligning IT systems with business objectives',
      'Monitored key IT systems and environments, ensuring optimal performance and stability'
    ]
  }
];

const Experience: React.FC = () => {
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

                  <ul className="mt-4 text-lg leading-relaxed text-slate list-disc pl-4 space-y-3 opacity-80">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
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
