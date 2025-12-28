import React, { useState, useEffect } from 'react';

const SideNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const navigation = [
    { name: 'About', href: 'about' },
    { name: 'Experience', href: 'experience' },
    { name: 'Projects', href: 'projects' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'projects'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="hidden lg:fixed lg:left-12 lg:top-1/2 lg:-translate-y-1/2 lg:flex lg:flex-col lg:items-start lg:space-y-6 z-40">
      {navigation.map((item, index) => (
        <a
          key={item.name}
          href={`#${item.href}`}
          onClick={(e) => handleClick(e, item.href)}
          className={`group flex items-center transition-all duration-200 ${
            activeSection === item.href ? 'translate-x-0' : ''
          }`}
        >
          <div
            className={`h-[1px] transition-all duration-200 mr-4 ${
              activeSection === item.href
                ? 'w-16 bg-cyan'
                : 'w-8 bg-slate group-hover:w-16 group-hover:bg-cyan'
            }`}
          />
          <span
            className={`font-mono text-xs uppercase tracking-widest transition-colors duration-200 ${
              activeSection === item.href
                ? 'text-cyan'
                : 'text-slate group-hover:text-cyan'
            }`}
          >
            <span className="text-cyan mr-1">0{index + 1}.</span>
            {item.name}
          </span>
        </a>
      ))}
    </nav>
  );
};

export default SideNavigation;
