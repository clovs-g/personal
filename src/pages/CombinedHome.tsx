import React from 'react';

import About from './About';
import Experience from './Experience';
import Projects from './Projects';

const CombinedHome: React.FC = () => {
    return (
        <div className="pt-24 lg:pt-0">
            <About />
            <Experience />
            <Projects />

            <footer className="max-w-md pb-16 text-sm text-slate sm:pb-0">
                <p>
                    Loosely designed in Figma and coded in Visual Studio Code by yours truly.
                    Built with React.js and Tailwind CSS, deployed with Vercel.
                    All text is set in the Inter typeface.
                </p>
            </footer>
        </div>
    );
};

export default CombinedHome;
