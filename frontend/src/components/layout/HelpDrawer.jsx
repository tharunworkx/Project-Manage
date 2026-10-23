import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Lightbulb,
  FileText,
  GraduationCap,
  MessageSquare,
  AlertTriangle,
  MessageCircle,
  Keyboard,
  ExternalLink,
  Send,
  CheckCircle2,
  Star,
  Info,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';

export function HelpDrawer({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'whatsNew' | 'feedback' | 'shortcuts' | 'about' | null
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('general');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (activeModal) {
          setActiveModal(null);
        } else if (isOpen) {
          onClose();
        }
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeModal, onClose]);

  // Click outside to close (ignoring clicks on the trigger button which handled by Topbar)
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isOpen &&
        !activeModal &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        !e.target.closest('#topbar-help-button')
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, activeModal, onClose]);

  const helpItems = [
    {
      id: 'whats-new',
      title: "Find out what’s changed in Jira",
      icon: Lightbulb,
      action: () => setActiveModal('whatsNew'),
      isExternal: false,
      keywords: 'changes new updates release features jira taskora',
    },
    {
      id: 'nav',
      title: 'Read about the new navigation',
      icon: FileText,
      url: 'https://support.atlassian.com/jira-software-cloud/docs/navigate-jira-cloud/',
      isExternal: true,
      keywords: 'navigation sidebar header search browse',
    },
    {
      id: 'docs',
      title: 'Browse complete documentation',
      icon: FileText,
      url: 'https://support.atlassian.com/jira-software-cloud/',
      isExternal: true,
      keywords: 'documentation manual help guide docs',
    },
    {
      id: 'learning',
      title: 'Build skills with Atlassian Learning',
      icon: GraduationCap,
      url: 'https://university.atlassian.com/',
      isExternal: true,
      keywords: 'learning courses training academy skills certificate',
    },
    {
      id: 'community',
      title: 'Ask our Community forums',
      icon: MessageSquare,
      url: 'https://community.atlassian.com/',
      isExternal: true,
      keywords: 'community forums questions discussion questions ask',
    },
    {
      id: 'support',
      title: 'Contact support',
      icon: AlertTriangle,
      url: 'https://support.atlassian.com/contact/',
      isExternal: true,
      keywords: 'support contact help ticket bug issue error problem',
    },
    {
      id: 'feedback',
      title: 'Give feedback about Jira',
      icon: MessageCircle,
      action: () => {
        setFeedbackSubmitted(false);
        setActiveModal('feedback');
      },
      isExternal: false,
      keywords: 'feedback rate review suggest opinion report',
    },
    {
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      icon: Keyboard,
      action: () => setActiveModal('shortcuts'),
      isExternal: false,
      keywords: 'keyboard shortcuts hotkeys keys commands quick',
    },
    {
      id: 'mobile',
      title: 'Get Jira Mobile',
      icon: Send,
      url: 'https://www.atlassian.com/software/jira/mobile-app',
      isExternal: true,
      keywords: 'mobile app ios android download phone',
    },
  ];

  const filteredItems = helpItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    );
  });

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setActiveModal(null);
      setFeedbackText('');
      setFeedbackSubmitted(false);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Drawer Overlay (semi-transparent backdrop on small screens) */}
      <div
        className="fixed inset-0 top-14 bg-black/30 dark:bg-black/50 backdrop-blur-2xs z-40 transition-opacity sm:bg-transparent sm:backdrop-blur-none pointer-events-auto"
        onClick={onClose}
      />

      {/* Slide-out Help Drawer directly under Topbar */}
      <div
        ref={drawerRef}
        className="fixed top-14 right-0 bottom-0 w-80 sm:w-92 z-50 flex flex-col bg-white dark:bg-[#1D2125] border-l border-slate-200 dark:border-[#282E33] shadow-2xl animate-in slide-in-from-right duration-200 select-none text-slate-800 dark:text-[#DEE4EA]"
      >
        {/* Header matching Image 1: Help title + X button */}
        <div className="relative flex items-center justify-center px-4 py-3.5 border-b border-slate-100 dark:border-[#282E33]">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA]">
            Help
          </h2>
          <button
            onClick={onClose}
            title="Close Help"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Search input box matching Image 1 */}
        <div className="p-3.5 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-[#738496]" />
            <input
              type="text"
              placeholder="Search help articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9.5 rounded-lg border border-black dark:border-white bg-slate-50 dark:bg-[#22272B] pl-9.5 pr-8 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#1D2125] focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list of help options */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-0.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100/80 dark:hover:bg-[#22272B] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Icon className="h-4 w-4 text-slate-500 dark:text-[#9FADBC] group-hover:text-[#0C66E4] dark:group-hover:text-[#579DFF] shrink-0 transition-colors" />
                  <span className="truncate group-hover:text-slate-900 dark:group-hover:text-white">
                    {item.title}
                  </span>
                </div>
                {item.isExternal && (
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496] group-hover:text-slate-600 dark:group-hover:text-[#DEE4EA] shrink-0 transition-colors" />
                )}
              </button>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-8 px-4 text-center">
              <Search className="h-7 w-7 text-slate-300 dark:text-[#333C44] mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-[#DEE4EA]">
                No help articles found
              </p>
              <p className="text-[11px] text-slate-400 dark:text-[#738496] mt-0.5">
                Try searching for &quot;shortcuts&quot;, &quot;support&quot;, or &quot;navigation&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer links matching Image 1: About Jira | Terms of use | Privacy policy | Notice at collection */}
        <div className="p-4 pt-3 border-t border-slate-100 dark:border-[#282E33] shrink-0 bg-slate-50/60 dark:bg-[#161A1D]/60 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-[#9FADBC]">
            <button
              onClick={() => setActiveModal('about')}
              className="hover:text-slate-900 dark:hover:text-[#DEE4EA] hover:underline cursor-pointer transition"
            >
              About Jira
            </button>
            <a
              href="https://www.atlassian.com/legal/customer-agreement"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-[#DEE4EA] hover:underline cursor-pointer transition"
            >
              Terms of use
            </a>
            <a
              href="https://www.atlassian.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-[#DEE4EA] hover:underline cursor-pointer transition"
            >
              Privacy policy
            </a>
          </div>
          <div className="mt-1">
            <a
              href="https://www.atlassian.com/legal/privacy-policy#notice-at-collection"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-400 dark:text-[#738496] hover:text-slate-700 dark:hover:text-[#DEE4EA] hover:underline transition"
            >
              Notice at collection
            </a>
          </div>
        </div>
      </div>

      {/* Modal 1: What's Changed in Jira */}
      {activeModal === 'whatsNew' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="What’s changed in Jira"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-slate-700 dark:text-[#DEE4EA]">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-[#1C2B41] border border-blue-200 dark:border-[#579DFF]/30 flex items-start gap-2.5">
              <Lightbulb className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Latest Taskora & Jira Updates (v2.4)
                </p>
                <p className="text-[11px] text-slate-600 dark:text-[#9FADBC] mt-0.5">
                  Here are the newest highlights added to your dashboard:
                </p>
              </div>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#282E33]">
              <div className="pt-2 first:pt-0">
                <span className="font-bold text-slate-900 dark:text-white block">
                  🎨 Full Light & Dark Theme Support
                </span>
                <p className="text-slate-500 dark:text-[#9FADBC] mt-0.5">
                  Complete dual-theme optimization across all Kanban boards, Analytics & Reports, List view, and interactive drawers.
                </p>
              </div>

              <div className="pt-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  🏢 Dynamic Workspace Switching
                </span>
                <p className="text-slate-500 dark:text-[#9FADBC] mt-0.5">
                  Switch instantly between workspaces directly from the sidebar. The active space title synchronizes seamlessly on all boards.
                </p>
              </div>

              <div className="pt-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  📋 Jira Interactive List View
                </span>
                <p className="text-slate-500 dark:text-[#9FADBC] mt-0.5">
                  Toggle between Kanban columns and the high-density tabular List view with live status pills and batch selection.
                </p>
              </div>

              <div className="pt-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  📅 Single-Page Responsive Month Calendar
                </span>
                <p className="text-slate-500 dark:text-[#9FADBC] mt-0.5">
                  The monthly calendar fits perfectly in a single viewport with sleek date pickers and multi-day spanning event banners.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-[#282E33] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-white font-semibold text-xs transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 2: Keyboard Shortcuts */}
      {activeModal === 'shortcuts' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Keyboard Shortcuts"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs text-slate-700 dark:text-[#DEE4EA]">
            <p className="text-slate-500 dark:text-[#9FADBC]">
              Use these shortcuts to navigate and manage tasks faster without touching your mouse:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/70 dark:bg-[#161A1D]/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block">
                  Global Actions
                </span>
                <div className="flex items-center justify-between">
                  <span>Create task / issue</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] font-mono text-[11px] shadow-2xs">
                    c
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quick search</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] font-mono text-[11px] shadow-2xs">
                    /
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Open help menu</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] font-mono text-[11px] shadow-2xs">
                    ?
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Toggle sidebar drawer</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] font-mono text-[11px] shadow-2xs">
                    [
                  </kbd>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/70 dark:bg-[#161A1D]/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block">
                  Navigation
                </span>
                <div className="flex items-center justify-between">
                  <span>Go to Kanban board</span>
                  <div className="flex gap-1 font-mono text-[11px]">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] shadow-2xs">
                      g
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] shadow-2xs">
                      b
                    </kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Go to Projects</span>
                  <div className="flex gap-1 font-mono text-[11px]">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] shadow-2xs">
                      g
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] shadow-2xs">
                      p
                    </kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Go to Calendar</span>
                  <div className="flex gap-1 font-mono text-[11px]">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] shadow-2xs">
                      g
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] shadow-2xs">
                      c
                    </kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Close dialog / drawer</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-[#22272B] border border-slate-300 dark:border-[#4B5663] font-mono text-[11px] shadow-2xs">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-[#282E33] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-white font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 3: Give Feedback */}
      {activeModal === 'feedback' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Give feedback about Jira"
          maxWidth="max-w-md"
        >
          {feedbackSubmitted ? (
            <div className="py-6 text-center space-y-2 animate-in fade-in duration-200">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Thank you for your feedback!
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#9FADBC]">
                Your thoughts help us continuously enhance the Taskora & Jira workspace experience.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs text-slate-700 dark:text-[#DEE4EA]">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1.5">
                  How satisfied are you with Jira today?
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 rounded hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= feedbackRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-[#333C44]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 dark:text-[#9FADBC] ml-2 font-medium">
                    {feedbackRating === 5
                      ? 'Very satisfied'
                      : feedbackRating === 4
                      ? 'Satisfied'
                      : feedbackRating === 3
                      ? 'Neutral'
                      : feedbackRating === 2
                      ? 'Dissatisfied'
                      : 'Very dissatisfied'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
                  Topic / Area
                </label>
                <Select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full h-9 rounded-lg"
                >
                  <option value="general">General experience</option>
                  <option value="kanban">Kanban & Sprint board</option>
                  <option value="list">List view</option>
                  <option value="calendar">Calendar & Deadlines</option>
                  <option value="themes">Light / Dark themes</option>
                  <option value="performance">Speed & Performance</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
                  What could we improve? *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what you like or what can be better..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#1D2125] p-3 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-[#282E33]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#282E33] text-xs font-semibold text-slate-600 dark:text-[#9FADBC] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Submit feedback
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Modal 4: About Jira */}
      {activeModal === 'about' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="About Taskora & Jira"
          maxWidth="max-w-sm"
        >
          <div className="space-y-3.5 text-xs text-slate-700 dark:text-[#DEE4EA] text-center">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] flex items-center justify-center mx-auto shadow-xs border border-blue-100 dark:border-[#579DFF]/20">
              <Info className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Taskora Project Studio
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-[#738496]">
                Version 2.4.0 (Enterprise Edition)
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-[#9FADBC] leading-relaxed">
              Modern agile task tracking, Sprint management, and team collaboration system built on Atlassian design patterns.
            </p>

            <div className="pt-3 border-t border-slate-200 dark:border-[#282E33] flex justify-center">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-1.5 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-white font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default HelpDrawer;
