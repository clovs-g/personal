import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Experience', href: '/experience' },
    { name: 'Projects', href: '/projects' },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-cyan font-mono text-2xl font-bold hover:text-cyan/80 transition-colors"
          >
            RC
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-light-slate hover:text-cyan transition-colors duration-200 font-mono text-sm group"
              >
                <span className="text-cyan mr-1">0{index + 1}.</span>
                <span className="group-hover:underline">{item.name}</span>
              </Link>
            ))}
            <a
              href="/cv.pdf"
              className="ml-4 px-4 py-2 border border-cyan text-cyan rounded font-mono text-sm hover:bg-cyan/10 transition-all duration-200"
            >
              Resume
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-cyan hover:text-cyan/80 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-light-navy z-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan hover:text-cyan/80 transition-colors p-2"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col items-center justify-center flex-1 space-y-8">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleNavClick}
                    className="text-lightest-slate hover:text-cyan transition-colors duration-200 font-mono text-lg"
                  >
                    <span className="text-cyan mr-2">0{index + 1}.</span>
                    {item.name}
                  </Link>
                ))}
                <a
                  href="/cv.pdf"
                  className="mt-8 px-6 py-3 border-2 border-cyan text-cyan rounded font-mono hover:bg-cyan/10 transition-all duration-200"
                >
                  Resume
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
