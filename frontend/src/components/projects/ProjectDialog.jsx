import React from 'react';
import { Modal } from '../ui/Modal';
import { ProjectForm } from './ProjectForm';

export function ProjectDialog({ isOpen, onClose, onSubmit, initialData }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Create New Project'}
    >
      <ProjectForm
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
