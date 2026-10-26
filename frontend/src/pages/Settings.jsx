import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/Select';
import {
  Building2,
  Check,
  ShieldCheck,
  Archive,
  Trash2,
  Users2,
  Workflow,
  AlertTriangle,
  PaintBucket,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { useAuthContext } from '../context/AuthContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';

const WORKSPACE_COLORS = [
  { name: 'Jira Blue', color: '#0C66E4' },
  { name: 'Purple', color: '#7C3AED' },
  { name: 'Emerald', color: '#10B981' },
  { name: 'Amber', color: '#F59E0B' },
  { name: 'Rose', color: '#EC4899' },
  { name: 'Cyan', color: '#06B6D4' },
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Slate', color: '#333C44' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { isAdmin, isProjectManager } = useAuthContext();
  const {
    workspaces,
    currentWorkspace,
    updateWorkspace,
    deleteWorkspace,
    archiveWorkspace,
  } = useWorkspaceContext();

  const [name, setName] = useState(currentWorkspace?.name || 'Workspace');
  const [slug, setSlug] = useState(currentWorkspace?.slug || 'workspace');
  const [description, setDescription] = useState(
    currentWorkspace?.description || 'Collaborative team space for projects, issues, and delivery.'
  );
  const [selectedColor, setSelectedColor] = useState(
    currentWorkspace?.color || '#0C66E4'
  );

  // Workflow settings
  const [requireDoneReview, setRequireDoneReview] = useState(true);
  const [defaultPriority, setDefaultPriority] = useState('medium');
  const [defaultCycle, setDefaultCycle] = useState('2-weeks');

  useEffect(() => {
    if (currentWorkspace) {
      setName(currentWorkspace.name || '');
      setSlug(currentWorkspace.slug || '');
      setDescription(
        currentWorkspace.description ||
          'Collaborative team space for projects, issues, and delivery.'
      );
      setSelectedColor(currentWorkspace.color || '#0C66E4');
    }
  }, [currentWorkspace?.id]);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Workspace name cannot be empty');
      return;
    }
    if (!currentWorkspace?.id) return;

    const initial = name.trim()[0]?.toUpperCase() || 'W';
    updateWorkspace(currentWorkspace.id, {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: description.trim(),
      color: selectedColor,
      initial,
    });
    toast.success('Workspace settings updated successfully!');
  };

  const handleSaveWorkflow = (e) => {
    e.preventDefault();
    toast.success('Workflow defaults updated successfully!');
  };

  const handleToggleArchive = () => {
    if (!currentWorkspace?.id) return;
    const isNowArchived = archiveWorkspace(currentWorkspace.id);
    if (isNowArchived) {
      toast.success(`Space "${currentWorkspace.name}" archived`);
    } else {
      toast.info(`Space "${currentWorkspace.name}" unarchived`);
    }
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteSpace = () => {
    if (!currentWorkspace?.id) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSpace = async () => {
    if (!currentWorkspace?.id) return;
    const wsName = currentWorkspace.name;
    const ok = await deleteWorkspace(currentWorkspace.id);
    if (ok) {
      toast.success(`Workspace "${wsName}" deleted`);
      navigate('/kanban');
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 pb-28 space-y-4 sm:space-y-6 select-none transition-colors duration-150">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="h-8.5 w-8.5 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0"
              style={{ backgroundColor: currentWorkspace?.color || '#0C66E4' }}
            >
              {currentWorkspace?.initial || 'W'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-[#DEE4EA]">
                Workspace Settings
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/preferences')}
            className="text-xs border-slate-200 dark:border-[#282E33] hover:bg-slate-100 dark:hover:bg-[#22272B]"
          >
            Go to User Preferences
            <ExternalLink className="h-3.5 w-3.5 ml-1.5 opacity-70" />
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <Tabs defaultValue="general">
          {/* Animated Tabs Bar */}
          <div className="overflow-x-auto no-scrollbar pb-1 max-w-full">
            <TabsList className="mb-5 flex-nowrap shrink-0">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="workflow">Workflow & Policies</TabsTrigger>
              <TabsTrigger value="members">Members & Access</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>
          </div>

          <Card className="w-full border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shadow-xs">
            <TabsContents className="p-0">
              {/* Tab 1: General Details */}
              <TabsContent value="general" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle>Workspace Identity</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                    {/* Left Column: Form Fields */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ws-name">Workspace Name</Label>
                        <Input
                          id="ws-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Engineering Squad"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="ws-slug">Workspace Identifier (URL Slug)</Label>
                        <Input
                          id="ws-slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="e.g. engineering-squad"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="ws-desc">Description & Mission</Label>
                        <textarea
                          id="ws-desc"
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full rounded-md border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#1E2227] p-2.5 text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF]"
                          placeholder="Workspace purpose and goals..."
                        />
                      </div>
                    </div>

                    {/* Right Column: Identity Preview & Color Palette */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227] border border-slate-200/80 dark:border-[#282E33] space-y-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0"
                            style={{ backgroundColor: selectedColor }}
                          >
                            {name.trim() ? name.trim()[0]?.toUpperCase() : 'W'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] truncate">
                              {name || 'Workspace'}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-[#9FADBC] truncate">
                              app.taskora.io/{slug || 'workspace'}
                            </p>
                            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF]">
                              {currentWorkspace?.role?.toUpperCase() || 'OWNER'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label className="block text-xs font-semibold mb-2">Space Accent Color</Label>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {WORKSPACE_COLORS.map((item) => (
                              <button
                                key={item.color}
                                type="button"
                                title={item.name}
                                onClick={() => setSelectedColor(item.color)}
                                className="h-8 w-8 rounded-lg transition-transform hover:scale-105 flex items-center justify-center cursor-pointer shadow-xs border border-white/20"
                                style={{
                                  backgroundColor: item.color,
                                  outline:
                                    selectedColor === item.color
                                      ? `2px solid ${item.color}`
                                      : 'none',
                                  outlineOffset: '2px',
                                }}
                              >
                                {selectedColor === item.color && (
                                  <Check className="h-4 w-4 text-white stroke-[3]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 dark:border-[#282E33]/70 pt-5 pb-6 px-6">
                  <Button
                    onClick={handleSaveGeneral}
                    className="bg-[#0C66E4] hover:bg-[#0055CC] text-white"
                  >
                    Save Workspace Identity
                  </Button>
                </CardFooter>
              </TabsContent>

              {/* Tab 2: Workflow & Policies */}
              <TabsContent value="workflow" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle>Workflow & Review Policies</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {/* Done Review Policy Card */}
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/60 md:col-span-2">
                      <div className="pr-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF]" />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Manager & Admin Review for "Done"
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-1 leading-relaxed">
                          When enabled, team members can create and work on tasks across Backlog,
                          To Do, and Review. Only Project Managers and Admins can verify and mark
                          items as Done.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireDoneReview}
                        onChange={(e) => setRequireDoneReview(e.target.checked)}
                        className="h-4.5 w-4.5 rounded accent-[#0C66E4] cursor-pointer mt-1"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="default-prio">Default Task Priority</Label>
                      <Select
                        id="default-prio"
                        value={defaultPriority}
                        onChange={(e) => setDefaultPriority(e.target.value)}
                        className="w-full h-9"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority (Standard)</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="default-cycle">Default Sprint Duration</Label>
                      <Select
                        id="default-cycle"
                        value={defaultCycle}
                        onChange={(e) => setDefaultCycle(e.target.value)}
                        className="w-full h-9"
                      >
                        <option value="1-week">1 Week Sprints</option>
                        <option value="2-weeks">2 Weeks Sprints (Recommended)</option>
                        <option value="3-weeks">3 Weeks Sprints</option>
                        <option value="monthly">Monthly Milestones</option>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 dark:border-[#282E33]/70 pt-5 pb-6 px-6">
                  <Button
                    onClick={handleSaveWorkflow}
                    className="bg-[#0C66E4] hover:bg-[#0055CC] text-white"
                  >
                    Save Workflow Policies
                  </Button>
                </CardFooter>
              </TabsContent>

              {/* Tab 3: Members & Access */}
              <TabsContent value="members" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle>Workspace Membership</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/50 dark:bg-[#1E2227]/50 flex flex-col justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] flex items-center justify-center shrink-0">
                          <Users2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Employee Accounts & Roles
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Manage permissions across Admin, Project Manager, and Team Member roles.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate('/users')}
                        className="bg-[#0C66E4] hover:bg-[#0055CC] text-white text-xs self-start"
                      >
                        Manage Employee Accounts
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/50 dark:bg-[#1E2227]/50 flex flex-col justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-[#251B3B] text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Users2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Project Members
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Assign team members to active projects, cycle delivery, and sprint tasks.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/team')}
                        className="text-xs border-slate-200 dark:border-[#282E33] hover:bg-slate-100 dark:hover:bg-[#22272B] self-start"
                      >
                        View Team Roster
                      </Button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShieldCheck className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF] shrink-0" />
                      <span className="text-xs text-slate-600 dark:text-[#9FADBC]">
                        Only Workspace Admins can invite new users, change roles, or configure workspace policies.
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] shrink-0">
                      Role-Based Access
                    </span>
                  </div>
                </CardContent>
              </TabsContent>

              {/* Tab 4: Danger Zone */}
              <TabsContent value="danger" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle className="text-red-600 dark:text-[#FD6A6A]">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Archive Workspace */}
                    <div className="flex flex-col justify-between p-4 rounded-xl border border-amber-300 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                          {currentWorkspace?.isArchived
                            ? 'Unarchive Workspace'
                            : 'Archive this Workspace'}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-1">
                          {currentWorkspace?.isArchived
                            ? 'Restore this workspace back to the active sidebar switcher.'
                            : 'Mark this workspace as read-only and hide from active switchers.'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleToggleArchive}
                        className="border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs self-start"
                      >
                        <Archive className="h-3.5 w-3.5 mr-1" />
                        {currentWorkspace?.isArchived ? 'Unarchive Space' : 'Archive Space'}
                      </Button>
                    </div>

                    {/* Delete Workspace */}
                    <div className="flex flex-col justify-between p-4 rounded-xl border border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-red-700 dark:text-[#FD6A6A]">
                          Delete Workspace
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-1">
                          Permanently delete this workspace and all associated boards and projects.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleDeleteSpace}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs self-start cursor-pointer shadow-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete Space Permanently
                      </Button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex items-center gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-xs text-amber-800 dark:text-amber-300">
                      Archiving a workspace preserves its issues and data while hiding it from daily operations. Deletion cannot be undone.
                    </span>
                  </div>
                </CardContent>
              </TabsContent>
            </TabsContents>
          </Card>
        </Tabs>
      </div>

      {/* Delete Workspace Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteSpace}
        title="Delete Workspace"
        description={`Are you sure you want to permanently delete workspace "${currentWorkspace?.name}"? All associated boards, lists, and projects will be permanently removed.`}
        confirmText="Delete Workspace"
      />
    </div>
  );
}
