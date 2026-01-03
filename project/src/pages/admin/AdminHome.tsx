const defaultSpecialties = [
  {
    icon: Network,
    title: 'Network & Service Mobile',
    description: 'Expert in mobile network infrastructure and service optimization'
  },
  {
    icon: Code,
    title: 'Web Development',
    description: 'Full-stack development with modern technologies and frameworks'
  },
  {
    icon: Brain,
    title: 'AI Engineering',
    description: 'Machine learning, AI model development and implementation'
  }
];
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Code, Network, Brain } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import HeroScene from '../../components/3D/HeroScene';
import Button from '../../components/UI/Button';

// ...existing code...

const AdminHome: React.FC = () => {
  const { isDark } = useThemeStore();
  // Editable state for hero and specialties
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hero, setHero] = useState({
    name: 'Ir Rugendabanga',
    surname: 'Clovis',
    description: 'IT Professional specializing in Network & Service Mobile, Web Development, and AI Engineering. Transforming ideas into innovative digital solutions.'
  });
  const [specialties, setSpecialties] = useState(defaultSpecialties);
  const [formHero, setFormHero] = useState(hero);
  const [formSpecialties, setFormSpecialties] = useState(specialties);

  const handleEdit = () => {
    setFormHero(hero);
    setFormSpecialties(specialties);
    setEditMode(true);
  };
  const handleCancel = () => {
    setEditMode(false);
  };
  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setHero(formHero);
      setSpecialties(formSpecialties);
      setEditMode(false);
      setSaving(false);
    }, 800);
  };
  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormHero({ ...formHero, [e.target.name]: e.target.value });
  };
  const handleSpecialtyChange = (idx: number, field: 'title' | 'description') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...formSpecialties];
    updated[idx] = { ...updated[idx], [field]: e.target.value };
    setFormSpecialties(updated);
  };

  return (
    <div className="relative min-h-screen">
      <HeroScene />
      <div className="flex justify-end pt-8 pr-8">
        {editMode ? (
          <>
            <Button onClick={handleSave} loading={saving} className="mr-2">Save</Button>
            <Button onClick={handleCancel} variant="outline">Cancel</Button>
          </>
        ) : (
          <Button onClick={handleEdit}>Edit</Button>
        )}
      </div>
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="block">
                {editMode ? (
                  <input
                    name="name"
                    value={formHero.name}
                    onChange={handleHeroChange}
                    className={`rounded-lg px-2 py-1 text-2xl font-bold ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-300'}`}
                  />
                ) : hero.name}
              </span>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                {editMode ? (
                  <input
                    name="surname"
                    value={formHero.surname}
                    onChange={handleHeroChange}
                    className={`rounded-lg px-2 py-1 text-2xl font-bold bg-transparent ${isDark ? 'text-white border border-gray-700' : 'text-gray-900 border border-gray-300'}`}
                  />
                ) : hero.surname}
              </span>
            </h1>
          </motion.div>
          <motion.p
            className={`text-xl sm:text-2xl mb-8 max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {editMode ? (
              <textarea
                name="description"
                value={formHero.description}
                onChange={handleHeroChange}
                className={`rounded-lg px-2 py-1 w-full ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-300'}`}
                rows={3}
              />
            ) : hero.description}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button size="lg" className="px-8 py-3">
              View My Work
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Download CV
            </Button>
          </motion.div>
          <motion.div
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <ArrowDown className={`w-6 h-6 mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </motion.div>
        </div>
      </section>
      {/* Specialties Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Technical Expertise
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Delivering comprehensive solutions across multiple technology domains
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {formSpecialties.map((specialty: typeof defaultSpecialties[number], index: number) => (
              <motion.div
                key={index}
                className={`p-8 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
                    : 'bg-white/70 border-gray-200 backdrop-blur-sm'
                } hover:shadow-xl transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 rounded-lg ${
                  isDark ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-purple-700'
                } flex items-center justify-center mb-6`}>
                  <specialty.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {editMode ? (
                    <input
                      value={specialty.title}
                      onChange={handleSpecialtyChange(index, 'title')}
                      className={`rounded-lg px-2 py-1 w-full ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-300'}`}
                    />
                  ) : specialty.title}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {editMode ? (
                    <textarea
                      value={specialty.description}
                      onChange={handleSpecialtyChange(index, 'description')}
                      className={`rounded-lg px-2 py-1 w-full ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-300'}`}
                      rows={2}
                    />
                  ) : specialty.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
