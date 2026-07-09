import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Instagram, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface Profile {
    title: string;
    bio: string;
    email: string;
    github_url: string | null;
    linkedin_url: string | null;
}

const LeftSidebar: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const { data } = await supabase.from('profile').select('*').single();
            if (data) setProfile(data);
        } catch (e) {
            console.error(e);
        }
    };

    const navItems = [
        { name: 'About', href: '/about' },
        { name: 'Experience', href: '/experience' },
        { name: 'Projects', href: '/projects' },
        { name: 'Contact', href: '/contact' },
    ];

    const location = useLocation();
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const path = location.pathname;
        if (path === '/' || path === '/about') {
            setActiveSection('about');
        } else if (path === '/experience') {
            setActiveSection('experience');
        } else if (path === '/projects') {
            setActiveSection('projects');
        } else if (path === '/contact') {
            setActiveSection('contact');
        }
    }, [location.pathname]);

    const displayTitle = profile?.title || "IT Professional | Network & Service Mobile | Web Development | AI Engineering";

    return (
        <div className="flex flex-col justify-between h-full bg-navy relative">
            <div>
                <div className="flex justify-between items-center lg:block">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            <a href="/">Ir Rugendabanga Clovis</a>
                        </h1>
                        <h2 className="mt-3 text-lg font-medium tracking-tight text-white sm:text-xl">
                            {displayTitle}
                        </h2>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-white hover:text-cyan transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav className="nav hidden lg:block" aria-label="In-page jump links">
                    <ul className="mt-12 w-max">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.href.substring(1);
                            return (
                                <li key={item.name}>
                                    <Link
                                        className={`group flex items-center py-3 transition-all ${isActive ? 'text-white' : 'text-[#8892b0] hover:text-white'
                                            }`}
                                        to={item.href}
                                    >
                                        <span
                                            className={`mr-4 h-px transition-all group-hover:w-16 group-hover:bg-white ${isActive ? 'w-16 bg-white' : 'w-8 bg-[#8892b0]'
                                                }`}
                                        ></span>
                                        <span className="text-xs font-bold uppercase tracking-widest">
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-lg lg:hidden"
                        >
                            <div className="flex flex-col h-full p-8">
                                <div className="flex justify-end mb-12">
                                    <button
                                        className="p-2 text-white hover:text-cyan transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <X size={32} />
                                    </button>
                                </div>

                                <nav className="flex-grow">
                                    <ul className="space-y-8">
                                        {navItems.map((item) => {
                                            const isActive = activeSection === item.href.substring(1);
                                            return (
                                                <li key={item.name}>
                                                    <Link
                                                        className={`text-2xl font-bold uppercase tracking-widest transition-all ${isActive ? 'text-cyan' : 'text-white hover:text-cyan'
                                                            }`}
                                                        to={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>

                                <div className="mt-auto">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#8892b0] mb-6">Socials</h3>
                                    <ul className="flex items-center gap-6 pb-8" aria-label="Social media mobile">
                                        <SocialIcon href="https://github.com/clovs-g" icon={<Github size={28} />} label="GitHub" />
                                        <SocialIcon href="https://www.linkedin.com/in/clovis-deklo-268016392/" icon={<Linkedin size={28} />} label="LinkedIn" />
                                        <SocialIcon href="https://instagram.com" icon={<Instagram size={28} />} label="Instagram" />
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ul className="hidden lg:flex items-center gap-6 mt-12 lg:mt-16 pb-8 lg:pb-0" aria-label="Social media">
                <SocialIcon href="https://github.com/clovs-g" icon={<Github size={28} />} label="GitHub" />
                <SocialIcon href="https://www.linkedin.com/in/clovis-deklo-268016392/" icon={<Linkedin size={28} />} label="LinkedIn" />
                <SocialIcon href="https://instagram.com" icon={<Instagram size={28} />} label="Instagram" />
            </ul>
        </div>
    );
};

const SocialIcon: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
    <li>
        <a
            className="text-white opacity-60 hover:opacity-100 hover:text-cyan transition-all duration-300 transform hover:-translate-y-1 inline-block"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
        >
            {icon}
        </a>
    </li>
);

export default LeftSidebar;
