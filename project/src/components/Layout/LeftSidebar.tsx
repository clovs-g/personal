import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Codepen, Instagram, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface Profile {
    title: string;
    bio: string;
    email: string;
    github_url: string | null;
    linkedin_url: string | null;
}

const GoodreadsIcon = ({ size = 24 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ display: 'inline-block' }}
    >
        <path d="M17.328 0H6.672C2.987 0 0 2.987 0 6.672v10.656C0 21.013 2.987 24 6.672 24h10.656C21.013 24 24 21.013 24 17.328V6.672C24 2.987 21.013 0 17.328 0zm-4.342 16.275c-1.353-.021-2.484-.525-2.822-2.181 1.056.126 1.832.052 2.656-.252.1-.036.17-.116.257-.184.343-.278.508-.669.585-1.076.088-.475.021-.926-.226-1.353-.2-.34.195-.53.473-.55.27-.018.528.057.737.234.347.289.475.688.483 1.137.01 1.25-.13 2.441-.758 3.51-.55 1.054-1.353 1.76-2.585 1.954-1.157.195-2.138.031-3.08-.679-.76-.575-1.182-1.341-1.321-2.282-.12-.816.031-1.597.433-2.31 1.018-1.789 2.115-2.731 4.145-2.61.808.046 1.517.337 2.053.94l-.1.082c-.365-.078-.718-.113-1.077-.103-.923.031-1.636.438-2.071 1.229-.414.757-.457 1.565-.282 2.408.136.657.48.971 1.144 1.13.061.012.126.024.184.032.747.092 1.455.034 2.055-.42l.067.069c-.066.071-.144.135-.205.207a1.693 1.693 0 0 1-1.4.6zm5.827-10.224l-.116.11c-.3.29-.623.541-.986.711a3.528 3.528 0 0 1-2.515.222c-.669-.142-1.197-.525-1.571-1.096-.289-.441-.433-.926-.451-1.453-.016-.484.034-.956.195-1.408.135-.384.368-.707.697-.936.326-.229.7-.357 1.1-.371.3-.01.58.044.832.176.357.189.605.498.784.863.308.625.43 1.258.423 1.961 0 .221-.142.42-.352.474-.21.053-.423-.057-.498-.26-.069-.2-.095-.411-.082-.628.016-.32.08-.62.201-.9.231-.53.585-.826 1.147-.853a.965.965 0 0 1 .533.102c.305.151.48.422.56.747a3.02 3.02 0 0 1 .129 1.104c-.012.636-.088 1.25-.333 1.831-.19.458-.466.84-.897 1.096-.1.058-.205.105-.31.148z" />
    </svg>
);

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
                                        <SocialIcon href="https://github.com/" icon={<Github size={28} />} label="GitHub" />
                                        <SocialIcon href="https://www.linkedin.com/feed/" icon={<Linkedin size={28} />} label="LinkedIn" />
                                        <SocialIcon href="https://codepen.io" icon={<Codepen size={28} />} label="CodePen" />
                                        <SocialIcon href="https://instagram.com" icon={<Instagram size={28} />} label="Instagram" />
                                        <SocialIcon href="https://www.goodreads.com" icon={<GoodreadsIcon size={28} />} label="Goodreads" />
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ul className="hidden lg:flex items-center gap-6 mt-12 lg:mt-16 pb-8 lg:pb-0" aria-label="Social media">
                <SocialIcon href="https://github.com/" icon={<Github size={28} />} label="GitHub" />
                <SocialIcon href="https://www.linkedin.com/feed/" icon={<Linkedin size={28} />} label="LinkedIn" />
                <SocialIcon href="https://codepen.io" icon={<Codepen size={28} />} label="CodePen" />
                <SocialIcon href="https://instagram.com" icon={<Instagram size={28} />} label="Instagram" />
                <SocialIcon href="https://www.goodreads.com" icon={<GoodreadsIcon size={28} />} label="Goodreads" />
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
