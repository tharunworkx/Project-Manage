// Client Management Service with Supabase database persistence and local cache fallback
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const CLIENTS_STORAGE_KEY = 'taskflow_clients_v2';

export const INITIAL_CLIENTS = [];

function mapRemoteClient(rc) {
  const contactPerson = rc.contact_person || rc.company || rc.name || '';
  return {
    id: rc.id,
    name: rc.name || 'Unnamed Client',
    contact_person: contactPerson,
    company: contactPerson,
    email: rc.email || '',
    phone: rc.phone || '',
    status: rc.status
      ? rc.status.charAt(0).toUpperCase() + rc.status.slice(1).toLowerCase()
      : 'Active',
    createdAt: rc.created_at ? rc.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export const clientService = {
  getClients() {
    try {
      const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((c) => !c.id?.toString().startsWith('cli-'));
        }
      }
    } catch {}
    return [];
  },

  saveClients(clients) {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
      window.dispatchEvent(new CustomEvent('taskflow_clients_updated', { detail: clients }));
    } catch {}
  },

  async fetchClientsFromRemote() {
    if (!isSupabaseConfigured) {
      return this.getClients();
    }
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch clients error:', error);
        return this.getClients();
      }

      if (Array.isArray(data)) {
        const mapped = data.map(mapRemoteClient);
        this.saveClients(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Error fetching clients from Supabase:', err);
      return this.getClients();
    }
  },

  async addClient({ name, contact_person, company, email, phone, status = 'Active' }) {
    if (!name?.trim()) {
      throw new Error('Client name is required.');
    }
    const trimmedName = name.trim();
    const contactPersonVal = (contact_person || company || trimmedName).trim();
    const emailVal = email?.trim() || '';
    const phoneVal = phone?.trim() || '';
    const statusVal = status || 'Active';

    let remoteClient = null;
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert([
            {
              name: trimmedName,
              contact_person: contactPersonVal,
              email: emailVal || null,
              phone: phoneVal || null,
              status: statusVal.toLowerCase(),
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert client error:', error);
          throw new Error('Supabase client creation failed: ' + error.message);
        } else if (data) {
          remoteClient = mapRemoteClient(data);
        }
      } catch (e) {
        console.error('Supabase insert client error:', e);
        throw e;
      }
    }

    const newClient = remoteClient || {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0'),
      name: trimmedName,
      contact_person: contactPersonVal,
      company: contactPersonVal,
      email: emailVal,
      phone: phoneVal,
      status: statusVal,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const clients = this.getClients();
    const updated = [
      newClient,
      ...clients.filter((c) => c.id !== newClient.id && c.name !== newClient.name),
    ];
    this.saveClients(updated);
    return newClient;
  },

  async updateClient(id, updates) {
    const clients = this.getClients();
    const target = clients.find((c) => c.id === id);
    if (!target) return null;

    const contactPersonVal =
      updates.contact_person !== undefined
        ? updates.contact_person
        : updates.company !== undefined
        ? updates.company
        : target.contact_person;

    const merged = {
      ...target,
      ...updates,
      contact_person: contactPersonVal,
      company: contactPersonVal,
    };

    if (isSupabaseConfigured && id && !id.startsWith('cli-')) {
      try {
        const payload = {};
        if (updates.name !== undefined) payload.name = updates.name.trim();
        if (contactPersonVal !== undefined) payload.contact_person = contactPersonVal;
        if (updates.email !== undefined) payload.email = updates.email.trim() || null;
        if (updates.phone !== undefined) payload.phone = updates.phone.trim() || null;
        if (updates.status !== undefined) payload.status = updates.status.toLowerCase();

        const { error } = await supabase.from('clients').update(payload).eq('id', id);
        if (error) {
          console.error('Supabase update client error:', error);
          throw new Error('Supabase client update failed: ' + error.message);
        }
      } catch (e) {
        console.error('Supabase update client error:', e);
        throw e;
      }
    }

    const updated = clients.map((c) => (c.id === id ? merged : c));
    this.saveClients(updated);
    return merged;
  },

  async deleteClient(id) {
    if (isSupabaseConfigured && id && !id.startsWith('cli-')) {
      try {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete client error:', error);
          throw new Error('Supabase client delete failed: ' + error.message);
        }
      } catch (e) {
        console.error('Supabase delete client error:', e);
        throw e;
      }
    }
    const clients = this.getClients();
    const updated = clients.filter((c) => c.id !== id);
    this.saveClients(updated);
    return updated;
  },
};

export default clientService;
