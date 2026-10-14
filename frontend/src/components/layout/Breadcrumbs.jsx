import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="hidden sm:flex items-center text-xs font-medium text-slate-500">
      <Link to="/kanban" className="hover:text-slate-800 dark:hover:text-slate-200">
        Workspace
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formatted = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-slate-400" />
            {isLast ? (
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{formatted}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-800 dark:hover:text-slate-200">
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
