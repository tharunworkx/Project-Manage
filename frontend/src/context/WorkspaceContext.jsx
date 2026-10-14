import React, { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext(null);

const DEFAULT_WORKSPACE = {
  id: 'ws-default',
  name: 'Acme Product Studio',
  slug: 'acme-studio',
  role: 'owner',
};

export function WorkspaceProvider({ children }) {
  const [workspaces] = useState([
    DEFAULT_WORKSPACE,
    { id: 'ws-2', name: 'Mobile App Labs', slug: 'mobile-labs', role: 'member' },
  ]);
  const [currentWorkspace, setCurrentWorkspace] = useState(DEFAULT_WORKSPACE);

  return (
    <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, setCurrentWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  return context;
}
