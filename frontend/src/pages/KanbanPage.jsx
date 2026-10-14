import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceHeader } from '../components/layout/SpaceHeader';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { useTasks } from '../hooks/useTasks';
import { CheckSquare, Bookmark, Bug, GitBranch, GitPullRequest, FileText, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { ManageProjectsView } from '../components/projects/ManageProjectsView';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function KanbanPage() {
  const [activeTab, setActiveTab] = useState('board');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, updateTask, createTask, deleteTask } = useTasks('p1');

  const handleCreateSubmit = (data) => {
    createTask({
      ...data,
      project_id: 'p1',
    });
    setDialogOpen(false);
  };

  const handleEditSubmit = (data) => {
    if (editingTask) {
      updateTask({ id: editingTask.id, updates: data });
      setEditingTask(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#101214] text-slate-900 dark:text-[#DEE4EA] transition-colors duration-150">
      {/* Jira Space Header & Tabs */}
      <SpaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0.35, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="h-full"
        >
          {/* Projects View */}
          {activeTab === 'projects' && (
            <ManageProjectsView />
          )}

          {activeTab === 'board' && (
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={(taskId, updates) => updateTask({ id: taskId, updates })}
            onTaskCreate={(data) => createTask({ ...data, project_id: 'p1' })}
            onTaskDelete={(taskId) => deleteTask(taskId)}
            onEditTask={(task) => setEditingTask(task)}
          />
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="w-full py-4 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#DEE4EA]">Project Summary</h2>
              <p className="text-xs text-slate-500 dark:text-[#9FADBC]">High-level status and performance for My Software Team</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">Total Issues</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-[#DEE4EA] mt-1">{tasks.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">In Progress</span>
                <p className="text-2xl font-bold text-[#0C66E4] dark:text-[#579DFF] mt-1">
                  {tasks.filter((t) => t.status === 'in_progress').length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">Completed</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-[#4BCE97] mt-1">
                  {tasks.filter((t) => t.status === 'done').length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">Sprint Health</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-[#4BCE97] mt-1">100%</p>
              </div>
            </div>
          </div>
        )}

        {/* List Tab */}
        {activeTab === 'list' && (
          <div className="py-4 w-full">
            <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] overflow-hidden shadow-xs">
              <Table aria-label="Kanban Tasks List">
                <TableHeader>
                  <TableRow>
                    <TableHead id="key">Key</TableHead>
                    <TableHead id="summary">Summary</TableHead>
                    <TableHead id="status">Status</TableHead>
                    <TableHead id="dueDate">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((t) => (
                    <TableRow key={t.id} id={t.id}>
                      <TableCell className="text-[#0C66E4] dark:text-[#579DFF] font-semibold">
                        {t.key || `KAN-${t.id}`}
                      </TableCell>
                      <TableCell className="text-slate-900 dark:text-[#DEE4EA] font-medium">
                        {t.title}
                      </TableCell>
                      <TableCell className="capitalize text-slate-600 dark:text-[#9FADBC]">
                        {t.status.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-[#9FADBC]">
                        {formatDate(t.due_date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className="py-8 text-center max-w-md mx-auto">
            <FileText className="h-10 w-10 text-[#738496] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#DEE4EA]">Team Documentation</h3>
            <p className="text-xs text-[#9FADBC] mt-1">
              Create product specs, architectural RFCs, and meeting notes directly linked to Jira issues.
            </p>
          </div>
        )}

        {/* Development Tab */}
        {activeTab === 'development' && (
          <div className="py-8 text-center max-w-md mx-auto">
            <GitBranch className="h-10 w-10 text-[#738496] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#DEE4EA]">Development Integrations</h3>
            <p className="text-xs text-[#9FADBC] mt-1">
              Connect GitHub or GitLab repositories to track branches, PRs, and deployments per issue key (e.g. KAN-1).
            </p>
          </div>
        )}
          </motion.div>
      </div>

      {/* Create / Edit Dialog */}
      <TaskDialog
        isOpen={dialogOpen || !!editingTask}
        initialData={editingTask}
        onClose={() => {
          setDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditSubmit : handleCreateSubmit}
      />
    </div>
  );
}
