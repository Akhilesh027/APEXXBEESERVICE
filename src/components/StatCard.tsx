import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  isIncrease?: boolean;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  isIncrease = true, 
  colorClass = 'text-brand-500 bg-brand-500/10' 
}) => {
  return (
    <GlassCard className="relative overflow-hidden group p-5">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${colorClass}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
      </div>
      
      {change && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs">
          <span className={`font-bold flex items-center gap-0.5 ${isIncrease ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isIncrease ? '▲' : '▼'} {change}
          </span>
          <span className="text-slate-450 dark:text-slate-500">
            vs last month
          </span>
        </div>
      )}
      <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-colors duration-300" />
    </GlassCard>
  );
};
