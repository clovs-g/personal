import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  transparent?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true, transparent = false, onClick }) => {
  const { isDark } = useThemeStore();

  const baseClasses = transparent
    ? `rounded-xl transition-all duration-300 ${isDark ? 'bg-black/30 border border-white/10 text-white' : 'bg-white/10 border border-black/8 text-gray-900'} backdrop-blur-xl` // glassy
    : `rounded-xl border transition-all duration-300 ${
        isDark
          ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm'
          : 'bg-white/70 border-gray-200 backdrop-blur-sm'
      }`;

  // Inline style for wider browser support of backdrop filter
  const style = transparent ? { WebkitBackdropFilter: 'blur(14px)', backgroundClip: 'padding-box' as const } : undefined;

  return (
    <motion.div
      className={`${baseClasses} ${hover ? 'hover:shadow-xl' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -5 } : undefined}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default Card;