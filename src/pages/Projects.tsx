import React, { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { Filter, ExternalLink, Github, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { projectsService, supabaseConfigured, supabaseConfigWarning } from '../lib/supabase';
import { trackProjectView } from '../lib/analytics';
import type { Project } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ProjectModal from '../components/UI/ProjectModal';
import toast from 'react-hot-toast';
// ImageWithFallback removed — restored original <img> usage below

const Projects: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'network', name: 'Network & Mobile' },
    { id: 'web', name: 'Web Development' },
    { id: 'ai', name: 'AI Engineering' },
  ];

  const loadProjects = async () => {
    setIsFetching(true);

    if (!supabaseConfigured) {
      const warning = supabaseConfigWarning();
      console.error('Supabase not configured:', warning);
      console.error('Environment variables:', {
        url: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'MISSING',
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'MISSING'
      });
      toast.error('Database connection not configured. The site may need to be redeployed with environment variables.');
      setIsFetching(false);
      setProjects([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      console.warn('Frontend: Loading timeout - stopping spinner');
      setIsFetching(false);
      toast.error('Request timed out. This may be a configuration issue. Check the browser console for details.');
    }, 10000);

    try {
      console.log('Frontend: Loading projects from Supabase...');
      console.log('Frontend: Supabase configured:', supabaseConfigured);

      const data = await projectsService.getAll();
      clearTimeout(timeoutId);
      console.log('Frontend: Projects loaded:', data?.length || 0);

      if (!data || data.length === 0) {
        console.warn('Frontend: No projects found in database');
        toast.info('No projects available yet. Check back soon!');
        setProjects([]);
      } else {
        setProjects(data);
        console.log('Frontend: Successfully loaded', data.length, 'projects');
      }

      setIsFetching(false);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Frontend: Error loading projects:', error);
      console.error('Frontend: Error message:', error?.message);
      console.error('Frontend: Error details:', error?.details);
      console.error('Frontend: Supabase URL being used:', import.meta.env.VITE_SUPABASE_URL?.substring(0, 30));

      if (error?.message?.includes('JWT') || error?.message?.includes('apikey')) {
        toast.error('Authentication error. Invalid API key configuration.');
      } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('fetch')) {
        toast.error('Cannot connect to database. Check environment variables and redeploy.');
      } else {
        toast.error('Failed to load projects. Please try again later.');
      }

      setProjects([]);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsService.delete(id);
      toast.success('Project deleted successfully');
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleModalSave = async () => {
    await loadProjects();
  };

  const computedFiltered = useMemo(() => {
    let filtered = projects;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (deferredQuery) {
      const q = deferredQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (Array.isArray(p.tech_stack) && p.tech_stack.some(t => t.toLowerCase().includes(q)))
      );
    }
    return filtered;
  }, [projects, selectedCategory, deferredQuery]);

  useEffect(() => {
    setFilteredProjects(computedFiltered);
  }, [computedFiltered]);

  return (
    <div className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <h1 className={`text-4xl sm:text-5xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              My Projects
            </h1>
            {user && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddProject}
                className="ml-4 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            A showcase of my work across network infrastructure, web development, and AI engineering
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card
                key={project.id}
                className={`overflow-hidden h-full flex flex-col ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
                hover={true}
              >
                {project.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading={index < 6 ? "eager" : "lazy"}
                      fetchpriority={index < 3 ? "high" : "auto"}
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`text-xl font-bold flex-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.title}
                      </h3>
                      {user && (
                        <div className="flex items-center space-x-2 ml-2">
                          <button
                            onClick={() => handleEditProject(project)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDark
                                ? 'hover:bg-blue-900/20 text-blue-400 hover:text-blue-300'
                                : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700'
                            }`}
                            title="Edit project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDark
                                ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                                : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                            }`}
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Array.isArray(project.tech_stack) && project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            isDark
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                        onClick={() => trackProjectView(project.id)}
                      >
                        <Button variant="primary" size="sm" className="w-full flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Demo
                        </Button>
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                        onClick={() => trackProjectView(project.id)}
                      >
                        <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                          <Github className="w-4 h-4 mr-1" />
                          GitHub
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {user ? 'No projects yet. Click "Add Project" to get started!' : 'No projects available yet.'}
            </p>
            {user && (
              <Button
                variant="primary"
                onClick={handleAddProject}
                className="inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            )}
          </div>
        )}

        {/* Project Modal */}
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          onSave={handleModalSave}
          project={editingProject}
        />
      </div>
    </div>
  );
};

export default Projects;