import React from 'react';
import { Plus } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export function ProjectMembers({ members = [] }) {
  const sampleMembers = [
    { id: 1, name: 'Sarah Miller', role: 'Lead Designer' },
    { id: 2, name: 'David Zhang', role: 'Frontend Engineer' },
    { id: 3, name: 'Elena Rostova', role: 'Product Manager' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Project Members</h3>
        <Button size="sm" variant="outline" icon={Plus}>Invite</Button>
      </div>
      <div className="space-y-3">
        {sampleMembers.map((m) => (
          <div key={m.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={m.name} size="sm" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{m.name}</p>
                <p className="text-[11px] text-slate-400">{m.role}</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}
