import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, Mail, Phone, Linkedin, Github, User } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { aboutService } from '../../lib/supabase';
import type { About } from '../../types';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const AdminAbout: React.FC = () => {
  const { isDark } = useThemeStore();
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<About | null>(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await aboutService.get();
        setAboutData(data);
        setForm(data);
      } catch (error) {
        const fallback = {
          id: '1',
          bio: `I'm an experienced IT Professional with expertise spanning Network & Service Mobile infrastructure, Full-Stack Web Development, and AI Engineering. With a passion for innovative technology solutions, I specialize in creating robust, scalable systems that drive business success.\n\nMy journey in technology has been driven by curiosity and a commitment to continuous learning. From optimizing network infrastructures to developing cutting-edge AI applications, I bring a comprehensive understanding of modern technology stacks and methodologies.\n\nI believe in the power of technology to transform businesses and improve lives. Whether it's building responsive web applications, implementing AI solutions, or designing secure network architectures, I approach each project with dedication, creativity, and technical excellence.`,
          skills: [
            'Network Architecture',
            'Mobile Service Infrastructure',
            'React.js & Next.js',
            'Node.js & Python',
            'Machine Learning',
            'AI Model Development',
            'Cloud Computing (AWS, Azure)',
            'Database Design',
            'DevOps & CI/CD',
          ],
          contact_info: {
            email: 'clovisrugendabanga4@gmail.com',
            phone: '0702913471',
            location: 'Uganda Kampala',
            linkedin: 'https://linkedin.com/in/clovis',
            github: 'https://github.com/clovis'
          },
          resume_url: '',
          updated_at: '',
        };
        setAboutData(fallback);
        setForm(fallback);
      }
    };
    loadAbout();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    if (name.startsWith('contact_info.')) {
      const key = name.replace('contact_info.', '');
      setForm({ ...form, contact_info: { ...form.contact_info, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSkillsChange = (idx: number, value: string) => {
    if (!form) return;
    const newSkills = [...form.skills];
    newSkills[idx] = value;
    setForm({ ...form, skills: newSkills });
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const updated = await aboutService.update(form);
      setAboutData(updated);
      setForm(updated);
      setEditMode(false);
    } catch (e) {
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };


  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 transition-colors duration-300 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          {editMode ? (
            <>
              <Button onClick={handleSave} loading={saving} className="mr-2">Save</Button>
              <Button onClick={() => { setEditMode(false); setForm(aboutData); }} variant="outline">Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Bio */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
            <div className="w-full flex flex-col items-center justify-center">
              <h1 className={`text-5xl sm:text-6xl font-extrabold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Ir Rugendabanga Clovis</h1>
              <h2 className={`text-3xl sm:text-4xl font-normal mb-4 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 bg-clip-text text-transparent`}>About Me</h2>
              {editMode ? (
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className={`w-full min-h-[120px] p-3 rounded-lg border mb-8 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              ) : (
                <p className={`text-xl sm:text-2xl font-normal text-center mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{form.bio.split('\n\n').join(' ')}</p>
              )}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {form.skills.map((skill, idx) => (
                  editMode ? (
                    <input
                      key={idx}
                      value={skill}
                      onChange={e => handleSkillsChange(idx, e.target.value)}
                      className={`px-4 py-2 rounded-lg text-base font-medium text-center shadow-sm mb-2 ${isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'}`}
                    />
                  ) : (
                    <span
                      key={skill}
                      className={`px-4 py-2 rounded-lg text-base font-medium text-center shadow-sm ${isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'}`}
                    >
                      {skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
          {/* Right Column - Contact & Photo */}
          <div className="space-y-8">
            {/* Professional Photo Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6 text-center">
                <div className={`w-32 h-32 mx-auto rounded-full mb-4 shadow-sm flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white'}`}>
                  <User className={`w-16 h-16 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ir Rugendabanga Clovis</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>IT Professional & Technology Leader</p>
                {form.resume_url && (
                  <Button className="mt-4 w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                )}
              </Card>
            </motion.div>
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    {editMode ? (
                      <input
                        name="contact_info.email"
                        value={form.contact_info.email}
                        onChange={handleChange}
                        className={`rounded-lg px-3 py-1 ${isDark ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                    ) : (
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{form.contact_info.email}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    {editMode ? (
                      <input
                        name="contact_info.phone"
                        value={form.contact_info.phone}
                        onChange={handleChange}
                        className={`rounded-lg px-3 py-1 ${isDark ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                    ) : (
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{form.contact_info.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    {editMode ? (
                      <input
                        name="contact_info.location"
                        value={form.contact_info.location}
                        onChange={handleChange}
                        className={`rounded-lg px-3 py-1 ${isDark ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                    ) : (
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{form.contact_info.location}</span>
                    )}
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <a
                      href={form.contact_info.linkedin}
                      className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={form.contact_info.github}
                      className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
