
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Search, Trash2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { projectsService } from '../../lib/supabase';
import type { Project } from '../../types';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AdminProjects: React.FC = () => {
  const { isDark } = useThemeStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  // Add modal state for new project
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Project Modal State and Handlers
  const techOptions = [
    'Vue.js', 'React', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Bootstrap',
    'Laravel', 'Node.js', 'Express', 'PHP', 'Python', 'Django', 'Flask',
    'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite',
    'Chart.js', 'Three.js', 'API Integration', 'REST API', 'GraphQL'
  ];
  const [addForm, setAddForm] = useState<{
    title: string;
    image: File | null;
    imagePreview: string;
    description: string;
    repo_url: string;
    demo_url: string;
    tech_stack: string[];
    category: 'network' | 'web' | 'ai';
  }>({
    title: '',
    image: null,
    imagePreview: '',
    description: '',
    repo_url: '',
    demo_url: '',
    tech_stack: [],
    category: 'web',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setAddForm((prev) => ({ ...prev, imagePreview: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Drag-and-drop handlers for image upload
  const [isDragActive, setIsDragActive] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setAddForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setAddForm((prev) => ({ ...prev, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleRemoveTech = (tech: string) => {
    setAddForm((prev) => ({ ...prev, tech_stack: prev.tech_stack.filter((t) => t !== tech) }));
  };

  const handleTechToggle = (tech: string) => {
    setAddForm((prev) => {
      const exists = prev.tech_stack.includes(tech);
      return {
        ...prev,
        tech_stack: exists
          ? prev.tech_stack.filter((t) => t !== tech)
          : [...prev.tech_stack, tech],
      };
    });
  };

  const handleAddFormReset = () => {
    setShowAddModal(false);
    setAddForm({
      title: '',
      image: null,
      imagePreview: '',
      description: '',
      repo_url: '',
      demo_url: '',
      tech_stack: [],
      category: 'web',
    });
    setAddError('');
    setAddSuccess(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    setAddSuccess(false);

    // Validate required fields
    if (!addForm.title || !addForm.description || !addForm.tech_stack.length || !addForm.image) {
      setAddError('Please fill all required fields and upload an image.');
      setAddLoading(false);
      return;
    }

    let imageUrl = '';
    try {
      // Upload image to Supabase Storage
      imageUrl = await projectsService.uploadImage(addForm.image);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setAddError(`Image upload failed: ${err.message}`);
      setAddLoading(false);
      return;
    }

    try {
      const newProject = {
        title: addForm.title,
        description: addForm.description,
        tech_stack: addForm.tech_stack,
        image_url: imageUrl,
        repo_url: addForm.repo_url || null,
        demo_url: addForm.demo_url || null,
        category: addForm.category,
      };

      await projectsService.create(newProject);
      setAddSuccess(true);
      setAddLoading(false);

      setTimeout(() => {
        handleAddFormReset();
      }, 1200);

      // Refresh projects list
      const data = await projectsService.getAll();
      setProjects(data || []);
    } catch (err: any) {
      console.error('Create project error:', err);
      if (err.message?.includes('row-level security')) {
        setAddError('Permission denied: You do not have admin rights to add projects.');
      } else {
        setAddError(err.message || 'Failed to add project.');
      }
      setAddLoading(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    setAddLoading(true);
    setAddError('');
    setAddSuccess(false);

    if (!addForm.title || !addForm.description || !addForm.tech_stack.length || !addForm.image) {
      setAddError('Please fill all required fields and upload an image.');
      setAddLoading(false);
      return;
    }

    let imageUrl = '';
    try {
      imageUrl = await projectsService.uploadImage(addForm.image);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setAddError(`Image upload failed: ${err.message}`);
      setAddLoading(false);
      return;
    }

    try {
      const newProject = {
        title: addForm.title,
        description: addForm.description,
        tech_stack: addForm.tech_stack,
        image_url: imageUrl,
        repo_url: addForm.repo_url || null,
        demo_url: addForm.demo_url || null,
        category: addForm.category,
      };

      await projectsService.create(newProject);
      setAddSuccess(true);
      setAddLoading(false);

      setAddForm({
        title: '',
        image: null,
        imagePreview: '',
        description: '',
        repo_url: '',
        demo_url: '',
        tech_stack: [],
        category: 'web',
      });

      // Refresh projects list
      const data = await projectsService.getAll();
      setProjects(data || []);
    } catch (err: any) {
      console.error('Create project error:', err);
      if (err.message?.includes('row-level security')) {
        setAddError('Permission denied: You do not have admin rights to add projects.');
      } else {
        setAddError(err.message || 'Failed to add project.');
      }
      setAddLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirm) return;
    try {
      setDeletingId(id);
      await projectsService.delete(id);
      // refresh list
      const data = await projectsService.getAll();
      setProjects(data || []);
      setDeletingId(null);
    } catch (err: any) {
      setDeletingId(null);
      setAddError(err.message || 'Failed to delete project.');
    }
  };
  const handleEditAll = () => {
    setEditMode(true);
  };
  const handleCancel = () => {
    setEditMode(false);
  };
  const handleSave = async () => {
    // Implement save logic for all projects (batch or per project)
    setEditMode(false);
  };

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'network', name: 'Network & Mobile' },
    { id: 'web', name: 'Web Development' },
    { id: 'ai', name: 'AI Engineering' },
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log('Admin: Loading projects from database...');
        const data = await projectsService.getAll();
        console.log('Admin: Projects loaded successfully:', data);
        console.log('Admin: Number of projects:', data?.length || 0);
        setProjects(data || []);
      } catch (error) {
        console.error('Admin: Error loading projects from database:', error);
        // Fallback to empty list or handle error UI as needed
        setProjects([]);
      }
      setLoading(false);
    };
    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProjects(filtered);
  }, [projects, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4 gap-2">
          {/* Add Project Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
              <div className={`bg-gray-900 text-white rounded-xl shadow-lg p-6 w-full max-w-4xl relative max-h-[90vh] overflow-auto`}>
                <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6">
                  {/* Left Column: Title, Image (drag-drop), Description */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="title" className="block mb-2 font-semibold">Project Title<span className="text-red-500">*</span></label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={addForm.title}
                        onChange={handleAddFormChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={100}
                      />
                    </div>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center rounded-lg border-2 transition-colors duration-150 p-4 ${isDragActive ? 'border-blue-500 bg-gray-800' : 'border-dashed border-gray-700 bg-gray-900/30'}`}
                      aria-label="Project thumbnail dropzone"
                    >
                      <div className="w-full text-left">
                        <label className="block mb-2 font-semibold">Thumbnail/Image<span className="text-red-500">*</span></label>
                      </div>
                      <div className="w-full flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageUpload}
                          className="block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {addForm.imagePreview ? (
                          <img src={addForm.imagePreview} alt="Preview" className="w-28 h-28 rounded-md object-cover border border-gray-700" />
                        ) : (
                          <div className="text-xs text-gray-400">Drag & drop an image here or click to choose</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block mb-2 font-semibold">Description<span className="text-red-500">*</span></label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        value={addForm.description}
                        onChange={handleAddFormChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px] resize-vertical"
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-400 mt-1 text-right">{addForm.description.length}/500</div>
                    </div>
                  </div>

                  {/* Right Column: Links, Tech Stack, Buttons */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="repo_url" className="block mb-2 font-semibold">GitHub Link</label>
                      <input
                        id="repo_url"
                        name="repo_url"
                        type="url"
                        value={addForm.repo_url}
                        onChange={handleAddFormChange}
                        className={`w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${addForm.repo_url && !isValidUrl(addForm.repo_url) ? 'border-red-500' : ''}`}
                        placeholder="https://github.com/your-repo"
                      />
                      {addForm.repo_url && !isValidUrl(addForm.repo_url) && (
                        <div className="text-xs text-red-500 mt-1">Invalid URL</div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="demo_url" className="block mb-2 font-semibold">Live Preview Link</label>
                      <input
                        id="demo_url"
                        name="demo_url"
                        type="url"
                        value={addForm.demo_url}
                        onChange={handleAddFormChange}
                        className={`w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${addForm.demo_url && !isValidUrl(addForm.demo_url) ? 'border-red-500' : ''}`}
                        placeholder="https://your-demo.com"
                      />
                      {addForm.demo_url && !isValidUrl(addForm.demo_url) && (
                        <div className="text-xs text-red-500 mt-1">Invalid URL</div>
                      )}
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold">Selected Tech Stack</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {addForm.tech_stack.map((t) => (
                          <span key={t} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs">
                            <span>{t}</span>
                            <button type="button" onClick={() => handleRemoveTech(t)} className="text-gray-400 hover:text-white ml-1">×</button>
                          </span>
                        ))}
                      </div>
                      <label className="block mb-2 font-semibold">Add/Remove Tech</label>
                      <div className="flex flex-wrap gap-2">
                        {techOptions.map((tech) => (
                          <button
                            type="button"
                            key={tech}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-200 ${addForm.tech_stack.includes(tech) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-blue-700 hover:text-white'}`}
                            onClick={() => handleTechToggle(tech)}
                            aria-pressed={addForm.tech_stack.includes(tech)}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleAddFormReset}>Cancel</Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" loading={addLoading}>Save</Button>
                      <Button type="button" className="bg-green-700 text-white" onClick={handleSaveAndAddAnother} loading={addLoading}>Save & Add Another</Button>
                    </div>
                  </div>
                </form>
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                {addSuccess && <div className="mt-4 text-green-400 font-semibold">Project added successfully!</div>}
                {addError && <div className="mt-4 text-red-400 font-semibold">{addError}</div>}
              </div>
            </div>
          )}
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-lg shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Project
          </Button>
          {editMode ? (
            <>
              <Button onClick={handleSave} className="mr-2">Save</Button>
              <Button onClick={handleCancel} variant="outline">Cancel</Button>
            </>
          ) : (
            <Button onClick={handleEditAll}>Edit</Button>
          )}
        </div>
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Projects</h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">Explore my work across networking, web, and AI engineering.</p>
        {/* Category Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className="capitalize"
              >
                {cat.name}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6 flex flex-col h-full">
                  <img
                    src={project.image_url || ''}
                    alt={project.title}
                    className="rounded-lg mb-4 object-cover h-40 w-full"
                    loading={index < 6 ? "eager" : "lazy"}
                    fetchPriority={index < 3 ? "high" : "auto"}
                  />
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                  <p className={`text-base mb-4 flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto items-center">
                    <div className="flex-1 flex gap-2">
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:hover:text-white">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                          <ExternalLink className="w-5 h-5 mr-1" /> Live
                        </a>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-400 hover:text-red-600 p-2 rounded-md bg-transparent"
                        aria-label={`Delete ${project.title}`}
                        disabled={deletingId === project.id}
                      >
                        {/* Simple loading/in-progress indicator */}
                        {deletingId === project.id ? (
                          <svg className="w-5 h-5 animate-spin text-red-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
