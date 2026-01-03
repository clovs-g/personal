import React from 'react';
import { X, Mail, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';
import Button from '../UI/Button';

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    status: string;
}

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: Message | null;
}

const MessageModal: React.FC<MessageModalProps> = ({
    isOpen,
    onClose,
    message,
}) => {
    const { isDark } = useThemeStore();

    if (!isOpen || !message) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative w-full max-w-2xl my-8 rounded-xl shadow-2xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Message Details
                        </h2>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors ${isDark
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        <div className={`flex items-start justify-between p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <User className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{message.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{message.email}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {new Date(message.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${message.status === 'new'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                    {message.status === 'new' ? 'New Message' : 'Read'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Message Content
                            </h3>
                            <div className={`p-4 rounded-lg border ${isDark
                                ? 'bg-gray-900/50 border-gray-600 text-gray-300'
                                : 'bg-white border-gray-200 text-gray-700'
                                } whitespace-pre-wrap leading-relaxed`}>
                                {message.message}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MessageModal;
