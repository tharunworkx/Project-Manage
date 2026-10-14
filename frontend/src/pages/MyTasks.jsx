import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { useTasks } from '../hooks/useTasks';
import { getPriorityColor, formatDate } from '../lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function MyTasks() {
  const { tasks, createTask, updateTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">My Tasks</h1>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">View and organize all tasks assigned to your queue.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsDialogOpen(true)}>New Task</Button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] overflow-hidden shadow-xs">
        <Table aria-label="My Tasks Table">
          <TableHeader>
            <TableRow>
              <TableHead id="task">Task</TableHead>
              <TableHead id="status">Status</TableHead>
              <TableHead id="priority">Priority</TableHead>
              <TableHead id="dueDate">Due Date</TableHead>
              <TableHead id="actions" className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} id={task.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-[#DEE4EA]">
                  {task.title}
                </TableCell>
                <TableCell className="capitalize text-slate-600 dark:text-[#9FADBC]">
                  {task.status.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 dark:text-[#738496]">
                  {formatDate(task.due_date)}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => updateTask({ id: task.id, updates: { status: 'done' } })}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer text-xs"
                  >
                    Complete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(data) => createTask(data)}
      />
    </div>
  );
}
