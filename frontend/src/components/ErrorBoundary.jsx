import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL APP ERROR CAUGHT BY BOUNDARY:', error, errorInfo);
    this.setState({ error, errorInfo });
    try {
      window.__LAST_APP_ERROR__ = {
        message: error?.message || String(error),
        stack: error?.stack || '',
        componentStack: errorInfo?.componentStack || '',
      };
    } catch (e) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white p-6">
          <div className="max-w-xl w-full bg-slate-800 border border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-lg font-bold">Something went wrong</h2>
            </div>
            <p className="text-xs text-rose-200 font-mono bg-rose-950/60 p-3 rounded-xl border border-rose-900/60 break-words">
              {this.state.error?.message || String(this.state.error)}
            </p>
            {this.state.errorInfo?.componentStack && (
              <pre className="text-[11px] text-slate-300 font-mono bg-slate-950 p-3 rounded-xl max-h-48 overflow-auto whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/kanban';
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Return to Kanban Board
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
