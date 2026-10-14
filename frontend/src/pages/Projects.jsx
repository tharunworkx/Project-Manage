import React from 'react';
import { ManageProjectsView } from '../components/projects/ManageProjectsView';

export default function Projects() {
  return (
    <div className="flex-1 overflow-y-auto">
      <ManageProjectsView />
    </div>
  );
}
