import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Globe,
  ListFilter,
  Columns3,
  FolderKanban,
  Code2,
  MoreHorizontal,
  Users2,
  Star,
  User,
  PaintBucket,
  Settings,
  Archive,
  Trash2,
  Check,
  FileText,
  CalendarRange,
  BookOpen,
  Plus,
} from 'lucide-react';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

const SPACE_BACKGROUND_COLORS = [
  { name: 'Default Blue', color: '#0C66E4' },
  { name: 'Purple', color: '#7C3AED' },
  { name: 'Emerald', color: '#10B981' },
  { name: 'Amber', color: '#F59E0B' },
  { name: 'Rose', color: '#EC4899' },
  { name: 'Cyan', color: '#06B6D4' },
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Dark Slate', color: '#333C44' },
];

export function SpaceHeader({ activeTab, onTabChange }) {
  const navigate = useNavigate();
  const {
    workspaces,
    currentWorkspace,
    updateWorkspace,
    deleteWorkspace,
    toggleStarWorkspace,
    archiveWorkspace,
  } = useWorkspaceContext();
  const workspaceName = currentWorkspace?.name || 'Workspace';

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Globe },
    { id: 'list', label: 'List', icon: ListFilter },
    { id: 'board', label: 'Board', icon: Columns3 },
    { id: 'development', label: 'Development', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Board link copied to clipboard');
  };

  const handleToggleStar = () => {
    if (!currentWorkspace?.id) return;
    const isStarred = toggleStarWorkspace(currentWorkspace.id);
    if (isStarred) {
      toast.success(`"${workspaceName}" added to starred`);
    } else {
      toast.info(`"${workspaceName}" removed from starred`);
    }
  };

  const handleAddPeople = () => {
    navigate('/team');
  };

  const handleSetBackground = (color) => {
    if (!currentWorkspace?.id) return;
    updateWorkspace(currentWorkspace.id, { color });
    toast.success('Space background updated');
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  const handleArchive = () => {
    if (!currentWorkspace?.id) return;
    const isArchived = archiveWorkspace(currentWorkspace.id);
    if (isArchived) {
      toast.success(`Space "${workspaceName}" archived`);
    } else {
      toast.info(`Space "${workspaceName}" unarchived`);
    }
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDeleteSpace = () => {
    if (!currentWorkspace?.id) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSpace = async () => {
    if (!currentWorkspace?.id) return;
    const name = workspaceName;
    const ok = await deleteWorkspace(currentWorkspace.id);
    if (ok) {
      toast.success(`Space "${name}" deleted`);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="border-b border-slate-200 dark:border-[#282E33] bg-[#F8FAFC] dark:bg-[#101214] px-8 pt-6 select-none transition-colors duration-150">
      {/* Breadcrumb */}
      <div className="text-xs font-medium text-slate-500 dark:text-[#9FADBC] mb-2 flex items-center gap-1.5">
        <span>Spaces</span>
        <span className="text-slate-400 dark:text-[#738496]">/</span>
        <span className="text-slate-900 dark:text-[#DEE4EA] font-semibold">{workspaceName}</span>
      </div>

      {/* Title & Action Tools */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Space Icon with Workspace Initial & Color */}
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs"
            style={{ backgroundColor: currentWorkspace?.color || '#0C66E4' }}
          >
            {currentWorkspace?.initial || 'W'}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#DEE4EA]">
            {workspaceName}
          </h1>

          {/* Team icon */}
          <button
            title="Team members"
            onClick={handleAddPeople}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#22272B] text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Users2 className="h-4 w-4" />
          </button>

          {/* More options 3-dots Dropdown matching reference image */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                title="More space options"
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#22272B] text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] transition cursor-pointer"
              >
                <MoreHorizontal className="h-4.5 w-4.5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="w-56 rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#1D2125] p-1.5 text-slate-900 dark:text-[#DEE4EA] shadow-xl z-50 text-xs"
            >
              {/* 1. Add to starred */}
              <DropdownMenuItem
                onClick={handleToggleStar}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
              >
                <Star
                  className={`h-4 w-4 shrink-0 stroke-[1.8] ${
                    currentWorkspace?.isStarred
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-500 dark:text-[#9FADBC]'
                  }`}
                />
                <span className="font-medium">
                  {currentWorkspace?.isStarred ? 'Remove from starred' : 'Add to starred'}
                </span>
              </DropdownMenuItem>

              {/* 2. Add people */}
              <DropdownMenuItem
                onClick={handleAddPeople}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
              >
                <User className="h-4 w-4 text-slate-500 dark:text-[#9FADBC] shrink-0 stroke-[1.8]" />
                <span className="font-medium">Add people</span>
              </DropdownMenuItem>

              {/* 3. Set space background */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition">
                  <PaintBucket className="h-4 w-4 text-slate-500 dark:text-[#9FADBC] shrink-0 stroke-[1.8]" />
                  <span className="font-medium">Set space background</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48 p-1.5 rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#1D2125] text-xs shadow-xl z-50">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider">
                    Background Color
                  </div>
                  {SPACE_BACKGROUND_COLORS.map((item) => (
                    <DropdownMenuItem
                      key={item.color}
                      onClick={() => handleSetBackground(item.color)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-[#282E33] transition text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full shrink-0 shadow-xs border border-white/20"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-slate-800 dark:text-[#DEE4EA]">{item.name}</span>
                      </div>
                      {currentWorkspace?.color === item.color && (
                        <Check className="h-3.5 w-3.5 text-[#0C66E4] dark:text-[#579DFF]" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* 4. Space settings */}
              <DropdownMenuItem
                onClick={handleOpenSettings}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
              >
                <Settings className="h-4 w-4 text-slate-500 dark:text-[#9FADBC] shrink-0 stroke-[1.8]" />
                <span className="font-medium">Space settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-slate-200 dark:bg-[#282E33]" />

              {/* 5. Archive space (NO premium badge as instructed) */}
              <DropdownMenuItem
                onClick={handleArchive}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
              >
                <Archive className="h-4 w-4 text-slate-500 dark:text-[#9FADBC] shrink-0 stroke-[1.8]" />
                <span className="font-medium">
                  {currentWorkspace?.isArchived ? 'Unarchive space' : 'Archive space'}
                </span>
              </DropdownMenuItem>

              {/* 6. Delete space */}
              <DropdownMenuItem
                onClick={handleDeleteSpace}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[#E5534B] dark:text-[#FD6A6A] hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <Trash2 className="h-4 w-4 shrink-0 stroke-[1.8]" />
                <span className="font-medium">Delete space</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs navigation row */}
      <div className="mt-4 flex items-center gap-6 text-sm font-medium">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 pb-2.5 transition cursor-pointer select-none ${
                isActive
                  ? 'text-[#0C66E4] dark:text-[#579DFF] font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="spaceheader-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0C66E4] dark:bg-[#579DFF] rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 600,
                    damping: 36,
                    mass: 0.5,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Delete Space Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteSpace}
        title="Delete Space"
        description={`Are you sure you want to permanently delete space "${workspaceName}"? All associated views, tasks, and data will be permanently removed.`}
        confirmText="Delete Space"
      />
    </div>
  );
}
