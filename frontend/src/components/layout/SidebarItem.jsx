import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function SidebarItem({ item, onClick }) {
  const Icon = item.icon;

  return (
    <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
      <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
            isActive
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
          )
        }
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </NavLink>
    </motion.div>
  );
}
