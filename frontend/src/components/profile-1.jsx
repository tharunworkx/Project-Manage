import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Briefcase,
  UserCheck,
  Settings,
  Sliders,
  LogOut,
  Moon,
  Sun,
  Lock,
} from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { ROLES } from '../lib/constants';

export function Profile1({ className }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme, toggleTheme } = useThemeContext();
  const {
    role,
    setRole,
    canSwitchRoles,
    isAdmin,
    isProjectManager,
    isTeamMember,
    signOut,
    user,
  } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut?.();
    } catch {}
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Profile (${user?.name || 'Tharun R'})`}
        aria-expanded={isOpen}
        title={`Profile (${user?.name || 'Tharun R'})`}
        className="focus:outline-none cursor-pointer rounded-full transition-transform active:scale-95 hover:ring-2 hover:ring-slate-300 dark:hover:ring-[#333C44] ml-1"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-xs ring-1 ring-slate-200 dark:ring-[#1D2125] select-none hover:opacity-90 shadow-xs"
          style={{ backgroundColor: user?.color || '#7C3AED' }}
        >
          {user?.avatar || (user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'TR')}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full mt-1 sm:mt-2 w-[calc(100vw-1rem)] max-w-xs sm:w-76 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-2.5 text-slate-900 dark:text-[#DEE4EA] shadow-2xl backdrop-blur-md select-none z-50 transition-colors duration-150"
          >
            {/* User Card */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-[#1C2125]/70 border border-slate-200/80 dark:border-[#282E33]/40 mb-2">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-extrabold text-lg shadow-sm select-none"
                style={{ backgroundColor: user?.color || '#7C3AED' }}
              >
                {user?.avatar || (user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'TR')}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight leading-snug truncate">
                  {user?.name || 'Tharun R'}
                </span>
                <span className="text-xs text-slate-500 dark:text-[#9FADBC] leading-tight truncate">
                  {user?.email || 'tharun@gmail.com'}
                </span>
                <div className="mt-1">
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                      <ShieldCheck className="h-3 w-3 stroke-[2]" />
                      <span>Admin</span>
                    </span>
                  )}
                  {isProjectManager && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                      <Briefcase className="h-3 w-3 stroke-[2]" />
                      <span>Project Manager</span>
                    </span>
                  )}
                  {isTeamMember && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                      <UserCheck className="h-3 w-3 stroke-[2]" />
                      <span>Team Member</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Role Switcher: Strictly available ONLY to the Admin Login! */}
            {canSwitchRoles ? (
              <div className="px-2 py-2 mb-2 rounded-xl bg-slate-100/70 dark:bg-[#22272B]/70 border border-slate-200/60 dark:border-[#333C44]/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#738496] block mb-1.5 px-1">
                  Active Role Mode
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {/* Option 1: Admin */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole(ROLES.ADMIN);
                    }}
                    className={`p-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-1 text-center ${
                      isAdmin
                        ? 'bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] shadow-xs border border-slate-300 dark:border-[#4B5663]'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
                    }`}
                  >
                    <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-[#282E33] flex items-center justify-center text-slate-600 dark:text-[#9FADBC] shrink-0">
                      <ShieldCheck className="h-3.5 w-3.5 stroke-[1.8]" />
                    </div>
                    <span className="block text-[10px] font-bold leading-tight truncate">Admin</span>
                  </button>

                  {/* Option 2: Project Manager */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole(ROLES.PROJECT_MANAGER);
                      if (window.location.pathname.startsWith('/users')) {
                        navigate('/kanban');
                        setIsOpen(false);
                      }
                    }}
                    className={`p-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-1 text-center ${
                      isProjectManager
                        ? 'bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] shadow-xs border border-slate-300 dark:border-[#4B5663]'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
                    }`}
                  >
                    <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-[#282E33] flex items-center justify-center text-slate-600 dark:text-[#9FADBC] shrink-0">
                      <Briefcase className="h-3.5 w-3.5 stroke-[1.8]" />
                    </div>
                    <span className="block text-[10px] font-bold leading-tight truncate">Manager</span>
                  </button>

                  {/* Option 3: Team Member */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole(ROLES.TEAM_MEMBER);
                      if (window.location.pathname.startsWith('/users')) {
                        navigate('/kanban');
                        setIsOpen(false);
                      }
                    }}
                    className={`p-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-1 text-center ${
                      isTeamMember
                        ? 'bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] shadow-xs border border-slate-300 dark:border-[#4B5663]'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
                    }`}
                  >
                    <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-[#282E33] flex items-center justify-center text-slate-600 dark:text-[#9FADBC] shrink-0">
                      <UserCheck className="h-3.5 w-3.5 stroke-[1.8]" />
                    </div>
                    <span className="block text-[10px] font-bold leading-tight truncate">Member</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 mb-2 rounded-xl bg-slate-100/60 dark:bg-[#22272B]/60 border border-slate-200/60 dark:border-[#333C44]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-[#DEE4EA]">
                    {isProjectManager ? 'Project Manager' : 'Team Member'}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-[#738496]">Role Locked</span>
              </div>
            )}

            {/* Navigation Group */}
            <div className="space-y-0.5">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/users');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:hover:text-white transition-colors cursor-pointer text-left select-none"
                >
                  <ShieldCheck className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
                  <span>User Management</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  navigate('/preferences');
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:hover:text-white transition-colors cursor-pointer text-left select-none"
              >
                <Sliders className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
                <span>Preferences</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:hover:text-white transition-colors cursor-pointer text-left select-none"
                >
                  <Settings className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
                  <span>Workspace Settings</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:hover:text-white transition-colors cursor-pointer text-left select-none"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
                  ) : (
                    <Sun className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
                  )}
                  <span>Theme</span>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize bg-slate-100 dark:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]/60">
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </span>

                  <div
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                      theme === 'dark' ? 'bg-[#0C66E4]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                        theme === 'dark' ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              </button>
            </div>

            <div className="h-px bg-slate-200 dark:bg-[#282E33] my-1.5" />

            {/* Logout Action */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:hover:text-[#FF5630] transition-colors cursor-pointer text-left select-none"
              >
                <LogOut className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] group-hover:text-[#FF5630] shrink-0" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile1;
