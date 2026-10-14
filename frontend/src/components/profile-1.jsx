import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Shield,
  Briefcase,
  Users,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { ROLES } from '../lib/constants';
import { toast } from 'sonner';

export function Profile1({ className }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeContext();
  const { role, setRole, signOut } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut?.();
    } catch {}
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (role === ROLES.ADMIN) return '👑 Workspace Admin';
    if (role === ROLES.PROJECT_MANAGER) return '💼 Project Manager';
    return '👤 Team Member';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Profile (Tharun R)"
          title="Profile (TR)"
          className="focus:outline-none cursor-pointer rounded-full transition-transform active:scale-95 hover:ring-2 hover:ring-[#0C66E4]/40 dark:hover:ring-[#579DFF]/40 ml-1"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8831D] text-[#0C162D] font-bold text-xs ring-1 ring-slate-200 dark:ring-[#1D2125] select-none hover:opacity-90 shadow-xs">
            TR
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-76 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-2.5 text-slate-900 dark:text-[#DEE4EA] shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 select-none transition-colors duration-150"
      >
        {/* User Card */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-[#1C2125]/70 border border-slate-200/80 dark:border-[#282E33]/40 mb-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8831D] text-[#0C162D] font-extrabold text-lg shadow-inner select-none">
            TR
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight leading-snug truncate">
              Tharun R
            </span>
            <span className="text-xs text-slate-500 dark:text-[#9FADBC] leading-tight truncate">
              tharun.workx@gmail.com
            </span>
            <span className="inline-flex items-center mt-1 text-[11px] font-semibold text-[#0C66E4] dark:text-[#579DFF]">
              {getRoleLabel()}
            </span>
          </div>
        </div>

        {/* Role Switcher Section (Demo & Testing) */}
        <div className="px-2 py-1.5 mb-1.5 rounded-xl bg-slate-100/70 dark:bg-[#22272B]/70 border border-slate-200/60 dark:border-[#333C44]/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#738496] block mb-1">
            Active Role Mode
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                setRole(ROLES.ADMIN);
                toast.success('Switched to Admin role (Full permissions & Dashboard)');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-0.5 ${
                role === ROLES.ADMIN
                  ? 'bg-white dark:bg-[#161A1D] text-[#0C66E4] dark:text-[#579DFF] shadow-xs ring-1 ring-slate-200 dark:ring-[#333C44]'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <span>👑</span>
              <span className="text-[10px]">Admin</span>
            </button>

            <button
              onClick={() => {
                setRole(ROLES.PROJECT_MANAGER);
                toast.success('Switched to Project Manager role');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-0.5 ${
                role === ROLES.PROJECT_MANAGER
                  ? 'bg-white dark:bg-[#161A1D] text-[#0C66E4] dark:text-[#579DFF] shadow-xs ring-1 ring-slate-200 dark:ring-[#333C44]'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <span>💼</span>
              <span className="text-[10px]">PM</span>
            </button>

            <button
              onClick={() => {
                setRole(ROLES.TEAM_MEMBER);
                toast.success('Switched to Team Member role (Restricted view)');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-0.5 ${
                role === ROLES.TEAM_MEMBER
                  ? 'bg-white dark:bg-[#161A1D] text-[#0C66E4] dark:text-[#579DFF] shadow-xs ring-1 ring-slate-200 dark:ring-[#333C44]'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <span>👤</span>
              <span className="text-[10px]">Member</span>
            </button>
          </div>
        </div>

        {/* Action Group 1 */}
        <DropdownMenuGroup className="space-y-0.5">
          {role === ROLES.ADMIN && (
            <DropdownMenuItem
              onClick={() => {
                navigate('/users');
                toast.info('Opening User Management console');
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] transition-colors cursor-pointer select-none"
            >
              <ShieldCheck className="h-4.5 w-4.5 text-[#0C66E4] dark:text-[#579DFF] shrink-0" />
              <span>User Management</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              navigate('/settings');
              toast.info('Viewing Account & Preferences');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] transition-colors cursor-pointer select-none"
          >
            <Settings className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
            <span>Preferences & Settings</span>
          </DropdownMenuItem>

          {/* Theme Toggle */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              toggleTheme();
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              toast.success(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`);
            }}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-4.5 w-4.5 text-[#579DFF] shrink-0" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-amber-500 shrink-0" />
              )}
              <span>Theme</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize bg-slate-100 dark:bg-[#22272B] text-slate-700 dark:text-[#579DFF] border border-slate-200 dark:border-[#333C44]/60">
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
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#282E33] my-1.5" />

        {/* Action Group 2 */}
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:hover:text-[#FF5630] transition-colors cursor-pointer select-none"
          >
            <LogOut className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] group-hover:text-[#FF5630] shrink-0" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile1;
