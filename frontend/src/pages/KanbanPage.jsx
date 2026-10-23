import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceHeader } from '../components/layout/SpaceHeader';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { TaskDetailsDrawer } from '../components/tasks/TaskDetailsDrawer';
import { JiraListView } from '../components/kanban/JiraListView';
import { JiraSummaryView } from '../components/kanban/JiraSummaryView';
import { useTasks } from '../hooks/useTasks';
import {
  Bookmark,
  Bug,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  FileText,
  CalendarRange,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { ManageProjectsView } from '../components/projects/ManageProjectsView';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { useAuthContext } from '../context/AuthContext';
import { activityService } from '../services/activityService';

export default function KanbanPage() {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useAuthContext();
  const userName = user?.name || 'Tharun R';

  const [activeTab, setActiveTab] = useState('board');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [drawerTask, setDrawerTask] = useState(null);

  const { tasks, updateTask, createTask, deleteTask } = useTasks(null, currentWorkspace?.id);

  const handleCreateSubmit = async (data) => {
    const created = await createTask({
      ...data,
      workspace_id: currentWorkspace?.id || 'ws-1',
    });
    const statusLabel =
      (created?.status || data.status) === 'done'
        ? 'Done'
        : (created?.status || data.status) === 'in_progress'
        ? 'In Progress'
        : (created?.status || data.status) === 'in_review'
        ? 'Review'
        : 'To Do';

    activityService.logActivity(currentWorkspace?.id, {
      user: userName,
      action: 'created',
      task: created || data,
      taskKey: created?.key || data.key || 'TASK',
      taskTitle: created?.title || data.title,
      statusLabel,
    });
    setDialogOpen(false);
  };

  const handleEditSubmit = async (data) => {
    if (editingTask) {
      await updateTask({ id: editingTask.id, updates: data });
      const statusLabel =
        (data.status || editingTask.status) === 'done'
          ? 'Done'
          : (data.status || editingTask.status) === 'in_progress'
          ? 'In Progress'
          : (data.status || editingTask.status) === 'in_review'
          ? 'Review'
          : 'To Do';

      activityService.logActivity(currentWorkspace?.id, {
        user: userName,
        action: data.status && data.status !== editingTask.status ? 'updated field' : 'updated',
        targetField: data.status && data.status !== editingTask.status ? 'status' : null,
        task: { ...editingTask, ...data },
        taskKey: editingTask.key || 'TASK',
        taskTitle: data.title || editingTask.title,
        statusLabel,
      });
      setEditingTask(null);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    const existing = tasks.find((t) => t.id === taskId);
    await updateTask({ id: taskId, updates });
    if (existing && currentWorkspace?.id) {
      const statusLabel =
        (updates.status || existing.status) === 'done'
          ? 'Done'
          : (updates.status || existing.status) === 'in_progress'
          ? 'In Progress'
          : (updates.status || existing.status) === 'in_review'
          ? 'Review'
          : 'To Do';

      if (updates.status && updates.status !== existing.status) {
        activityService.logActivity(currentWorkspace.id, {
          user: userName,
          action: 'updated field',
          targetField: 'status',
          task: { ...existing, ...updates },
          taskKey: existing.key || 'TASK',
          taskTitle: existing.title,
          statusLabel,
        });
      } else if (updates.assignee && updates.assignee !== existing.assignee) {
        activityService.logActivity(currentWorkspace.id, {
          user: userName,
          action: 'changed the Assignee to',
          assignee: updates.assignee,
          task: { ...existing, ...updates },
          taskKey: existing.key || 'TASK',
          taskTitle: existing.title,
          statusLabel,
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#101214] text-slate-900 dark:text-[#DEE4EA] transition-colors duration-150">
      {/* Jira Space Header & Tabs */}
      <SpaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto">
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
            onTaskUpdate={(taskId, updates) => handleTaskUpdate(taskId, updates)}
            onTaskCreate={(data) => handleCreateSubmit(data)}
            onTaskDelete={(taskId) => deleteTask(taskId)}
            onEditTask={(task) => setEditingTask(task)}
          />
        )}

        {/* Summary Tab matching Jira Screenshot */}
        {activeTab === 'summary' && (
          <JiraSummaryView
            tasks={tasks}
            onTabChange={setActiveTab}
            onSelectTask={(task) => setDrawerTask(task)}
            currentWorkspace={currentWorkspace}
          />
        )}

        {/* List Tab */}
        {activeTab === 'list' && (
          <div className="py-4 px-6 sm:px-8 w-full">
            <JiraListView
              tasks={tasks}
              onTaskUpdate={({ id, updates }) => handleTaskUpdate(id, updates)}
              onTaskCreate={() => setDialogOpen(true)}
              onTaskDelete={(taskId) => deleteTask(taskId)}
              onSelectTask={(task) => setDrawerTask(task)}
            />
          </div>
        )}

        {/* Development Tab */}
        {activeTab === 'development' && (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <GitBranch className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA]">Development Integrations</h3>
            <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1.5 leading-relaxed">
              Connect GitHub, GitLab, or Bitbucket repositories to track feature branches, pull requests, and automated build deployments per issue key.
            </p>
          </div>
        )}
          </motion.div>
      </div>

      {/* Task Details Drawer for List View */}
      {drawerTask && (
        <TaskDetailsDrawer
          isOpen={true}
          task={drawerTask}
          onClose={() => setDrawerTask(null)}
          onUpdate={(arg1, arg2) => {
            const updates = (typeof arg1 === 'object' && arg1 !== null) ? arg1 : arg2 || {};
            const id = (typeof arg1 === 'string' || typeof arg1 === 'number') ? arg1 : drawerTask.id;
            handleTaskUpdate(id, updates);
            setDrawerTask((prev) => (prev ? { ...prev, ...updates } : null));
          }}
          onDelete={(id) => {
            deleteTask(id);
            setDrawerTask(null);
          }}
        />
      )}

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
