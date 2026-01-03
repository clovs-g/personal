import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([formData]);

            if (error) throw error;

            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <section id="contact" className="mb-24 lg:mb-36">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="max-w-xl">
                            <h2 className="text-lightest-slate text-2xl font-semibold mb-6">Get In Touch</h2>
                            <p className="text-slate text-lg leading-relaxed mb-8 opacity-80">
                                I'm currently looking for new opportunities and my inbox is always open.
                                Whether you have a question or just want to say hi, I'll try my best to get back to you!
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 rounded-lg bg-lightest-navy flex items-center justify-center text-cyan border border-slate/20 group-hover:border-cyan transition-colors">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Email</h4>
                                        <p className="text-slate text-lg opacity-80">clovisrugendabanga4@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 rounded-lg bg-lightest-navy flex items-center justify-center text-cyan border border-slate/20 group-hover:border-cyan transition-colors">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Phone</h4>
                                        <p className="text-slate text-lg opacity-80">0702913471</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 rounded-lg bg-lightest-navy flex items-center justify-center text-cyan border border-slate/20 group-hover:border-cyan transition-colors">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Location</h4>
                                        <p className="text-slate text-lg opacity-80">Uganda, Kampala</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-lightest-navy p-8 rounded-xl border border-slate/10 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-white text-sm font-medium mb-2 font-mono">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-navy border border-slate/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-white text-sm font-medium mb-2 font-mono">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-navy border border-slate/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-white text-sm font-medium mb-2 font-mono">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-navy border border-slate/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-transparent border-2 border-cyan text-cyan rounded font-mono hover:bg-cyan/10 transition-colors flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin h-5 w-5 border-2 border-cyan border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Contact;
