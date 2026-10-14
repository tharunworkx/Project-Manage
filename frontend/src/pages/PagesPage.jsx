import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight,
  User,
  Star,
} from 'lucide-react';

export default function PagesPage() {
  const [searchVal, setSearchVal] = useState('');

  const [docs, setDocs] = useState([
    {
      id: 'doc-1',
      title: 'Taskora Architecture & State Machine RFC',
      summary: 'Specifications on how work items transition between Backlog, Unstarted, Started, Completed, and Cancelled.',
      author: 'Tharun S.',
      updatedAt: 'Today at 3:42 PM',
      starred: true,
      category: 'Architecture',
    },
    {
      id: 'doc-2',
      title: 'Cycles & Sprint Burndown Strategy',
      summary: 'Mathematical breakdown of velocity points, target pace calculation, and automatic scope creep adjustments.',
      author: 'Tharun S.',
      updatedAt: 'Yesterday',
      starred: true,
      category: 'Product Specs',
    },
    {
      id: 'doc-3',
      title: 'Frontend Token System & Design Guidelines',
      summary: 'Color palettes, spacing scale, interactive keyboard shortcuts, and animation easing standards.',
      author: 'Tharun S.',
      updatedAt: '3 days ago',
      starred: false,
      category: 'Design System',
    },
    {
      id: 'doc-4',
      title: 'API Schema & Webhook Event Formats',
      summary: 'Payload signatures for task.created, task.updated, and cycle.completed webhook consumers.',
      author: 'Alex R.',
      updatedAt: 'Oct 08, 2026',
      starred: false,
      category: 'Engineering',
    },
  ]);

  const filteredDocs = docs.filter((d) =>
    d.title.toLowerCase().includes(searchVal.toLowerCase()) ||
    d.category.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#101214] text-[#DEE4EA] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-[#282E33] bg-[#101214] px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#9FADBC] mb-1">
              <span>My Software Team</span>
              <span>/</span>
              <span className="text-[#DEE4EA]">Pages</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#579DFF]/15 text-[#579DFF] flex items-center justify-center font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#DEE4EA]">Pages & Docs</h1>
                <p className="text-xs text-[#9FADBC]">
                  Collaborative specifications, architectural RFCs, and engineering guidelines.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#0C66E4] hover:bg-[#0055CC] px-3.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Page</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-3 border-t border-[#282E33]/60 relative w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#738496]" />
          <input
            type="text"
            placeholder="Search pages and specs..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-8 rounded-md border border-[#333C44] bg-[#22272B] pl-8 pr-3 text-xs text-[#DEE4EA] placeholder-[#738496] focus:border-[#579DFF] focus:outline-none"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="w-full px-6 py-6 space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => {}}
            className="flex items-center justify-between p-4.5 rounded-xl border border-[#282E33] bg-[#161A1D] hover:border-[#388BFF]/60 hover:bg-[#1C2127] transition group cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-[#22272B] text-[#579DFF] group-hover:bg-[#1C2B41] transition">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#22272B] text-[#9FADBC]">
                    {doc.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#DEE4EA] group-hover:text-[#579DFF] transition">
                    {doc.title}
                  </h3>
                  {doc.starred && (
                    <Star className="h-3.5 w-3.5 fill-[#F5CD47] text-[#F5CD47]" />
                  )}
                </div>
                <p className="text-xs text-[#9FADBC] mt-1">{doc.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#738496]">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {doc.updatedAt}
              </span>
              <ChevronRight className="h-4 w-4 text-[#738496] group-hover:text-[#DEE4EA] transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
