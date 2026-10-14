import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Contrast,
  Users,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Check,
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
import { toast } from 'sonner';

export function Profile1({ className }) {
  const navigate = useNavigate();
  const { theme, setTheme, toggleTheme } = useThemeContext();
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut?.();
    } catch {}
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Profile (Tharun R)"
          title="Profile (TR)"
          className="focus:outline-none cursor-pointer rounded-full transition-transform active:scale-95 hover:ring-2 hover:ring-[#0C66E4]/40 dark:hover:ring-[#579DFF]/40 ml-1"
        >
          {/* Avatar button matching the topbar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8831D] text-[#0C162D] font-bold text-xs ring-1 ring-slate-200 dark:ring-[#1D2125] select-none hover:opacity-90 shadow-xs">
            TR
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-2 text-slate-900 dark:text-[#DEE4EA] shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 select-none transition-colors duration-150"
      >
        {/* Header: Large Orange TR Circle, Name, and Email */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-[#1C2125]/70 border border-slate-200/80 dark:border-[#282E33]/40 mb-1.5">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#E8831D] text-[#0C162D] font-extrabold text-xl shadow-inner select-none">
            TR
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight leading-snug truncate">
              Tharun R
            </span>
            <span className="text-xs text-slate-500 dark:text-[#9FADBC] leading-tight truncate">
              tharun.workx@gmail.com
            </span>
          </div>
        </div>

        {/* Action Group 1 */}
        <DropdownMenuGroup className="space-y-0.5">
          {/* Profile */}
          <DropdownMenuItem
            onClick={() => {
              navigate('/settings');
              toast.info('Viewing profile details in Settings');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:focus:bg-[#22272B] dark:focus:text-[#DEE4EA] transition-colors cursor-pointer select-none"
          >
            <User className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
            <span>Profile</span>
          </DropdownMenuItem>

          {/* Account settings */}
          <DropdownMenuItem
            onClick={() => {
              navigate('/settings');
              toast.info('Viewing Account Settings');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:focus:bg-[#22272B] dark:focus:text-[#DEE4EA] transition-colors cursor-pointer select-none"
          >
            <Settings className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
            <span>Account settings</span>
          </DropdownMenuItem>

          {/* Direct Interactive Theme Toggle Item */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // Keep menu open so user sees instant theme change
              toggleTheme();
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              toast.success(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`);
            }}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:focus:bg-[#22272B] transition-colors cursor-pointer select-none group"
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

              {/* iOS style smooth sliding toggle switch */}
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

        {/* Separator */}
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#282E33] my-1.5" />

        {/* Action Group 2 */}
        <DropdownMenuGroup className="space-y-0.5">
          {/* Switch account */}
          <DropdownMenuItem
            onClick={() => {
              toast.info('Switch account: Tharun R (Personal Workspace)');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#DEE4EA] dark:hover:bg-[#22272B] dark:focus:bg-[#22272B] transition-colors cursor-pointer select-none"
          >
            <Users className="h-4.5 w-4.5 text-slate-500 dark:text-[#9FADBC] shrink-0" />
            <span>Switch account</span>
          </DropdownMenuItem>

          {/* Log out */}
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
