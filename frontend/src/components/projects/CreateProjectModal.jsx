import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Sparkles,
  ChevronDown,
  Calendar,
  Upload,
  Check,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { userService } from '../../services/userService';
import { clientService } from '../../services/clientService';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { useAuthContext } from '../../context/AuthContext';
import { DatePicker } from '../ui/date-picker';
import { toast } from 'sonner';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
];

const AI_PROJECT_TEMPLATES = [
  {
    name: 'Enterprise Cloud Infrastructure Overhaul',
    budget: '$65,000',
    estimatedHours: '480 hrs',
    tag: 'Cloud Architecture',
    description:
      'Migration of legacy monolithic services to containerized Kubernetes clusters with automated CI/CD pipelines, zero-downtime deployment, and SOC2 compliance monitoring.',
    status: 'in_progress',
  },
  {
    name: 'Mobile Banking & Biometric Auth Suite',
    budget: '$45,000',
    estimatedHours: '320 hrs',
    tag: 'Fintech Mobile',
    description:
      'High-security mobile client featuring FaceID authentication, instant peer-to-peer payments, transaction ledger inspection, and multi-currency exchange feeds.',
    status: 'in_progress',
  },
  {
    name: 'AI-Powered Customer Insights Hub',
    budget: '$38,000',
    estimatedHours: '260 hrs',
    tag: 'AI Analytics',
    description:
      'Real-time customer journey analytics engine equipped with predictive churn models, automated sentiment classification, and cohort retention reporting.',
    status: 'in_progress',
  },
  {
    name: 'Global Supply Chain Tracking Portal',
    budget: '$52,000',
    estimatedHours: '390 hrs',
    tag: 'Logistics SaaS',
    description:
      'End-to-end container tracking dashboard with GPS telemetry feeds, customs clearance status automation, and automated carrier SLA alerts.',
    status: 'in_progress',
  },
];

export function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const { currentWorkspace } = useWorkspaceContext();
  const { user, isProjectManager } = useAuthContext();

  // Form States matching User Reference UI
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [client, setClient] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [budget, setBudget] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const fileInputRef = useRef(null);

  // Clients state with real-time sync
  const [clients, setClients] = useState(() => clientService.getClients());
  useEffect(() => {
    clientService.fetchClientsFromRemote().then((remote) => {
      if (Array.isArray(remote) && remote.length > 0) {
        setClients(remote);
      }
    });
    const handleUpdate = () => setClients(clientService.getClients());
    window.addEventListener('taskflow_clients_updated', handleUpdate);
    return () => window.removeEventListener('taskflow_clients_updated', handleUpdate);
  }, []);

  // Fetch Project Managers / Admins and deduplicate
  const [allUsers, setAllUsers] = useState(() => userService.getUsers());

  useEffect(() => {
    userService.fetchUsersFromRemote().then((loaded) => {
      if (Array.isArray(loaded)) setAllUsers(loaded);
    });
    const handleUsersUpdate = () => setAllUsers(userService.getUsers());
    window.addEventListener('taskflow_users_updated', handleUsersUpdate);
    return () => window.removeEventListener('taskflow_users_updated', handleUsersUpdate);
  }, []);

  const rawPms = useMemo(() => {
    return allUsers.filter(
      (u) => u.role?.toLowerCase() === 'project_manager' || u.role?.toLowerCase() === 'admin'
    );
  }, [allUsers]);

  const projectManagers = useMemo(() => {
    const seen = new Set();
    const list = rawPms.filter((pm) => {
      if (!pm || !pm.id || seen.has(pm.id)) return false;
      seen.add(pm.id);
      return true;
    });
    // If no PM found, fallback to all users
    return list.length > 0 ? list : allUsers;
  }, [rawPms, allUsers]);

  // Set default client and user once available
  useEffect(() => {
    if (!client && clients.length > 0) {
      setClient(clients[0].name);
    }
  }, [clients, client]);

  useEffect(() => {
    if (!selectedUserId) {
      if (isProjectManager && user?.id) {
        setSelectedUserId(user.id);
      } else if (projectManagers.length > 0) {
        setSelectedUserId(projectManagers[0].id);
      }
    }
  }, [projectManagers, selectedUserId, isProjectManager, user?.id]);

  if (!isOpen) return null;

  // Handle Image File selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImageUrl(uploadEvent.target?.result || '');
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Client Creation
  const handleCreateClient = () => {
    const clientName = prompt('Enter new client or organization name:');
    if (clientName && clientName.trim()) {
      try {
        const newClient = clientService.addClient({ name: clientName.trim() });
        setClient(newClient.name);
        toast.success(`Client "${newClient.name}" created!`);
      } catch (err) {
        toast.error(err.message || 'Could not create client');
      }
    }
  };

  // Quick User Creation
  const handleCreateUser = () => {
    const userName = prompt('Enter new employee or manager name:');
    if (userName && userName.trim()) {
      const email = userName.trim().toLowerCase().replace(/\s+/g, '.') + '@taskflow.internal';
      const createdUser = userService.addUser({
        name: userName.trim(),
        email,
        role: 'project_manager',
      });
      setSelectedUserId(createdUser.id);
      toast.success(`User "${createdUser.name}" created!`);
    }
  };

  // AI Generation Button
  const handleGenerateWithAI = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const randomTemplate =
        AI_PROJECT_TEMPLATES[Math.floor(Math.random() * AI_PROJECT_TEMPLATES.length)];

      const today = new Date();
      const end = new Date();
      end.setDate(today.getDate() + 90);

      const yyyyStart = today.getFullYear();
      const mmStart = String(today.getMonth() + 1).padStart(2, '0');
      const ddStart = String(today.getDate()).padStart(2, '0');

      const yyyyEnd = end.getFullYear();
      const mmEnd = String(end.getMonth() + 1).padStart(2, '0');
      const ddEnd = String(end.getDate()).padStart(2, '0');

      setName(randomTemplate.name);
      setStartDate(`${yyyyStart}-${mmStart}-${ddStart}`);
      setEndDate(`${yyyyEnd}-${mmEnd}-${ddEnd}`);
      setBudget(randomTemplate.budget);
      setEstimatedHours(randomTemplate.estimatedHours);
      setTag(randomTemplate.tag);
      setDescription(randomTemplate.description);
      setStatus(randomTemplate.status);

      setIsAiGenerating(false);
      toast.success('Project details generated with AI!');
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Project Name is required.');
      return;
    }

    const formattedDuration = endDate
      ? new Date(endDate + (endDate.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : startDate
      ? new Date(startDate + (startDate.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Nov 20, 2026';

    const chosenUsers = allUsers.filter((u) => selectedMemberIds.includes(u.id));
    const finalMembers = chosenUsers;

    const newProject = {
      workspace_id: currentWorkspace?.id,
      name: name.trim(),
      start_date: startDate,
      end_date: endDate,
      duration: formattedDuration,
      imageUrl: imageUrl || null,
      client: client || (clients[0]?.name ?? 'Acme Corporation'),
      project_manager_id: selectedUserId || (projectManagers[0]?.id ?? null),
      budget: budget.trim(),
      estimatedHours: estimatedHours.trim(),
      description:
        description.trim() ||
        'The goal of this project is to improve operational efficiency within the organization by implementing structured workflows.',
      tag: tag.trim() || 'General',
      status: status || 'in_progress',
      members: finalMembers,
      member_ids: finalMembers.map((m) => m.id),
      memberIds: finalMembers.map((m) => m.id),
      member_emails: finalMembers.map((m) => m.email?.toLowerCase()).filter(Boolean),
      moreCount: finalMembers.length > 3 ? finalMembers.length - 3 : 0,
    };

    onCreate(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 animate-in fade-in-0 duration-150 select-none">
      <div className="relative w-full max-w-xl my-auto rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shadow-2xl text-slate-800 dark:text-[#DEE4EA] flex flex-col animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-hidden">
        
        {/* Top Header - Fixed / Non-scrollable */}
        <div className="flex items-center justify-between px-6 sm:px-7 py-4.5 border-b border-slate-100 dark:border-[#282E33]/70 shrink-0 bg-white dark:bg-[#161A1D]">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight">
            Create New Project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#DEE4EA] transition cursor-pointer"
            title="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Fields Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-4.5 space-y-3.5 text-xs">
          
          {/* Row 1: Project Name* */}
          <div>
            <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
              Project Name<span className="text-rose-500 font-bold ml-0.5">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Enter Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition"
            />
          </div>

          {/* Row 2: Start Date & End Date (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
                Start Date
              </label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="dd/mm/yyyy"
                align="left"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
                End Date
              </label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="dd/mm/yyyy"
                align="right"
              />
            </div>
          </div>

          {/* Row 3: Project Image* */}
          <div>
            <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
              Project Image<span className="text-rose-500 font-bold ml-0.5">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center h-9.5 w-full rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] overflow-hidden cursor-pointer hover:border-slate-300 dark:hover:border-slate-500 transition"
            >
              <button
                type="button"
                className="h-full px-3.5 bg-slate-100 dark:bg-[#282E33] border-r border-slate-200 dark:border-[#333C44] text-slate-700 dark:text-[#DEE4EA] font-medium hover:bg-slate-200 dark:hover:bg-[#333C44] transition shrink-0 cursor-pointer"
              >
                Choose File
              </button>
              <span className="px-3 text-slate-500 dark:text-slate-400 truncate">
                {imageFileName || 'No file chosen'}
              </span>
            </div>
          </div>

          {/* Row 4: Client & User* (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Client */}
            <div>
              <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
                Client
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-9.5 flex items-center justify-between rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] hover:border-slate-300 dark:hover:border-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition cursor-pointer text-left shadow-2xs"
                  >
                    <span className="truncate">
                      {client || 'Select Client'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[--radix-dropdown-menu-trigger-width] max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-xl z-50 text-xs"
                >
                  {clients.map((c) => (
                    <DropdownMenuItem
                      key={c.id || c.name}
                      onClick={() => setClient(c.name)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                        client === c.name
                          ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]'
                          : 'text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-semibold text-slate-900 dark:text-[#DEE4EA] truncate">
                          {c.name}
                        </span>
                        {c.contact_person && c.contact_person !== c.name && (
                          <span className="text-[10px] text-slate-500 dark:text-[#9FADBC] truncate">
                            Contact: {c.contact_person}
                          </span>
                        )}
                      </div>
                      {client === c.name && <Check className="h-3.5 w-3.5 shrink-0 ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Lead* */}
            <div>
              <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
                Lead<span className="text-rose-500 font-bold ml-0.5">*</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-9.5 flex items-center justify-between rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] hover:border-slate-300 dark:hover:border-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition cursor-pointer text-left shadow-2xs"
                  >
                    <span className="truncate">
                      {(() => {
                        const pm = projectManagers.find((u) => u.id === selectedUserId);
                        return pm ? `${pm.name} (${pm.role === 'admin' ? 'Admin' : 'Project Manager'})` : 'Select Lead';
                      })()}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[--radix-dropdown-menu-trigger-width] max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-xl z-50 text-xs"
                >
                  {projectManagers.map((pm) => (
                    <DropdownMenuItem
                      key={pm.id}
                      onClick={() => setSelectedUserId(pm.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                        selectedUserId === pm.id
                          ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]'
                          : 'text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{pm.name}</span>
                        <span className="text-[10px] opacity-70">
                          ({pm.role === 'admin' ? 'Admin' : 'Project Manager'})
                        </span>
                      </div>
                      {selectedUserId === pm.id && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Row 4b: Assign Team Members */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-medium text-slate-800 dark:text-[#DEE4EA]">
                Assign Team Members
              </label>
              <span className="text-[11px] text-slate-500 dark:text-[#9FADBC]">
                {selectedMemberIds.length} member{selectedMemberIds.length === 1 ? '' : 's'} assigned
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full h-9.5 flex items-center justify-between rounded-lg border border-dashed border-slate-300 dark:border-[#333C44] bg-slate-50/50 dark:bg-[#22272B]/50 px-3.5 text-xs text-slate-600 dark:text-[#9FADBC] hover:border-[#0C66E4] hover:text-[#0C66E4] dark:hover:border-[#579DFF] dark:hover:text-[#579DFF] transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Select team members for this project...</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-xl z-50 text-xs"
              >
                {allUsers.map((u) => {
                  const isSelected = selectedMemberIds.includes(u.id);
                  return (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMemberIds((prev) =>
                          prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                        );
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]'
                          : 'text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: u.color || '#0C66E4' }}
                        >
                          {u.avatar || u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#738496] truncate">{u.email}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Selected Member Chips */}
            {selectedMemberIds.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {selectedMemberIds.map((id) => {
                  const u = allUsers.find((user) => user.id === id);
                  if (!u) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-[#22272B] text-slate-800 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]"
                    >
                      <span
                        className="h-4.5 w-4.5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ backgroundColor: u.color || '#0C66E4' }}
                      >
                        {u.avatar || u.name?.[0]?.toUpperCase()}
                      </span>
                      <span className="font-medium text-[11px]">{u.name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMemberIds((prev) => prev.filter((mid) => mid !== id))}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white ml-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Row 5: Budget & Estimated Hours (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
                Budget
              </label>
              <input
                type="text"
                placeholder="Enter Project Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-9.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
                Estimated Hours
              </label>
              <input
                type="text"
                placeholder="Enter Project Estimated Hours"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full h-9.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition"
              />
            </div>
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] p-3 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition resize-none"
            />
          </div>

          {/* Row 7: Tag */}
          <div>
            <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
              Tag
            </label>
            <input
              type="text"
              placeholder="Enter Project Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full h-9.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition"
            />
          </div>

          {/* Row 8: Status */}
          <div>
            <label className="block font-medium text-slate-800 dark:text-[#DEE4EA] mb-1.5">
              Status
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full h-9.5 flex items-center justify-between rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] hover:border-slate-300 dark:hover:border-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#579DFF] transition cursor-pointer text-left shadow-2xs"
                >
                  <span className="capitalize">
                    {status.replace('_', ' ')}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-xl z-50 text-xs"
              >
                {[
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'on_hold', label: 'On Hold' },
                  { id: 'complete', label: 'Complete' },
                  { id: 'cancelled', label: 'Cancelled' },
                ].map((opt) => (
                  <DropdownMenuItem
                    key={opt.id}
                    onClick={() => setStatus(opt.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                      status === opt.id
                        ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]'
                        : 'text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {status === opt.id && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Footer Action Buttons - Fixed / Non-scrollable */}
          <div className="flex items-center justify-end gap-3 px-6 sm:px-7 py-3.5 border-t border-slate-100 dark:border-[#282E33]/70 bg-white dark:bg-[#161A1D] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#282E33] dark:hover:bg-[#333C44] text-slate-700 dark:text-[#DEE4EA] text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
