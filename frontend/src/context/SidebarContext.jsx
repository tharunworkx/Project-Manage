import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  // Static in-dashboard sidebar state (open by default)
  const [isOpen, setIsOpen] = useState(true);
  const [showIconRail, setShowIconRail] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  const toggleIconRail = () => setShowIconRail((prev) => !prev);

  // Keyboard shortcut '[' toggles the static sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '[' &&
        !['INPUT', 'TEXTAREA'].includes(e.target.tagName)
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle,
        close,
        open,
        // Aliases for compatibility
        isDrawerOpen: isOpen,
        setIsDrawerOpen: setIsOpen,
        toggleDrawer: toggle,
        closeDrawer: close,
        openDrawer: open,
        showIconRail,
        setShowIconRail,
        toggleIconRail,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
