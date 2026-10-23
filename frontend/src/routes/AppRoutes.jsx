import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import KanbanPage from '../pages/KanbanPage';
import Dashboard from '../pages/Dashboard';
import MyTasks from '../pages/MyTasks';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import CalendarPage from '../pages/CalendarPage';
import CyclesPage from '../pages/CyclesPage';
import ModulesPage from '../pages/ModulesPage';
import ViewsPage from '../pages/ViewsPage';
import PagesPage from '../pages/PagesPage';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Preferences from '../pages/Preferences';
import UserManagement from '../pages/UserManagement';
import TeamMembers from '../pages/TeamMembers';
import ActivityPage from '../pages/ActivityPage';
import NotificationsPage from '../pages/NotificationsPage';
import ClientsPage from '../pages/ClientsPage';
import NotFound from '../pages/NotFound';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import { useAuthContext } from '../context/AuthContext';

function AdminOnlyRoute({ children }) {
  const { isAdmin } = useAuthContext();
  if (!isAdmin) {
    return <Navigate to="/kanban" replace />;
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Default Frontpage lands directly on Kanban Board */}
          <Route path="/" element={<Navigate to="/kanban" replace />} />
          <Route path="/dashboard" element={<Navigate to="/kanban" replace />} />
          <Route path="/board" element={<KanbanPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/cycles" element={<CyclesPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/views" element={<ViewsPage />} />
          <Route path="/pages" element={<PagesPage />} />
          <Route path="/docs" element={<PagesPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/team" element={<TeamMembers />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/users"
            element={
              <AdminOnlyRoute>
                <UserManagement />
              </AdminOnlyRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/preferences" element={<Preferences />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
