import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CustomButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  children: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {

  const baseStyle = "px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 outline-none select-none";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30 active:scale-[0.98]",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 border border-slate-200 dark:border-slate-600 active:scale-[0.98]",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25 active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
    glass: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98]"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
