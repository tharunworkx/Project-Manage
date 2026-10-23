import React from 'react';
import { Modal } from '../ui/Modal';
import { TaskForm } from './TaskForm';

export function TaskDialog({ isOpen, onClose, onSubmit, initialData, title }) {
  const isEditing = Boolean(initialData?.id);
  const dialogTitle = title || (isEditing ? 'Edit Task' : 'Create Task');
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTitle}
      maxWidth="max-w-xl"
    >
      <TaskForm
        initialData={initialData}
        onCancel={onClose}
        onSubmit={(data) => {
          onSubmit(data);
          onClose();
        }}
      />
    </Modal>
  );
}
