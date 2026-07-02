import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-650 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`glass-input w-full ${error ? 'border-rose-500 focus:border-rose-500 dark:border-rose-500/50' : ''}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {helperText}
        </span>
      )}
    </div>
  );
};
