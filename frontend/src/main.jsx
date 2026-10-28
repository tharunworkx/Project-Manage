import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import './styles/animations.css';

// Clean up any legacy pre-stored mock data from local storage
try {
  const keysToClean = [
    'taskflow_projects_v2',
    'taskflow_manage_projects_list_v4',
    'taskflow_jira_board_tasks_v2',
    'taskflow_tasks_cache_v5',
    'taskflow_clients_v2',
    'taskflow_notifications_v1',
    'taskflow_global_activities_v2',
    'taskflow_events_v1',
  ];
  const isMock = (id) => {
    if (!id) return false;
    const s = String(id).toLowerCase();
    return (
      s.startsWith('srs-') ||
      s.startsWith('acme-') ||
      s.startsWith('mob-') ||
      s.startsWith('proj-1') ||
      s.startsWith('proj-2') ||
      s.startsWith('proj-3') ||
      s.startsWith('cli-') ||
      s.startsWith('notif-') ||
      s.startsWith('00000000-0000-0000-0001-')
    );
  };
  keysToClean.forEach((k) => {
    const raw = localStorage.getItem(k);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((item) => !isMock(item?.id));
          localStorage.setItem(k, JSON.stringify(cleaned));
        }
      } catch {}
    }
  });
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
