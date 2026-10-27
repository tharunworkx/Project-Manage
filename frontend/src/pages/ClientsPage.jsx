import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Briefcase,
  Users2,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  UserX,
  UserCheck2,
  Mail,
  Phone,
  X,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { clientService } from '../services/clientService';
import { useProjects } from '../hooks/useProjects';
import { useAuthContext } from '../context/AuthContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';

export default function ClientsPage() {
  const { isAdmin, isProjectManager, isTeamMember, user } = useAuthContext();
  const { projects = [] } = useProjects();
  const [clients, setClients] = useState(() => clientService.getClients());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Inline Add Form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Inline name editing state (matching Employee accounts inline edit)
  const [editingClientId, setEditingClientId] = useState(null);
  const [editName, setEditName] = useState('');

  // Full Edit Modal state
  const [fullEditModalClient, setFullEditModalClient] = useState(null);
  const [fullEditForm, setFullEditForm] = useState({
    name: '',
    contact_person: '',
    company: '',
    email: '',
    phone: '',
    status: 'Active',
  });

  const refreshClients = () => {
    setClients(clientService.getClients());
  };

  useEffect(() => {
    clientService.fetchClientsFromRemote().then((remote) => {
      if (Array.isArray(remote) && remote.length > 0) {
        setClients(remote);
      }
    });
    const handleUpdate = () => refreshClients();
    window.addEventListener('taskflow_clients_updated', handleUpdate);
    return () => window.removeEventListener('taskflow_clients_updated', handleUpdate);
  }, []);

  const handleToggleStatus = async (clientId) => {
    const target = clients.find((c) => c.id === clientId);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Deactivated' : 'Active';
    await clientService.updateClient(clientId, { status: nextStatus });
    refreshClients();
    toast.success(`Client "${target.name}" is now ${nextStatus}`);
  };

  const handleSaveInlineEdit = async (clientId) => {
    if (!editName.trim()) return;
    await clientService.updateClient(clientId, { name: editName.trim() });
    refreshClients();
    setEditingClientId(null);
    setEditName('');
    toast.success('Client name updated');
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      toast.error('Client name is required');
      return;
    }

    try {
      await clientService.addClient({
        name: newClientName.trim(),
        contact_person: newContactPerson.trim() || newClientName.trim(),
        company: newContactPerson.trim() || newClientName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        status: 'Active',
      });
      toast.success(`Client "${newClientName}" created successfully`);
      setNewClientName('');
      setNewContactPerson('');
      setNewEmail('');
      setNewPhone('');
      setIsAddOpen(false);
      refreshClients();
    } catch (err) {
      toast.error(err.message || 'Failed to create client');
    }
  };

  const openFullEditModal = (client) => {
    setFullEditModalClient(client);
    setFullEditForm({
      name: client.name || '',
      contact_person: client.contact_person || client.company || client.name || '',
      company: client.contact_person || client.company || client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'Active',
    });
  };

  const handleSaveFullEdit = async (e) => {
    e.preventDefault();
    if (!fullEditForm.name.trim()) {
      toast.error('Client name is required');
      return;
    }
    await clientService.updateClient(fullEditModalClient.id, {
      name: fullEditForm.name.trim(),
      contact_person: (fullEditForm.contact_person || fullEditForm.company || fullEditForm.name).trim(),
      company: (fullEditForm.contact_person || fullEditForm.company || fullEditForm.name).trim(),
      email: fullEditForm.email.trim(),
      phone: fullEditForm.phone.trim(),
      status: fullEditForm.status,
    });
    refreshClients();
    setFullEditModalClient(null);
    toast.success(`Client "${fullEditForm.name}" updated successfully`);
  };

  const [clientToDelete, setClientToDelete] = useState(null);

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
  };

  const getClientProjectCount = (clientName) => {
    return projects.filter(
      (p) => p.client && p.client.toLowerCase() === clientName.toLowerCase()
    ).length;
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
        (c.phone && c.phone.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'Active' && c.status === 'Active') ||
        (statusFilter === 'Deactivated' && (c.status === 'Deactivated' || c.status === 'Inactive'));

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const activeCount = clients.filter((c) => c.status === 'Active').length;
  const deactivatedCount = clients.filter(
    (c) => c.status === 'Deactivated' || c.status === 'Inactive'
  ).length;

  const CLIENT_COLORS = ['#0C66E4', '#7C3AED', '#0284C7', '#10B981', '#F59E0B', '#EC4899'];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full select-none">
      {/* Header exactly matching Employee Accounts & Roles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shrink-0">
              <Building2 className="h-5 w-5 stroke-[1.8]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
              Client Management
            </h1>
          </div>
        </div>

        {!isTeamMember && (
          <Button
            onClick={() => setIsAddOpen(true)}
            className="gap-2 bg-[#0C66E4] hover:bg-[#0055CC] text-white shadow-xs cursor-pointer self-start sm:self-center"
          >
            <Plus className="h-4 w-4 stroke-[2.2]" />
            <span>Add Client Organization</span>
          </Button>
        )}
      </div>

      {/* 3 Summary Cards exactly matching Employee Accounts & Roles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Active Clients */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Active' ? 'all' : 'Active')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            statusFilter === 'Active'
              ? 'border-slate-400 dark:border-[#579DFF] ring-2 ring-slate-300 dark:ring-[#579DFF]/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-slate-300 dark:hover:border-[#333C44]'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Active Clients
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {activeCount}
              </p>
              <span className="text-xs text-slate-500 dark:text-[#9FADBC] font-medium">
                Active partners
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shadow-xs">
            <Building2 className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 2: Deactivated Clients */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Deactivated' ? 'all' : 'Deactivated')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            statusFilter === 'Deactivated'
              ? 'border-slate-400 dark:border-[#579DFF] ring-2 ring-slate-300 dark:ring-[#579DFF]/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-slate-300 dark:hover:border-[#333C44]'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Deactivated Clients
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {deactivatedCount}
              </p>
              <span className="text-xs text-slate-500 dark:text-[#9FADBC] font-medium">
                Paused accounts
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shadow-xs">
            <UserX className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 3: Total Client Accounts */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            statusFilter === 'all'
              ? 'border-slate-400 dark:border-[#579DFF] ring-2 ring-slate-300 dark:ring-[#579DFF]/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-slate-300 dark:hover:border-[#333C44]'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Total Organizations
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {clients.length}
              </p>
              <span className="text-xs text-slate-500 dark:text-[#9FADBC] font-medium">
                {projects.length} linked projects
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shadow-xs">
            <Briefcase className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>
      </div>

      {/* Add / Create Client Banner Form (matching UserManagement invite banner) */}
      {isAddOpen && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-4 animate-in fade-in-0 duration-150">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF]" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-[#DEE4EA]">
              Create New Client Organization
            </h3>
          </div>
          <form onSubmit={handleCreateClient} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input
              type="text"
              required
              placeholder="Client / Organization Name *"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Contact Person (e.g. John Doe)"
              value={newContactPerson}
              onChange={(e) => setNewContactPerson(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
            <input
              type="email"
              placeholder="Billing / Work Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Phone (e.g. +1 555-0199)"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 h-9 text-xs bg-[#0C66E4] hover:bg-[#0055CC] text-white cursor-pointer"
              >
                Create Client
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="h-9 text-xs cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Table Card exactly matching Employee Accounts & Roles */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-[#282E33] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search client accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-xl border border-black dark:border-white bg-slate-50 dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#22272B] text-slate-600 dark:text-[#9FADBC] hover:text-slate-900 transition cursor-pointer"
              >
                Clear filter ({statusFilter})
              </button>
            )}
            <span className="text-xs text-slate-500 dark:text-[#738496]">
              {filteredClients.length} client accounts
            </span>
          </div>
        </div>

        <Table className="w-full table-fixed" aria-label="Client Accounts Table">
          <TableHeader>
            <TableHead id="client" isRowHeader className="w-[21%] min-w-0 px-3.5">Client / Organization</TableHead>
            <TableHead id="contact" className="w-[16%] min-w-0 px-3.5">Contact Person</TableHead>
            <TableHead id="email" className="w-[17%] min-w-0 px-3.5">Work Email</TableHead>
            <TableHead id="phone" className="w-[14%] min-w-0 px-3.5">Phone</TableHead>
            <TableHead id="projects" className="w-[13%] min-w-[110px] px-3.5">Active Projects</TableHead>
            <TableHead id="status" className="w-[13%] min-w-[125px] px-3.5">Account Status</TableHead>
            {!isTeamMember && <TableHead id="actions" className="w-[6%] min-w-[60px] text-right pr-4">Actions</TableHead>}
          </TableHeader>
          <TableBody>
            {filteredClients.map((client, idx) => {
              const projectCount = getClientProjectCount(client.name);
              const avatarColor = CLIENT_COLORS[idx % CLIENT_COLORS.length];
              const initials = client.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'CL';

              return (
                <TableRow key={client.id} id={client.id}>
                  {/* Cell 1: Client Avatar + Name + inline edit */}
                  <TableCell className="px-3.5 py-3 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-8.5 w-8.5 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        {editingClientId === client.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-7 px-2 text-xs rounded border border-[#0C66E4] bg-white dark:bg-[#22272B] text-slate-900 dark:text-[#DEE4EA] w-full"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveInlineEdit(client.id)}
                              className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer shrink-0"
                              title="Save"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingClientId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                              title="Cancel"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-[#DEE4EA] truncate block" title={client.name}>
                              {client.name}
                            </span>
                            {!isTeamMember && (
                              <button
                                onClick={() => {
                                  setEditingClientId(client.id);
                                  setEditName(client.name);
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-slate-400 hover:text-slate-700 dark:hover:text-[#DEE4EA] p-0.5 cursor-pointer shrink-0"
                                title="Edit client name inline"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Cell 2: Contact Person */}
                  <TableCell className="px-3.5 py-3 text-slate-700 dark:text-[#DEE4EA] font-medium min-w-0 overflow-hidden">
                    <span className="truncate block" title={client.contact_person || client.company || client.name}>
                      {client.contact_person || client.company || client.name}
                    </span>
                  </TableCell>

                  {/* Cell 3: Work Email */}
                  <TableCell className="px-3.5 py-3 text-slate-600 dark:text-[#9FADBC] min-w-0 overflow-hidden">
                    {client.email ? (
                      <a
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-1.5 text-blue-600 dark:text-[#579DFF] hover:underline min-w-0 truncate"
                        title={client.email}
                      >
                        <Mail className="h-3.5 w-3.5 opacity-70 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  {/* Cell 4: Phone */}
                  <TableCell className="px-3.5 py-3 text-slate-600 dark:text-[#9FADBC] min-w-0 overflow-hidden">
                    {client.phone ? (
                      <span className="flex items-center gap-1.5 min-w-0 truncate" title={client.phone}>
                        <Phone className="h-3.5 w-3.5 opacity-70 shrink-0" />
                        <span className="truncate">{client.phone}</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  {/* Cell 5: Active Projects Badge (matching UserManagement role badge) */}
                  <TableCell className="px-3.5 py-3 min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44] whitespace-nowrap shrink-0">
                      <Briefcase className="h-3.5 w-3.5 stroke-[1.8]" />
                      <span>{projectCount} Projects</span>
                    </span>
                  </TableCell>

                  {/* Cell 6: Account Status (matching UserManagement status badge) */}
                  <TableCell className="px-3.5 py-3 min-w-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                        client.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                      <span>{client.status}</span>
                    </span>
                  </TableCell>

                  {/* Cell 7: Actions 3-dot dropdown matching UserManagement */}
                  {!isTeamMember && (
                    <TableCell className="px-3.5 py-3 text-right pr-4 min-w-0">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition cursor-pointer shrink-0"
                              title="Client actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1.5 shadow-xl text-xs z-50"
                          >
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(client.id)}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA] font-medium"
                            >
                              {client.status === 'Active' ? (
                                <>
                                  <UserX className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck2 className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client)}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {filteredClients.length === 0 && (
              <TableRow id="empty-row">
                <TableCell colSpan={isTeamMember ? 6 : 7} className="py-12 text-center text-slate-400 dark:text-[#738496]">
                  {isTeamMember
                    ? 'No client accounts found matching your search.'
                    : 'No client accounts found matching your search. Click "+ Add Client Organization" to create one.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Full Client Modal */}
      {fullEditModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-in fade-in-0 duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-6 text-slate-900 dark:text-[#DEE4EA] shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282E33] mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-[#0C66E4] dark:text-[#579DFF]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA]">
                  Edit Client Organization
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFullEditModalClient(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-[#DEE4EA] transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFullEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1">
                  Client / Organization Name *
                </label>
                <input
                  required
                  autoFocus
                  type="text"
                  value={fullEditForm.name}
                  onChange={(e) => setFullEditForm({ ...fullEditForm, name: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] px-3 text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  value={fullEditForm.contact_person || fullEditForm.company || ''}
                  onChange={(e) =>
                    setFullEditForm({
                      ...fullEditForm,
                      contact_person: e.target.value,
                      company: e.target.value,
                    })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] px-3 text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1">
                  Work / Billing Email
                </label>
                <input
                  type="email"
                  value={fullEditForm.email}
                  onChange={(e) => setFullEditForm({ ...fullEditForm, email: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] px-3 text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={fullEditForm.phone}
                  onChange={(e) => setFullEditForm({ ...fullEditForm, phone: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] px-3 text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1">
                  Account Status
                </label>
                <Select
                  value={fullEditForm.status}
                  onChange={(e) => setFullEditForm({ ...fullEditForm, status: e.target.value })}
                  className="w-full h-9"
                >
                  <option value="Active">Active</option>
                  <option value="Deactivated">Deactivated</option>
                </Select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#282E33]">
                <button
                  type="button"
                  onClick={() => setFullEditModalClient(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom In-app Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={async () => {
          if (clientToDelete) {
            await clientService.deleteClient(clientToDelete.id);
            refreshClients();
            toast.success(`Client "${clientToDelete.name}" deleted`);
          }
        }}
        title="Delete Client"
        description={`Are you sure you want to permanently delete client "${clientToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Client"
      />
    </div>
  );
}
