// Client Management Service with LocalStorage persistence and event synchronization

const CLIENTS_STORAGE_KEY = 'taskflow_clients_v1';

export const INITIAL_CLIENTS = [
  {
    id: 'cli-1',
    name: 'Southern Rescue Services',
    company: 'Southern Rescue Services',
    email: 'contact@southernrescue.org',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    createdAt: '2026-01-15',
  },
  {
    id: 'cli-2',
    name: 'Acme Corporation',
    company: 'Acme Corporation',
    email: 'billing@acme.corp',
    phone: '+1 (555) 987-6543',
    status: 'Active',
    createdAt: '2026-02-10',
  },
  {
    id: 'cli-3',
    name: 'Stripe Payments',
    company: 'Stripe Payments',
    email: 'enterprise@stripe.com',
    phone: '+1 (555) 345-6789',
    status: 'Active',
    createdAt: '2026-03-01',
  },
  {
    id: 'cli-4',
    name: 'Global Dynamics',
    company: 'Global Dynamics Inc.',
    email: 'partners@globaldynamics.io',
    phone: '+1 (555) 876-5432',
    status: 'Active',
    createdAt: '2026-03-18',
  },
  {
    id: 'cli-5',
    name: 'Taskflow Internal',
    company: 'Taskflow Inc.',
    email: 'ops@taskflow.internal',
    phone: '+1 (555) 456-7890',
    status: 'Active',
    createdAt: '2026-04-05',
  },
];

export const clientService = {
  getClients() {
    try {
      const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    this.saveClients(INITIAL_CLIENTS);
    return INITIAL_CLIENTS;
  },

  saveClients(clients) {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
      window.dispatchEvent(new CustomEvent('taskflow_clients_updated', { detail: clients }));
    } catch {}
  },

  addClient({ name, company, email, phone, status = 'Active' }) {
    if (!name?.trim()) {
      throw new Error('Client name is required.');
    }
    const clients = this.getClients();
    const newClient = {
      id: 'cli-' + Date.now(),
      name: name.trim(),
      company: company?.trim() || name.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      status: status || 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newClient, ...clients];
    this.saveClients(updated);
    return newClient;
  },

  updateClient(id, updates) {
    const clients = this.getClients();
    const updated = clients.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveClients(updated);
    return updated.find((c) => c.id === id);
  },

  deleteClient(id) {
    const clients = this.getClients();
    const updated = clients.filter((c) => c.id !== id);
    this.saveClients(updated);
    return updated;
  },
};

export default clientService;
