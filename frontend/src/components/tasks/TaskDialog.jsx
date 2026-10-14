import React from 'react';
import { Modal } from '../ui/Modal';
import { TaskForm } from './TaskForm';

export function TaskDialog({ isOpen, onClose, onSubmit, initialData }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Create New Task'}
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
