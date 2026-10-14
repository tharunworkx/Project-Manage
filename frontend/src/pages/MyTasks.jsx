import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { useTasks } from '../hooks/useTasks';
import { getPriorityColor, formatDate } from '../lib/utils';

export default function MyTasks() {
  const { tasks, createTask, updateTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#DEE4EA]">My Tasks</h1>
          <p className="text-xs text-[#9FADBC] mt-1">View and organize all tasks assigned to your queue.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsDialogOpen(true)}>New Task</Button>
      </div>

      <div className="rounded-2xl border border-[#282E33] bg-[#161A1D] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#22272B] text-[#9FADBC] uppercase font-bold border-b border-[#282E33]">
            <tr>
              <th className="px-5 py-3">Task</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Due Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282E33]">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#22272B]/60 transition">
                <td className="px-5 py-3.5 font-semibold text-[#DEE4EA]">{task.title}</td>
                <td className="px-5 py-3.5 capitalize">{task.status.replace('_', ' ')}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{formatDate(task.due_date)}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => updateTask({ id: task.id, updates: { status: 'done' } })}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(data) => createTask(data)}
      />
    </div>
  );
}
