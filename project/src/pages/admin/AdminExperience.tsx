import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Plus, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '../../stores/themeStore';
import { experienceService } from '../../lib/supabase';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Experience {
    id: string;
    position: string;
    company: string;
    duration: string;
    description: string;
    skills: string[];
}

const AdminExperience: React.FC = () => {
    const { isDark } = useThemeStore();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);

    const [form, setForm] = useState({
        position: '',
        company: '',
        duration: '',
        description: '',
        skills: [] as string[]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await experienceService.getAll();
            setExperiences(data || []);
        } catch (error) {
            console.error('Error loading experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !form.skills.includes(value)) {
                setForm(prev => ({ ...prev, skills: [...prev.skills, value] }));
                e.currentTarget.value = '';
            }
        }
    };

    const removeSkill = (skill: string) => {
        setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExp) {
                await experienceService.update(editingExp.id, form);
            } else {
                await experienceService.create(form);
            }
            loadData();
            closeModal();
        } catch (error: any) {
            console.error('Error saving experience:', error);
            if (error.message?.includes('row-level security')) {
                toast.error('Permission denied: You do not have admin rights.');
            } else {
                toast.error(error.message || 'Failed to save experience');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await experienceService.delete(id);
                loadData();
            } catch (error) {
                console.error('Error deleting experience:', error);
            }
        }
    };

    const openEditModal = (exp: Experience) => {
        setEditingExp(exp);
        setForm({
            position: exp.position,
            company: exp.company,
            duration: exp.duration,
            description: exp.description,
            skills: exp.skills
        });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingExp(null);
        setForm({
            position: '',
            company: '',
            duration: '',
            description: '',
            skills: []
        });
    };

    const filteredExperiences = experiences.filter(exp =>
        exp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Experience</h1>
                <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                    <Plus size={18} /> Add Experience
                </Button>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredExperiences.map((exp) => (
                    <Card key={exp.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{exp.position}</h3>
                                <p className="text-blue-500 font-medium">{exp.company}</p>
                                <p className="text-sm text-gray-400 mb-4">{exp.duration}</p>
                                <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{exp.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.skills.map((skill, i) => (
                                        <span key={i} className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(exp)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`relative w-full max-w-2xl p-6 rounded-xl shadow-2xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">{editingExp ? 'Edit' : 'Add'} Experience</h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position</label>
                                        <input
                                            type="text"
                                            name="position"
                                            required
                                            value={form.position}
                                            onChange={handleInputChange}
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            required
                                            value={form.company}
                                            onChange={handleInputChange}
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration (e.g., Aug 2023 - May 2024)</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        required
                                        value={form.duration}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        value={form.description}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Skills (Press Enter to add)</label>
                                    <input
                                        type="text"
                                        onKeyDown={handleSkillsChange}
                                        className={`w-full p-2 rounded-lg border mb-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                                        placeholder="e.g. React, Docker..."
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {form.skills.map((skill, i) => (
                                            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                                {skill}
                                                <button type="button" onClick={() => removeSkill(skill)}><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                                    <Button type="submit">save changes</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminExperience;
