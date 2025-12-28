import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideNavigation: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Experience', href: '/experience' },
    { name: 'Projects', href: '/projects' },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="hidden lg:fixed lg:left-12 lg:top-1/2 lg:-translate-y-1/2 lg:flex lg:flex-col lg:items-start lg:space-y-6 z-40">
      {navigation.map((item, index) => (
        <Link
          key={item.name}
          to={item.href}
          className={`group flex items-center transition-all duration-200`}
        >
          <div
            className={`h-[1px] transition-all duration-200 mr-4 ${
              isActive(item.href)
                ? 'w-16 bg-cyan'
                : 'w-8 bg-slate group-hover:w-16 group-hover:bg-cyan'
            }`}
          />
          <span
            className={`font-mono text-xs uppercase tracking-widest transition-colors duration-200 ${
              isActive(item.href)
                ? 'text-cyan'
                : 'text-slate group-hover:text-cyan'
            }`}
          >
            <span className="text-cyan mr-1">0{index + 1}.</span>
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default SideNavigation;
