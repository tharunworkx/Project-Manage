import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Layers,
  X,
  Check,
  LayoutGrid,
  Columns3,
} from 'lucide-react';

export function BoardToolbar({
  searchVal,
  onSearchChange,
  onlyMe,
  onToggleOnlyMe,
  filterType,
  onFilterTypeChange,
  groupBy,
  onGroupByChange,
  onToggleInsights,
  viewMode = 'grid',
  onViewModeChange,
}) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);

  const filterRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterMenuOpen(false);
      }
      if (groupRef.current && !groupRef.current.contains(e.target)) {
        setIsGroupMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All issues' },
    { id: 'my', label: 'Only my issues' },
    { id: 'incomplete', label: 'Incomplete issues' },
    { id: 'done', label: 'Done issues' },
    { id: 'high', label: 'High priority issues' },
  ];

  const groupOptions = [
    { id: 'none', label: 'None' },
    { id: 'priority', label: 'Priority' },
    { id: 'type', label: 'Issue Type' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-3 pb-4 select-none">
      {/* Left controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search board */}
        <div className="relative w-56 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-[#738496]" />
          <input
            type="text"
            placeholder="Search board"
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 rounded-md border border-black dark:border-white bg-white dark:bg-[#22272B] pl-9 pr-7 text-sm text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] transition focus:border-black dark:focus:border-white focus:outline-none"
          />
          {searchVal && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick filter by TR avatar */}
        <button
          onClick={onToggleOnlyMe}
          title={onlyMe ? 'Showing only my issues (click to clear)' : 'Filter by TR (Only my issues)'}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-white font-bold text-[11px] transition cursor-pointer relative ${
            onlyMe
              ? 'ring-2 ring-[#0C66E4] dark:ring-[#579DFF] bg-[#7C3AED]'
              : 'bg-[#7C3AED] hover:ring-2 hover:ring-slate-300 dark:hover:ring-[#738496]'
          }`}
        >
          TR
          {onlyMe && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#0C66E4] dark:bg-[#579DFF] ring-1 ring-white dark:ring-[#101214]" />
          )}
        </button>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className={`flex h-8 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition cursor-pointer ${
              filterType !== 'all'
                ? 'bg-blue-50 border-[#0C66E4] text-[#0C66E4] dark:bg-[#1C2B41] dark:border-[#579DFF] dark:text-[#579DFF]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 dark:bg-[#22272B] dark:hover:bg-[#282E33] dark:border-[#333C44] dark:text-[#DEE4EA]'
            }`}
          >
            <Filter className="h-4 w-4 text-slate-500 dark:text-[#9FADBC]" />
            <span>Filter</span>
            {filterType !== 'all' && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#0C66E4] dark:bg-[#579DFF]" />
            )}
          </button>

          {isFilterMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-52 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] p-1.5 shadow-xl z-50 text-sm">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onFilterTypeChange && onFilterTypeChange(opt.id);
                    setIsFilterMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                    filterType === opt.id
                      ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF] font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {filterType === opt.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Group Dropdown */}
        <div className="relative" ref={groupRef}>
          <button
            onClick={() => setIsGroupMenuOpen(!isGroupMenuOpen)}
            className={`flex h-8 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition cursor-pointer ${
              groupBy !== 'none'
                ? 'bg-blue-50 border-[#0C66E4] text-[#0C66E4] dark:bg-[#1C2B41] dark:border-[#579DFF] dark:text-[#579DFF]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 dark:bg-[#22272B] dark:hover:bg-[#282E33] dark:border-[#333C44] dark:text-[#DEE4EA]'
            }`}
          >
            <Layers className="h-4 w-4 text-slate-500 dark:text-[#9FADBC]" />
            <span>Group</span>
            {groupBy !== 'none' && (
              <span className="text-xs text-[#0C66E4] dark:text-[#579DFF] font-normal capitalize">
                ({groupBy})
              </span>
            )}
          </button>

          {isGroupMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] p-1.5 shadow-xl z-50 text-sm">
              {groupOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onGroupByChange && onGroupByChange(opt.id);
                    setIsGroupMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                    groupBy === opt.id
                      ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF] font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {groupBy === opt.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-[#9FADBC]">
        {/* Layout View Mode Switcher: Grid (Scroll Down) vs Columns (Row Structure) */}
        {onViewModeChange && (
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#333C44] bg-slate-100/80 dark:bg-[#161A1D] p-0.5 shadow-2xs">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View (Scroll down one by one like attached image)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#282E33] text-[#0C66E4] dark:text-[#579DFF] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid (Down)</span>
            </button>
            <button
              onClick={() => onViewModeChange('columns')}
              title="Columns View (Row structure)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                viewMode === 'columns'
                  ? 'bg-white dark:bg-[#282E33] text-[#0C66E4] dark:text-[#579DFF] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <Columns3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Columns (Row)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
