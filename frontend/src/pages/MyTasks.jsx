import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { TaskDetailsDrawer } from '../components/tasks/TaskDetailsDrawer';
import { JiraListView } from '../components/kanban/JiraListView';
import { useTasks } from '../hooks/useTasks';

export default function MyTasks() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [drawerTask, setDrawerTask] = useState(null);

  return (
    <div className="w-full p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">My Tasks</h1>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">View and organize all tasks assigned to your queue.</p>
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
          task={drawerTask}
          onClose={() => setDrawerTask(null)}
          onUpdate={(updates) => {
            updateTask({ id: drawerTask.id, updates });
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
        onSubmit={(data) => {
          createTask(data);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
