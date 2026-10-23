import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { TaskDetailsDrawer } from '../components/tasks/TaskDetailsDrawer';
import { JiraListView } from '../components/kanban/JiraListView';
import { useTasks } from '../hooks/useTasks';
import { useWorkspaceContext } from '../context/WorkspaceContext';

export default function MyTasks() {
  const { currentWorkspace } = useWorkspaceContext();
  const { tasks, createTask, updateTask, deleteTask } = useTasks(null, currentWorkspace?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [drawerTask, setDrawerTask] = useState(null);

  return (
    <div className="w-full p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">All Tasks</h1>
        </div>
        <Button icon={Plus} onClick={() => setIsDialogOpen(true)}>New Task</Button>
      </div>

      <div className="w-full">
        <JiraListView
          tasks={tasks}
          onTaskUpdate={({ id, updates }) => updateTask({ id, updates })}
          onTaskCreate={() => setIsDialogOpen(true)}
          onTaskDelete={(taskId) => deleteTask(taskId)}
          onSelectTask={(task) => setDrawerTask(task)}
        />
      </div>

      {drawerTask && (
        <TaskDetailsDrawer
          isOpen={true}
          task={drawerTask}
          onClose={() => setDrawerTask(null)}
          onUpdate={(arg1, arg2) => {
            const updates = (typeof arg1 === 'object' && arg1 !== null) ? arg1 : arg2 || {};
            const id = (typeof arg1 === 'string' || typeof arg1 === 'number') ? arg1 : drawerTask.id;
            updateTask({ id, updates });
            setDrawerTask((prev) => (prev ? { ...prev, ...updates } : null));
          }}
          onDelete={(id) => {
            deleteTask(id);
            setDrawerTask(null);
          }}
        />
      )}

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (data) => {
          await createTask({
            workspace_id: currentWorkspace?.id,
            ...data,
          });
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
