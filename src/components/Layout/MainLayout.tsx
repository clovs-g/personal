import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import LeftSidebar from './LeftSidebar';
import type { Project } from '../../types';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Prefetch projects data
        queryClient.prefetchQuery({
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
    }, [queryClient]);

    return (
        <div className="bg-navy min-h-screen text-slate selection:bg-lightest-navy selection:text-lightest-slate leading-relaxed antialiased">
            <div className="mx-auto min-h-screen max-w-screen-2xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
                <div className="lg:flex lg:justify-between lg:gap-64">
                    <header className="lg:sticky lg:top-0 lg:h-screen lg:w-[30%] lg:py-24 lg:flex-shrink-0">
                        <LeftSidebar />
                    </header>
                    <main className="pt-12 md:pt-24 lg:w-[55%] lg:py-24 lg:flex-grow">
                        <div className="sticky top-0 z-30 -mx-6 mb-12 bg-navy/80 backdrop-blur-md px-6 py-4 md:-mx-12 md:px-12 lg:-mx-0 lg:px-0">
                            <div className="flex justify-between items-center sm:block">
                                <div className="relative group w-16 h-16 sm:w-32 sm:h-32">
                                    <div className="absolute -inset-1 rounded-full bg-cyan/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate/20 bg-light-navy/50 flex items-center justify-center">
                                        <img
                                            src="/clovic-removebg-preview.png"
                                            alt="Ir Rugendabanga Clovis"
                                            className="w-full h-full object-cover filter drop-shadow-lg scale-105"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
